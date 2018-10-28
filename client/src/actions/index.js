export const REQUEST = 'REQUEST'
export const SUCCESS = 'SUCCESS'
export const FAILURE = 'FAILURE'

const IS_REQUEST_FAILURE = new RegExp(`_${FAILURE}$`)
export function isRequestFailure({ type }) {
  return IS_REQUEST_FAILURE.test(type)
}

export const SIGN_IN = createRequestTypes('SIGN_IN')
export const SIGN_OUT = createRequestTypes('SIGN_OUT')
export const PATCH_PROFILE = createRequestTypes('PATCH_PROFILE')
export const FETCH_PROFILE = createRequestTypes('FETCH_PROFILE')
export const UNWATCH = createRequestTypes('UNWATCH')
export const CREATE_REPOS = createRequestTypes('CREATE_REPOS')
export const ADD_STARS = createRequestTypes('ADD_STARS')
export const FETCH_SUGGESTIONS = createRequestTypes('FETCH_SUGGESTIONS')
export const SET_REPO_ADD_VALUE = 'SET_REPO_ADD_VALUE'
export const TOGGLE_WATCHING = 'TOGGLE_WATCHING'
export const SET_SHOWN_REPOS = 'SET_SHOWN_REPOS'
export const SET_STARS_OPEN = 'SET_STARS_OPEN'
export const SET_SHOW_INTRO = 'SET_SHOW_INTRO'
export const TOGGLE_WATCHING_STARS = 'TOGGLE_WATCHING_STARS'
export const TOGGLE_UNWATCHING_NONSTARS = 'TOGGLE_UNWATCHING_NONSTARS'
export const SELECT_REPO = 'SELECT_REPO'

export const PATCH_REPO = 'PATCH_REPO'
export const PATCH_REPO_IN_BUFFER =  'PATCH_REPO_IN_BUFFER'
export const PATCH_REPO_IN_DB = createRequestTypes('PATCH_REPO_IN_DB')

export const PATCH_ALL_REPOS = 'PATCH_ALL_REPOS'
export const PATCH_ALL_REPOS_IN_BUFFER =  'PATCH_ALL_REPOS_IN_BUFFER'
export const PATCH_ALL_REPOS_IN_DB = createRequestTypes('PATCH_ALL_REPOS_IN_DB')

export const CREATE_REPO = 'CREATE_REPO'
export const CREATE_REPO_IN_BUFFER =  'CREATE_REPO_IN_BUFFER'
export const CREATE_REPO_IN_DB = createRequestTypes('CREATE_REPO_IN_DB')

export const DELETE_REPO = 'DELETE_REPO'
export const DELETE_REPO_IN_BUFFER = 'DELETE_REPO_IN_BUFFER'
export const DELETE_REPO_IN_DB = createRequestTypes('DELETE_REPO_IN_DB')

export const DELETE_ALL_REPOS = 'DELETE_ALL_REPOS'
export const DELETE_ALL_REPOS_IN_BUFFER = 'DELETE_ALL_REPOS_IN_BUFFER'
export const DELETE_ALL_REPOS_IN_DB = createRequestTypes('DELETE_ALL_REPOS_IN_DB')

export const signIn = requestActionCreators(SIGN_IN)
export const signOut = requestActionCreators(SIGN_OUT)
export const patchProfile = requestActionCreators(PATCH_PROFILE)
export const fetchProfile = requestActionCreators(FETCH_PROFILE)
export const unwatch = requestActionCreators(UNWATCH)
export const fetchSuggestions = requestActionCreators(FETCH_SUGGESTIONS)
export const createRepos = requestActionCreators(CREATE_REPOS)
export const addStars = requestActionCreators(ADD_STARS)
export const setRepoAddValue = params => action(SET_REPO_ADD_VALUE, params)
export const toggleWatching = () => action(TOGGLE_WATCHING)
export const setShownRepos = params => action(SET_SHOWN_REPOS, params)
export const setStarsOpen = params => action(SET_STARS_OPEN, params)
export const setShowIntro = params => action(SET_SHOW_INTRO, params)
export const toggleWatchingStars = () => action(TOGGLE_WATCHING_STARS)
export const toggleUnwatchingNonstars = () => action(TOGGLE_UNWATCHING_NONSTARS)
export const selectRepo = params => action(SELECT_REPO, params)

export const createRepo = params => action(CREATE_REPO, params)
export const createRepoInBuffer = params => action(CREATE_REPO_IN_BUFFER, params)
export const createRepoInDb = requestActionCreators(CREATE_REPO_IN_DB)

export const deleteRepo = params => action(DELETE_REPO, params)
export const deleteRepoInBuffer = params => action(DELETE_REPO_IN_BUFFER, params)
export const deleteRepoInDb = requestActionCreators(DELETE_REPO_IN_DB)

export const patchRepo = params => action(PATCH_REPO, params)
export const patchRepoInBuffer = params => action(PATCH_REPO_IN_BUFFER, params)
export const patchRepoInDb = requestActionCreators(PATCH_REPO_IN_DB)

export const patchAllRepos = params => action(PATCH_ALL_REPOS, params)
export const patchAllReposInBuffer = params => action(PATCH_ALL_REPOS_IN_BUFFER, params)
export const patchAllReposInDb = requestActionCreators(PATCH_ALL_REPOS_IN_DB)

export const deleteAllRepos = () => action(DELETE_ALL_REPOS)
export const deleteAllReposInBuffer = () => action(DELETE_ALL_REPOS_IN_BUFFER)
export const deleteAllReposInDb = requestActionCreators(DELETE_ALL_REPOS_IN_DB)

function createRequestTypes (base) {
  return [REQUEST, SUCCESS, FAILURE].reduce((acc, type) => {
		acc[type] = `${base}_${type}`
		return acc
	}, {})
}

function action (type, payload = {}) {
  return { type, ...payload }
}

function requestActionCreators (requestType) {
  return {
    requestId: requestType[REQUEST],
    request: params => action(requestType[REQUEST], params),
    success: response => action(requestType[SUCCESS], response),
    failure: error => action(requestType[FAILURE], { error })
  }
}
