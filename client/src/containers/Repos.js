import Repos from '../components/Repos'
import { connect } from 'react-redux'
import { deleteRepo, patchProfile, toggleWatching, patchRepo, deleteAllRepos, patchAllRepos, selectRepo } from '../actions'

export default connect(
  state => ({
    alerted: state.alerted,
    checkAt: state.checkAt,
    frequency: state.frequency,
    shownRepos: state.shownRepos,
    signedIn: state.signedIn,
    watching: state.watching,
    unwatchingNonstars: state.unwatchingNonstars,
    starsWorking: state.starsWorking,
    watchingStars: state.watchingStars,
    selectedRepo: state.selectedRepo
  }),
  {
    deleteRepo,
    deleteAllRepos,
    patchRepo,
    patchAllRepos,
    toggleWatching,
    patchProfile: patchProfile.request,
    selectRepo
  }
)(Repos)
