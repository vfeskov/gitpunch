import * as JWT from 'jsonwebtoken'
import { ActionableUser, RepoWithTags } from './interfaces'
const privateKey = process.env.JWT_RSA_PRIVATE_KEY.replace(/\\n/g, '\n')
const appUrl = process.env.APP_URL

export function subject (repos: RepoWithTags[]) {
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

export function body (user: ActionableUser, repos: RepoWithTags[]) {
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
