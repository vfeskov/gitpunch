import { Observable as $ } from 'rxjs/Observable';
import { badImplementation, badData } from 'boom';
import { saveRepos, loadProfile } from '../../db';
import { validRepos, validRepo } from '../validations';

export function reposReplaceRouteHandler ({payload, auth}, reply) {
  if (!validRepos(payload)) {
    return reply(badData('repos required as an array of strings'))
  }
  const {email} = auth.credentials;
  saveRepos(email, payload)
    .catch(error => {
      console.error(error);
      return $.of(badImplementation())
    })
    .subscribe(reply);
}

export function reposCreateRouteHandler({payload, auth}, reply) {
  const {repo} = payload
  if (!validRepo(repo)) {
    return reply(badData('repo required'));
  }
  const {email} = auth.credentials;
  loadProfile(email)
    .flatMap(({repos}) => {
      if (repos.includes(repo)) {
        return $.of(repos);
      }
      return saveRepos(email, [repo].concat(repos));
    })
    .catch(error => {
      console.error(error);
      return $.of(badImplementation());
    })
    .subscribe(reply);
}

export function reposDeleteRouteHandler({params, auth}, reply) {
  const {repo} = params
  if (!validRepo(repo)) {
    return reply(badData('repo required'));
  }
  const {email} = auth.credentials;
  loadProfile(email)
    .flatMap(({repos}) => {
      if (!repos.includes(repo)) {
        return $.of(repos);
      }
      repos = repos.filter(r => r !== repo);
      return saveRepos(email, repos);
    })
    .catch(error => {
      console.error(error);
      return $.of(badImplementation());
    })
    .subscribe(reply);
}
