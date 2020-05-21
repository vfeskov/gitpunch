import * as JWT from 'jsonwebtoken'
import { minify } from 'html-minifier'
import { decode } from 'he'
import { SES } from 'aws-sdk'
import log from 'gitpunch-lib/log'
import { RepoWithTags, Tag } from './interfaces'
import namesWithOrgs from './namesWithOrgs'
import * as truncateHtml from 'truncate-html';
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
  private bodyBytes: number
  private compression: number
  private repos: RepoToSend[]
  private _subject: string

  constructor (private email: string, repos: RepoWithTags[]) {
    this.repos = repos.map(r => {
      const {repo} = r
      const [org, name] = repo.split('/')
      const tags = [...r.tags].reverse().map(tag => ({
        ...tag,
        id: `${repo}-${tag.name}`.replace(/[^\d\w]/g, '-'),
        title: title(tag)
      }))
      return { repo, tags, org, name }
    }).sort((a, b) => {
      const aN = a.name.toLowerCase();
      const bN = b.name.toLowerCase();
      return aN === bN ? 0 : (aN > bN ? 1 : -1)
    })
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
    if (!this._subject) {
      this._subject = this.repos
        .map(({repo, name, tags}) =>
          `${namesWithOrgs.includes(name) ? repo : name}@${tags.map(tag =>
            `${tag.name.replace(/^v(\d)/, '$1')}`
          ).join(', ')}`
        ).join('; ')
    }
    return this._subject
  }

  body () {
    const { repos } = this
    const hasIndex = repos.length > 1 || repos[0].tags.length > 1
    const raw = `
      <!doctype html>
      <html lang="en-us">
        <head>
          <meta charset="utf-8" />
          <title>${this.subject()}</title>
        </head>
        <body>
          <div style="margin: 0 auto; max-width: 800px; font-family: Roboto, Helvetica, Arial, sans-serif;">
            ${hasIndex ? `
            <a name="index"></a>
            <table style="border-spacing: 0; line-height: 2em; margin: 0 0 2em;" id="index">
              <tbody>
              ${repos.map(r => `
                <tr>
                  <td style="text-align: right; padding: 0; vertical-align: top;">${anchor(repoBold(r), r.tags[0])}</td>
                  <td style="padding: 0; vertical-align: top;">${anchor('@', r.tags[0])}</td>
                  <td style="padding: 0; vertical-align: top;">${r.tags.map(tag => anchor(tag.name, tag)).join(', ')}
                  </td>
                </tr>`
              ).join('')}
              </tbody>
            </table>
            ` : ''}
            ${repos.map(r =>
              r.tags.map(tag => `
            <div style="margin: 0 0 2em; border: 1px solid rgba(53,114,156,0.2);">
              <a name="${tag.id}"></a>
              <div style="background: rgba(53,114,156,0.2); padding: 0.5em; line-height: 2em;" id="${tag.id}">
                <div style="display: inline-block;">
                  <span style="word-wrap: break-word;"><a href="https://github.com/${r.repo}">${repoBold(r)}</a>@<a href="https://github.com/${r.repo}/releases/tag/${tag.name}">${tag.name}</a></span>
                  ${tag.title ? `
                  <br/>
                  <span style="font-size: 1.1em;">${tag.title}</span>
                  ` : ''}
                </div>
                <div style="float: right; font-size: 0.9em;">
                  ${hasIndex ? `
                  <span style="display: inline-block; width: 0.3em;"></span>
                  <a href="#index">Up</a>
                  ` : ''}
                </div>
                <div style="clear: both;"></div>
              </div>
              <div style="padding: 0.5em;">
                ${description(r.repo, tag)}
              </div>
            </div>`
              ).join('')
            ).join('')}
            <div style="line-height: 2em;">
              Best wishes from <a href="https://github.com/vfeskov">Vlad</a> @ <a href="${appUrl}">GitPunch</a><br/>
              <a href="https://github.com/vfeskov/gitpunch">Support me with a star</a>
            </div>
            <div style="border-top: 1px solid rgba(53,114,156,0.2); margin: 2em 0 1em;"></div>
            <small>
              This is an automated message, reply if you have any questions<br/>
              To stop getting these emails click <a href="${this.unsubscribeUrl()}">unsubscribe</a><br/>
            </small>
          </div>
        </body>
      </html>
    `
    const body = minifyHtml(style(raw))
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

function anchor (content, tag) {
  return `<a href="#${tag.id}">${content}</a>`
}

function repoBold ({ org, name }) {
  return `${org}/<strong style="font-size: 1.1em;">${name}</strong>`
}

const titleRegExp = /<title>([^<]*)<\/title>/
function title (tag: Tag) {
  try {
    const title = tag.entry.match(titleRegExp)[1].replace(/^v/, '')
    return title === tag.name.replace(/^v/, '') ? '' : title
  } catch (e) {
    return ''
  }
}

const contentRegExp = /<content[^>]*?type="([^"]+)"[^>]*?>([^<]*)<\/content>/
function description (repo: string, tag: Tag) {
  try {
    const [_, type, raw] = tag.entry.match(contentRegExp)
    const full = (type === 'html') ? decode(raw, { strict: true }) : raw
    let truncated = (truncateHtml as any)(full, 200, { byWords: true })
    if (full.length > truncated.length) {
      truncated += `<a href="https://github.com/${repo}/releases/tag/${tag.name}">READ MORE</a>`;
    }
    return truncated;
  } catch (e) {
    return 'No description'
  }
}

function style (html) {
  return html.replace(/<a /g, '<a style="color: #2979ff; text-decoration: none;"')
}

const tagsWithAttrsToStrip = /<[^>]+\s+[^>]*(data-[\w\d\-]+|class)="[^">]*"[^>]*>/g
const attrsToStrip = /(data-[\w\d\-]+|class)="[^">]*"/g
function minifyHtml (html: string) {
  // strip data-* and class attributes
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

interface RepoToSend {
  repo: string
  org: string
  name: string
  tags: TagToSend[]
}

interface TagToSend extends Tag {
  name: string
  entry: string
  id: string
  title: string
}
