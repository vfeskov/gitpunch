import RepoAdd from '../components/RepoAdd'
import { connect } from 'react-redux'
import { mapDispatchToProps } from '../actions'

export default connect(
  state => ({
    repoAdd: state.repoAdd,
    accessToken: state.accessToken,
    bufferRepos: state.bufferRepos,
    showIntro: state.showIntro,
    suggestions: state.suggestions,
    unwatchingNonstars: state.unwatchingNonstars,
    watchingStars: state.watchingStars
  }),
  mapDispatchToProps()
)(RepoAdd)
