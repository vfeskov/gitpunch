import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import App from '../../containers/App'
import DevTools from '../DevTools'

export default class Root extends Component {
  render() {
    const { store } = this.props

    return (
      <Provider store={store}>
        <div style={{ height: '100%' }}>
          <App />
          <DevTools />
        </div>
      </Provider>
    )
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired
}
