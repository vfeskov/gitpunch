import * as JWT from 'jsonwebtoken'
import { decode } from 'he'
import { SES } from 'aws-sdk'
import log from './log'
import { ActionableUser, RepoWithTags } from './interfaces'
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
    log('alert', { params })
    return new Promise((r, e) =>
      ses.sendEmail(params, (err, data) => err ? e(err) : r(data))
    )
  }

  subject () {
    const { repos, oneRelease } = this
    let result = `New GitHub Release${oneRelease ? ': ' : 's: '}`
    if (repos.length === 1){
      result += repos[0].repo + ' - '
      const tagNames = repos[0].tags.map(t => t.name)
      if (tagNames.length < 4) {
        return result + tagNames.join(', ')
      }
      return result + tagNames.slice(0, 3).join(', ') + ' and more'
    }
    const repoNames = repos.map(r => r.repo)
    if (repos.length < 4) {
      return result + repoNames.join(', ')
    }
    return result + repoNames.slice(0, 3).join(', ') + ' and more'
  }

  body () {
    const { repos, oneRelease } = this
    return `
      <div>
        Greetings :)<br/>
        <br/>
        Happy to tell you that a ${oneRelease ? 'new release has' : 'few new releases have'} happened:
        ${repos.map(({ repo, tags }) =>
          tags.map(({ name, entry }) => '' +
            `<div style="margin: 20px 0">
              <div style="font-size: 1.5em; line-height: 1.5em; margin: 0;" word-wrap: "break-word">
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
        Best wishes from <a href="${appUrl}">Win A Beer</a><br/>
        <br/>
        ---<br/>
        <small>
          This is an automated message, reply if you have any questions<br/>
          To stop getting these emails click <a href="${this.unsubscribeUrl()}">unsubscribe</a><br/>
          <a href="https://github.com/vfeskov/win-a-beer">Support <strong>Win A Beer</strong> with a star ♥</a>
        </small>
      </div>`
        .replace(/\s*\n\s*/g, ' ')
        .replace(/\s+</g, ' <')
        .replace(/>\s+/g, '> ')
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
