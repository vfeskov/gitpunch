import Repos from '../components/Repos'
import { connect } from 'react-redux'
import { removeRepo, saveCheckAt, saveFrequency, toggleWatching, muteRepo, removeAllRepos, muteAllRepos } from '../actions'

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
    watchingStars: state.watchingStars
  }),
  {
    removeRepo,
    removeAllRepos,
    muteRepo,
    muteAllRepos,
    toggleWatching,
    saveCheckAt: saveCheckAt.request,
    saveFrequency: saveFrequency.request
  }
)(Repos)
