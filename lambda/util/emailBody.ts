export function emailBody ({ repo, tag, unsubscribeUrl, appUrl }) {
  const repoUrl = `https://github.com/${ repo }`
  const releaseUrl = `${ repoUrl }/releases/tag/${ tag }`

  return '' +

`Greetings! :)<br/>
<br/>
They released a new version of <a href="${ repoUrl }">${ repo }</a>, check it out:<br/>
<a href="${ releaseUrl }">${ releaseUrl }</a><br/>
<br/>
Have a great day,<br/>
Vladimir from <a href="${ appUrl }">Win A Beer</a><br/>
---<br/>
<a href="https://github.com/vfeskov/win-a-beer">&#9733; Star me on GitHub</a><br/>
To stop getting these emails click <a href="${ unsubscribeUrl }">unsubscribe</a><br/>
<br/>`

}
