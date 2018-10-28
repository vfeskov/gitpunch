import Stars from '../components/Stars'
import { connect } from 'react-redux'
import { setStarsOpen, createRepo, deleteRepo, toggleWatchingStars, toggleUnwatchingNonstars } from '../actions'

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
    createRepo,
    deleteRepo,
    toggleWatchingStars,
    toggleUnwatchingNonstars
  }
)(Stars)
