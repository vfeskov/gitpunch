import App from '../components/App'
import { connect } from 'react-redux'
import { mapDispatchToProps } from '../actions'

export default connect(
  state => ({
    email: state.email,
    signedIn: state.signedIn,
    accessToken: state.accessToken,
    showIntro: state.showIntro
  }),
  mapDispatchToProps()
)(App)
