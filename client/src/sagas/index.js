import { all, take, takeLatest, put, call, fork, select, delay } from 'redux-saga/effects'
import * as actions from '../actions'
import * as api from '../services/api'
// import * as cookie from '../services/cookie'
import * as github from '../services/github'

function* onApiRequest (actionGroup, apiMethod) {
  while (true) {
    const { type, ...params } = yield take(actionGroup.requestId)
    try {
      const response = yield call(apiMethod, params)
      yield put(actionGroup.success(response))
    } catch (error) {
      yield put(actionGroup.failure(error))
    }
  }
}

const apiActions = (
  'signIn signOut patchProfile unwatch createRepoInDb createRepos deleteRepoInDb ' +
  'patchRepoInDb deleteAllReposInDb patchAllReposInDb'
).split(' ')

const genericApiRequests = apiActions.reduce((r, id) =>
  r.concat(onApiRequest.bind(null, actions[id], api[id]))
, [])

function* onToggleWatching () {
  while (true) {
    yield take(actions.TOGGLE_WATCHING)
    const { watching } = yield select()
    yield put(actions.patchProfile.request({ watching: !watching }))
  }
}

function* onToggleWatchingStars () {
  while (true) {
    yield take(actions.TOGGLE_WATCHING_STARS)
    const { watchingStars } = yield select()
    yield put(actions.patchProfile.request({ watchingStars: watchingStars ? 0 : 1 }))
  }
}

function* onToggleUnwatchingNonstars () {
  while (true) {
    yield take(actions.TOGGLE_UNWATCHING_NONSTARS)
    const { unwatchingNonstars } = yield select()
    yield put(actions.patchProfile.request({ watchingStars: unwatchingNonstars ? 1 : 2 }))
  }
}

function* onSaveWatchingStarsSuccess () {
  while (true) {
    const { watchingStars: req } = yield take(actions.PATCH_PROFILE[actions.REQUEST])
    if (typeof req === 'undefined') {
      continue
    }
    const { watchingStars: prev } = yield select()
    const { watchingStars: final } = yield take(actions.PATCH_PROFILE[actions.SUCCESS])
    if (!final || prev) {
      continue
    }
    yield put(actions.addStars.request())
  }
}

function* onPatchRepo () {
  while (true) {
    const { type, ...payload } = yield take(actions.PATCH_REPO)
    const { signedIn } = yield select()
    yield put(signedIn ?
      actions.patchRepoInDb.request(payload) :
      actions.patchRepoInBuffer(payload))
  }
}

function* onPatchAllRepos () {
  while (true) {
    const { type, ...payload } = yield take(actions.PATCH_ALL_REPOS)
    const { signedIn } = yield select()
    yield put(signedIn ?
      actions.patchAllReposInDb.request(payload) :
      actions.patchAllReposInBuffer(payload))
  }
}

function* onCreateRepo () {
  while (true) {
    const { type, ...payload } = yield take(actions.CREATE_REPO)
    const { signedIn } = yield select()
    const action = signedIn ?
      actions.createRepoInDb.request(payload) :
      actions.createRepoInBuffer(payload)
    yield put(action)
  }
}

function* onDeleteRepo () {
  while (true) {
    const { type, ...payload } = yield take(actions.DELETE_REPO)
    const { signedIn } = yield select()
    yield put(signedIn ?
      actions.deleteRepoInDb.request(payload) :
      actions.deleteRepoInBuffer(payload))
  }
}

function* onDeleteAllRepos () {
  while (true) {
    yield take(actions.DELETE_ALL_REPOS)
    const { signedIn } = yield select()
    yield put(signedIn ?
      actions.deleteAllReposInDb.request() :
      actions.deleteAllReposInBuffer())
  }
}

function* onSignedInChanges () {
  while (true) {
    yield take('*')
    const { signedIn, savedRepos, bufferRepos, shownRepos } = yield select()
    const newShownRepos = signedIn ? savedRepos : bufferRepos
    if (newShownRepos === shownRepos) { continue }
    yield put(actions.setShownRepos({ repos: newShownRepos }))
  }
}

function* fetchSuggestions ({ value }) {
  const { repoAdd } = yield select()
  if (!value || value.trim().length < 2 || repoAdd.disabled) {
    yield put(actions.fetchSuggestions.success({ items: [] }))
    return
  }
  yield delay(300)
  yield put(actions.fetchSuggestions.request({ value }))
  const { accessToken } = yield select()
  try {
    const response = yield call(github.loadSuggestions, { value, accessToken })
    yield put(actions.fetchSuggestions.success(response))
  } catch (error) {
    yield put(actions.fetchSuggestions.failure(error))
  }
}

function* onSetRepoAddValue () {
  yield takeLatest([
    actions.SET_REPO_ADD_VALUE,
    actions.CREATE_REPO_IN_BUFFER,
    actions.createRepoInDb.requestId
  ], fetchSuggestions);
}

function* addStars ({ loadStarsArgs, accessToken }) {
  let stars, next
  try {
    const { items, links } = yield call(...loadStarsArgs)
    stars = items.map(i => i.full_name)
    next = links.next
  } catch (e) {
    yield put(actions.addStars.failure(new Error(`Error loading stars: ${e.message}`)))
    return
  }
  const { savedRepos } = yield select()
  const newRepos = stars.filter(r => !savedRepos.includes(r)).reverse()
  try {
    const successEvent = {}
    if (newRepos.length) {
      const { repos } = yield call(api.createRepos, { repos: newRepos.map(repo => ({ repo, muted: false, filter: 3 })) })
      successEvent.repos = repos
    } else {
      successEvent.repos = savedRepos
    }
    yield put(actions.createRepos.success(successEvent))
  } catch (e) {
    yield put(actions.addStars.failure(new Error(`Error saving repos: ${e.message}`)))
    return
  }
  if (!next) {
    yield put(actions.addStars.success())
    return
  }
  yield addStars({
    loadStarsArgs: [github.loadStarsLink, { link: next, accessToken }],
    accessToken
  })
}

function* onAddStars () {
  while (true) {
    yield take(actions.addStars.requestId)
    const { signedIn, accessToken } = yield select()
    if (!signedIn || !accessToken) {
      continue
    }
    yield addStars({
      loadStarsArgs: [github.loadStarsFirstPage, accessToken],
      accessToken
    })
  }
}

function* onStartup () {
  const { serverRendered } = yield select()
  if (serverRendered) { return }
  yield put(actions.fetchProfile.request())
  try {
    const profile = yield call(api.fetchProfile)
    yield put(actions.fetchProfile.success(profile))
  } catch (error) {
    yield put(actions.fetchProfile.failure(error))
  }
  const { signedIn, savedRepos, bufferRepos } = yield select()
  yield put(actions.setShownRepos({ repos: signedIn ? savedRepos : bufferRepos }))
  // if (signedIn || cookie.get('dontShowIntro')) {
  //   yield put(actions.setShowIntro({ state: 'n' }))
  // } else {
  //   yield put(actions.setShowIntro({ state: 'y' }))
  // }
}

export default function* root () {
  yield all([
    ...genericApiRequests.map(h => fork(h)),
    fork(onSignedInChanges),
    fork(onToggleWatching),
    fork(onToggleWatchingStars),
    fork(onToggleUnwatchingNonstars),
    fork(onSaveWatchingStarsSuccess),
    fork(onPatchRepo),
    fork(onPatchAllRepos),
    fork(onCreateRepo),
    fork(onDeleteRepo),
    fork(onDeleteAllRepos),
    fork(onSetRepoAddValue),
    fork(onAddStars),
    fork(onStartup)
  ])
}
