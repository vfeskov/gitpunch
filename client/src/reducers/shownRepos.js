import { SET_SHOWN_REPOS } from '../actions'

export default function savedRepos (state = [], action) {
  switch (action.type) {
    case SET_SHOWN_REPOS:
      return action.repos
    default:
      return state
  }
}
