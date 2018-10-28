import UnwatchMessage from '../components/UnwatchMessage'
import { connect } from 'react-redux'
import { toggleWatching } from '../actions'

export default connect(
  state => ({
    unwatchMessage: state.unwatchMessage,
    watching: state.watching
  }),
  {
    toggleWatching
  }
)(UnwatchMessage)
