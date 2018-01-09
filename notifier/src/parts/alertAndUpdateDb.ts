import { Collection } from 'mongodb'
import { ActionableUser, RepoWithTags, Alerted } from './interfaces'
import { ALERT_AND_UPDATE_DB, ONLY_UPDATE_DB } from './constants'
import { SES } from 'aws-sdk'
import * as JWT from 'jsonwebtoken'
import log from './log'

const region = process.env.SES_REGION
const privateKey = process.env.JWT_RSA_PRIVATE_KEY.replace(/\\n/g, '\n')
const appUrl = process.env.APP_URL
const from = process.env.FROM
const ses = new SES({
  apiVersion: '2010-12-01',
  region
})

export default function alertAndUpdateDb (users: ActionableUser[], collection: Collection) {
  return Promise.all(users.map(async user => {
    try {
      if (user.actions[ALERT_AND_UPDATE_DB].length) {
        await alert(user)
      }
      await updateDb(user, collection)
    } catch (error) {
      log('alertAndUpdateDbError', { user, error })
    }
  }))
}

export async function alert (user: ActionableUser): Promise<any> {
  const { email, actions } = user
  const toAlert = actions[ALERT_AND_UPDATE_DB]

  const params = {
    Source: from,
    Destination: { ToAddresses: [email] },
    Message: {
      Subject: {
        Data: subject(toAlert)
      },
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: body(user, toAlert)
        }
      }
    }
  }
  log('alert', { params })
  return new Promise((r, e) =>
    ses.sendEmail(params, (err, data) => err ? e(err) : r(data))
  )
}

export async function updateDb (user: ActionableUser, collection: Collection): Promise<any> {
  const { _id, alerted, actions } = user
  const newAlerted = [
    ...actions[ALERT_AND_UPDATE_DB],
    ...actions[ONLY_UPDATE_DB]
  ].reduce((newAlerted, { repo, tags }) => {
    newAlerted[repo] = tags[0].name
    return newAlerted
  }, {}) as Alerted
  Object.assign(alerted, newAlerted)
  const alertedAsArray = Object.keys(alerted).map(repo => [repo, alerted[repo]])
  log('updateDb', { _id, alerted })
  return collection.updateOne(
    { _id: user._id },
    { $set: { alerted: alertedAsArray } }
  )
}

function subject (repos: RepoWithTags[]) {
  let result = `New GitHub Release${repos.length === 1 && repos[0].tags.length === 1 ? ': ' : 's: '}`
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

function body (user: ActionableUser, repos: RepoWithTags[]) {
  return `
    <div>
      Greetings :)<br/>
      <br/>
      These releases have happened since I last checked:
      <ul style="padding-left: 25px; margin: 0; line-height: 28px;">
      ${repos.map(({ repo, tags }) => '' +
        `<li>
          <strong><a href="https://github.com/${repo}">${repo}</a></strong>
          <ul style="padding-left: 25px;">
          ${tags.map(({ name, zipball_url, tarball_url, commit }) => '' +
            `<li>
              <strong><a href="https://github.com/${repo}/releases/tag/${name}">${name}</a></strong>
              &#32;&middot;&#32;
              <a href="${commit.url}">commit</a>
              &#32;&middot;&#32;
              <a href="${zipball_url}">zip</a>
              &#32;&middot;&#32;
              <a href="${tarball_url}">tar</a>
            </li>`
          ).join('')}
          </ul>
        </li>`
      ).join('')}
      </ul>
      <br/>
      Best wishes from&#32;<a href="${appUrl}">Win A Beer</a><br/>
      <br/>
      ---<br/>
      <small>
        This is an automated message, reply if you have any questions<br/>
        To stop getting these emails click&#32;<a href="${unsubscribeUrl(user)}">unsubscribe</a><br/>
        <a href="https://github.com/vfeskov/win-a-beer">&#9733; Star me on GitHub</a>
      </small>
    </div>`
      .replace(/\s*\n\s*/g, '')
      .replace(/\s+</g, '<')
      .replace(/>\s+/g, '>')
}

function unsubscribeUrl (user: ActionableUser) {
  const token = JWT.sign(
    { email: user.email },
    privateKey,
    { algorithm: 'RS256' }
  )
  return `${appUrl}/unsubscribe/${token}`
}
