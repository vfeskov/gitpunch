import Stars from '../components/Stars'
import { connect } from 'react-redux'
import { setStarsOpen, addRepo, removeRepo, toggleWatchingStars, toggleUnwatchingNonstars } from '../actions'

export default connect(
  state => ({
    accessToken: state.accessToken,
    repos: state.shownRepos,
    starsOpen: state.starsOpen,
    starsWorking: state.starsWorking,
    watchingStars: state.watchingStars,
    unwatchingNonstars: state.unwatchingNonstars
  }),
  {
    setStarsOpen,
    addRepo,
    removeRepo,
    toggleWatchingStars,
    toggleUnwatchingNonstars
  }
)(Stars)
