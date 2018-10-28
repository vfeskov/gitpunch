import { SUCCESS, CREATE_REPO_IN_BUFFER, CREATE_REPO_IN_DB, SELECT_REPO } from '../actions'

export default function selectedRepo (state = null, { type, ...payload}) {
  switch (type) {
    case CREATE_REPO_IN_BUFFER:
      return payload.repo
    case CREATE_REPO_IN_DB[SUCCESS]:
      return payload.repos.length ? payload.repos[0].repo : null
    case SELECT_REPO:
      return state === payload.repo ? null : payload.repo
    default:
      return state
  }
}
