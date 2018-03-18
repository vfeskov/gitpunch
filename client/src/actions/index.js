export const REQUEST = 'REQUEST'
export const SUCCESS = 'SUCCESS'
export const FAILURE = 'FAILURE'

function createRequestTypes(base) {
  return [REQUEST, SUCCESS, FAILURE].reduce((acc, type) => {
		acc[type] = `${base}_${type}`
		return acc
	}, {})
}
const IS_REQUEST_FAILURE = new RegExp(`_${FAILURE}$`)
export function isRequestFailure({ type }) {
  return IS_REQUEST_FAILURE.test(type)
}

export const SIGN_IN = createRequestTypes('SIGN_IN')
export const SIGN_OUT = createRequestTypes('SIGN_OUT')
export const SAVE_CHECK_AT = createRequestTypes('SAVE_CHECK_AT')
export const SAVE_FREQUENCY = createRequestTypes('SAVE_FREQUENCY')
export const FETCH_PROFILE = createRequestTypes('FETCH_PROFILE')
export const CREATE_REPO = createRequestTypes('CREATE_REPO')
export const DELETE_REPO = createRequestTypes('DELETE_REPO')
export const UNWATCH = createRequestTypes('UNWATCH')
export const SAVE_WATCHING = createRequestTypes('SAVE_WATCHING')
export const FETCH_SUGGESTIONS = createRequestTypes('FETCH_SUGGESTIONS')

export const SET_REPO_ADD_VALUE = 'SET_REPO_ADD_VALUE'
export const ADD_REPO_TO_BUFFER =  'ADD_REPO_TO_BUFFER'
export const REMOVE_REPO_FROM_BUFFER = 'REMOVE_REPO_FROM_BUFFER'
export const ADD_REPO = 'ADD_REPO'
export const REMOVE_REPO = 'REMOVE_REPO'
export const TOGGLE_WATCHING = 'TOGGLE_WATCHING'
export const SET_SHOWN_REPOS = 'SET_SHOWN_REPOS'
export const SET_STARRED_OPEN = 'SET_STARRED_OPEN'
export const SET_SHOW_SPLASH = 'SET_SHOW_SPLASH'

function action(type, payload = {}) {
  return { type, ...payload }
}

export const signIn = {
  requestId: SIGN_IN[REQUEST],
  request: ({ email, password, repos }) => action(SIGN_IN[REQUEST], { email, password, repos }),
  success: profile => action(SIGN_IN[SUCCESS], { profile }),
  failure: error => action(SIGN_IN[FAILURE], { error }),
}
export const signOut = {
  requestId: SIGN_OUT[REQUEST],
  request: () => action(SIGN_OUT[REQUEST]),
  success: () => action(SIGN_OUT[SUCCESS]),
  failure: error => action(SIGN_OUT[FAILURE], { error }),
}
export const saveCheckAt = {
  requestId: SAVE_CHECK_AT[REQUEST],
  request: checkAt => action(SAVE_CHECK_AT[REQUEST], { checkAt }),
  success: ({ checkAt }) => action(SAVE_CHECK_AT[SUCCESS], { checkAt }),
  failure: error => action(SAVE_CHECK_AT[FAILURE], { error }),
}
export const saveFrequency = {
  requestId: SAVE_FREQUENCY[REQUEST],
  request: ({ frequency, checkAt }) => action(SAVE_FREQUENCY[REQUEST], { frequency, checkAt }),
  success: ({ frequency, checkAt }) => action(SAVE_FREQUENCY[SUCCESS], { frequency, checkAt }),
  failure: error => action(SAVE_FREQUENCY[FAILURE], { error }),
}
export const fetchProfile = {
  requestId: FETCH_PROFILE[REQUEST],
  request: () => action(FETCH_PROFILE[REQUEST]),
  success: profile => action(FETCH_PROFILE[SUCCESS], { profile }),
  failure: error => action(FETCH_PROFILE[FAILURE], { error }),
}
export const createRepo = {
  requestId: CREATE_REPO[REQUEST],
  request: repo => action(CREATE_REPO[REQUEST], { repo }),
  success: ({ repos }) => action(CREATE_REPO[SUCCESS], { repos }),
  failure: error => action(CREATE_REPO[FAILURE], { error }),
}
export const deleteRepo = {
  requestId: DELETE_REPO[REQUEST],
  request: repo => action(DELETE_REPO[REQUEST], { repo }),
  success: ({ repos }) => action(DELETE_REPO[SUCCESS], { repos }),
  failure: error => action(DELETE_REPO[FAILURE], { error }),
}
export const unwatch = {
  requestId: UNWATCH[REQUEST],
  request: lambdajwt => action(UNWATCH[REQUEST], { lambdajwt }),
  success: ({ watching, sameUser }) => action(UNWATCH[SUCCESS], { watching, sameUser }),
  failure: error => action(UNWATCH[FAILURE], { error }),
}
export const saveWatching = {
  requestId: SAVE_WATCHING[REQUEST],
  request: watching => action(SAVE_WATCHING[REQUEST], { watching }),
  success: ({ watching }) => action(SAVE_WATCHING[SUCCESS], { watching }),
  failure: error => action(SAVE_WATCHING[FAILURE], { error }),
}
export const fetchSuggestions = {
  requestId: FETCH_SUGGESTIONS[REQUEST],
  request: ({ value }) => action(FETCH_SUGGESTIONS[REQUEST], { value }),
  success: ({ items }) => action(FETCH_SUGGESTIONS[SUCCESS], { items }),
  failure: error => action(FETCH_SUGGESTIONS[FAILURE], { error }),
}

export const setRepoAddValue = value => action(SET_REPO_ADD_VALUE, { value })
export const addRepoToBuffer = repo => action(ADD_REPO_TO_BUFFER, { repo })
export const removeRepoFromBuffer = repo => action(REMOVE_REPO_FROM_BUFFER, { repo })
export const addRepo = repo => action(ADD_REPO, { repo })
export const removeRepo = repo => action(REMOVE_REPO, { repo })
export const toggleWatching = () => action(TOGGLE_WATCHING)
export const setShownRepos = repos => action(SET_SHOWN_REPOS, { repos })
export const setStarredOpen = value => action(SET_STARRED_OPEN, { value })
export const setShowIntro = state => action(SET_SHOW_SPLASH, { state })

export const mapDispatchToProps = () => ({
  signIn: signIn.request,
  signOut: signOut.request,
  saveCheckAt: saveCheckAt.request,
  saveFrequency: saveFrequency.request,
  fetchProfile: fetchProfile.request,
  createRepo: createRepo.request,
  deleteRepo: deleteRepo.request,
  unwatch: unwatch.request,
  saveWatching: saveWatching.request,
  fetchSuggestions: fetchSuggestions.request,
  toggleWatching,
  setRepoAddValue,
  addRepoToBuffer,
  removeRepoFromBuffer,
  addRepo,
  removeRepo,
  setShownRepos,
  setStarredOpen,
  setShowIntro
})
