process.env.AWS_ACCESS_KEY_ID = process.env.WAB_AWS_ACCESS_KEY_ID;
process.env.AWS_SECRET_ACCESS_KEY = process.env.WAB_AWS_SECRET_ACCESS_KEY;
import { create, flattenAttrs } from 'rxjs-aws-sdk/RxSimpleDB';
import { Observable as $ } from 'rxjs/Observable';

export {
  addUser,
  loadFullProfile,
  loadProfile,
  saveRepos,
  saveWatching
};

const {assign} = Object;

const DomainName = process.env.WAB_SDB_DOMAIN_NAME;
const simpleDb = create({
  region: process.env.WAB_SDB_REGION,
  endpoint: process.env.WAB_SDB_ENDPOINT
});

function loadFullProfile(email: string) {
  return simpleDb.getAttributes({DomainName, ItemName: email})
    .map(({Attributes}) => {
      if (!Attributes) {
        return assign({email, found: false});
      }
      const {watching, repos, passwordEncrypted} = flattenAttrs(Attributes);
      return {
        email,
        found: true,
        passwordEncrypted,
        watching: watching === '1' ? true : false,
        repos: repos ? repos.split(',') : []
      };
    });
}

function addUser(email: string, passwordEncrypted: string, repos: string[]) {
  return simpleDb.putAttributes({
      DomainName,
      ItemName: email,
      Attributes: [
        {Name: 'passwordEncrypted', Value: passwordEncrypted},
        {Name: 'repos', Value: repos.join(',')},
        {Name: 'watching', Value: '1'}
      ]
    });
}

function loadProfile(email: string) {
  return simpleDb.getAttributes({DomainName, ItemName: email, AttributeNames: ['repos', 'watching']})
    .map(({Attributes}) => {
      if (!Attributes) { throw new Error('User not found'); }
      const {watching, repos} = flattenAttrs(Attributes);
      return {
        email,
        watching: watching === '1' ? true : false,
        repos: repos ? repos.split(',') : []
      };
    });
}

function saveRepos(email: string, repos: string[]) {
  const Value = repos.map(r => r.replace(',', '')).join(',');
  return simpleDb.putAttributes({
    DomainName,
    ItemName: email,
    Attributes: [
      {Name: 'repos', Value, Replace: true}
    ]})
    .mapTo(repos);
}

function saveWatching(email: string, watching: boolean) {
  return simpleDb.putAttributes({
    DomainName,
    ItemName: email,
    Attributes: [
      {Name: 'watching', Value: watching ? '1' : '0', Replace: true}
    ]})
    .mapTo({watching});
}

