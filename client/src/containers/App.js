import App from '../components/App'
import { connect } from 'react-redux'
import { setShowIntro, signOut, unwatch, setStarsOpen } from '../actions'
import { withRouter } from 'react-router-dom'

export default withRouter(connect(
  state => ({
    email: state.email,
    signedIn: state.signedIn,
    accessToken: state.accessToken,
    showIntro: state.showIntro
  }),
  {
    setShowIntro,
    setStarsOpen,
    signOut: signOut.request,
    unwatch: unwatch.request
  }
)(App))
