import Stars from '../components/Stars'
import { connect } from 'react-redux'
import { setStarsOpen, addRepo, removeRepo, toggleWatchingStars } from '../actions'

export default connect(
  state => ({
    accessToken: state.accessToken,
    repos: state.shownRepos,
    starsOpen: state.starsOpen,
    starsWorking: state.starsWorking,
    watchingStars: state.watchingStars
  }),
  {
    setStarsOpen,
    addRepo,
    removeRepo,
    toggleWatchingStars
  }
)(Stars)
