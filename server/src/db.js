import { SimpleDB } from 'aws-sdk'
const { assign } = Object

process.env.AWS_ACCESS_KEY_ID = process.env.WAB_AWS_ACCESS_KEY_ID
process.env.AWS_SECRET_ACCESS_KEY = process.env.WAB_AWS_SECRET_ACCESS_KEY
const DomainName = process.env.WAB_SDB_DOMAIN_NAME
const simpleDb = new SimpleDB({
  region: process.env.WAB_SDB_REGION,
  endpoint: process.env.WAB_SDB_ENDPOINT
})

export function loadFullProfile (email, callback) {
  return new Promise((resolve, error) => {
    simpleDb.getAttributes(
      { DomainName, ItemName: email },
      (err, data) => {
        if (err) { return error(err) }
        const { Attributes } = data
        if (!Attributes) {
          return resolve(assign({ email, found: false }))
        }
        const { watching, repos, passwordEncrypted } = flattenAttrs(Attributes)
        resolve({
          email,
          found: true,
          passwordEncrypted,
          watching: watching === '1' ? true : false,
          repos: repos ? repos.split(',') : []
        })
      }
    )
  })
}

export function addUser (email, passwordEncrypted, repos) {
  return new Promise((resolve, error) => {
    simpleDb.putAttributes({
      DomainName,
      ItemName: email,
      Attributes: [
        { Name: 'passwordEncrypted', Value: passwordEncrypted },
        { Name: 'repos', Value: repos.join(',') },
        { Name: 'watching', Value: '1' }
      ]
    }, (err, data) => {
      if (err) { return error(err) }
      resolve(data)
    })
  })
}

export function loadProfile (email) {
  return new Promise((resolve, error) => {
    simpleDb.getAttributes(
      { DomainName, ItemName: email, AttributeNames: ['repos', 'watching'] },
      (err, data) => {
        if (err) { return error(err) }
        const { Attributes } = data
        if (!Attributes) { error('User not found') }
        const { watching, repos } = flattenAttrs(Attributes)
        resolve({
          email,
          watching: watching === '1' ? true : false,
          repos: repos ? repos.split(',') : []
        })
      }
    )
  })
}

export function saveRepos (email, repos) {
  const Value = repos.map(r => r.replace(',', '')).join(',')
  return new Promise((resolve, error) => {
    simpleDb.putAttributes(
      {
        DomainName,
        ItemName: email,
        Attributes: [
          { Name: 'repos', Value, Replace: true }
        ]
      },
      err => {
        if (err) { return error(err) }
        resolve(repos)
      }
    )
  })
}

export function saveWatching (email, watching) {
  return new Promise((resolve, error) => {
    simpleDb.putAttributes(
      {
        DomainName,
        ItemName: email,
        Attributes: [
          { Name: 'watching', Value: watching ? '1' : '0', Replace: true }
        ]
      },
      err => {
        if (err) { return error(err) }
        resolve({ email, watching })
      }
    )
  })
}

export function flattenAttrs (attrs) {
  return attrs.reduce((res, attr) =>
    assign(res, { [attr.Name]: attr.Value }),
  {});
}
