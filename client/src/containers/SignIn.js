import SignIn from '../components/SignIn'
import { connect } from 'react-redux'
import { mapDispatchToProps } from '../actions'

export default connect(
  state => ({
    bufferRepos: state.bufferRepos
  }),
  mapDispatchToProps()
)(SignIn)
