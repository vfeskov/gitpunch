import * as JWT from 'jsonwebtoken'
import { minify } from 'html-minifier'
import { decode } from 'he'
import { SES } from 'aws-sdk'
import log from 'gitpunch-lib/log'
import { ActionableUser, RepoWithTags } from './interfaces'
const { byteLength } = Buffer;
const privateKey = process.env.JWT_RSA_PRIVATE_KEY.replace(/\\n/g, '\n')
const appUrl = process.env.APP_URL
const from = process.env.FROM
const region = process.env.SES_REGION
const ses = new SES({
  apiVersion: '2010-12-01',
  region
})

export default class Email {
  private oneRelease: boolean
  private bodyBytes: number
  private compression: number

  constructor (private email: string, private repos: RepoWithTags[]) {
    this.oneRelease = repos.length === 1 && repos[0].tags.length === 1
  }

  send () {
    const params = {
      Source: from,
      Destination: { ToAddresses: [this.email] },
      Message: {
        Subject: {
          Data: this.subject()
        },
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: this.body()
          }
        }
      }
    }
    log('alert', {
      email: this.email,
      subject: params.Message.Subject.Data,
      body: params.Message.Body.Html.Data,
      bodyBytes: this.bodyBytes,
      compression: this.compression
    })
    return new Promise((r, e) =>
      ses.sendEmail(params, (err, data) => err ? e(err) : r(data))
    )
  }

  subject () {
    return this.repos
      .map(({repo, tags}) =>
        tags.map(tag =>
          `${repo}@${tag.name.replace(/^v(\d)/, '$1')}`
        ).join(', ')
      ).join(', ')
  }

  body () {
    const { repos, oneRelease } = this
    const raw = `
      <div>
        ${repos.map(({ repo, tags }) =>
          tags.map(({ name, entry }) => '' +
            `<div style="margin: 20px 0">
              <div style="font-size: 1.5em; line-height: 1.5em; margin: 0; word-wrap: break-word;">
                <a href="https://github.com/${repo}">${repo}</a>
                <a href="https://github.com/${repo}/releases/tag/${name}" style="font-weight: bold;">${name}</a>
              </div>
              <div style="padding: 10px; border: 1px dashed #888;">
                ${description(entry)}
              </div>
            </div>`
          ).join('')
        ).join('')}
        <br/>
        Best wishes from <a href="${appUrl}">GitPunch</a><br/>
        <br/>
        ---<br/>
        <small>
          This is an automated message, reply if you have any questions<br/>
          To stop getting these emails click <a href="${this.unsubscribeUrl()}">unsubscribe</a><br/>
          <a href="https://github.com/vfeskov/gitpunch">Support <strong>GitPunch</strong> with a star ♥</a>
        </small>
      </div>
    `
    const body = minifyHtml(raw)
    this.bodyBytes = byteLength(body)
    this.compression = 1 - this.bodyBytes / byteLength(raw)
    return body
  }

  private unsubscribeUrl () {
    const token = JWT.sign(
      { email: this.email },
      privateKey,
      { algorithm: 'RS256' }
    )
    return `${appUrl}/unsubscribe/${token}`
  }
}

const contentRegExp = /<content[^>]*?type="([^"]+)"[^>]*?>([^<]*)<\/content>/
function description (entry: string) {
  try {
    const [_, type, raw] = entry.match(contentRegExp)
    return type === 'html' ? decode(raw, { strict: true }) : raw
  } catch (e) {
    return 'No description'
  }
}

const tagsWithAttrsToStrip = /<[^>]+\s+[^>]*(data-[\w\d\-]+|class|id)="[^">]*"[^>]*>/g
const attrsToStrip = /(data-[\w\d\-]+|class|id)="[^">]*"/g
function minifyHtml (html: string) {
  // strip data-*, class and id attributes
  (html.match(tagsWithAttrsToStrip) || []).forEach(match => {
    const stripped = match.replace(attrsToStrip, '')
    html = html.replace(match, stripped)
  })
  try {
    return minify(html, {
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      decodeEntities: true,
      html5: true,
      minifyCSS: true,
      minifyJS: true,
      processConditionalComments: true,
      removeAttributeQuotes: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeOptionalTags: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeTagWhitespace: true,
      sortAttributes: true,
      sortClassName: true,
      trimCustomFragments: true,
      useShortDoctype: true
    })
  } catch (e) {
    return html
  }
}
