import SignIn from '../components/SignIn'
import { connect } from 'react-redux'
import { signIn } from '../actions'

export default connect(
  state => ({
    bufferRepos: state.bufferRepos
  }),
  {
    signIn: signIn.request
  }
)(SignIn)
