import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchUserData } from './actions'
import { AddRepo }  from './AddRepo/container'
import { Repos } from './Repos/container'
import { Settings } from './Settings/component'

class AppComponent extends Component {
  render() {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <AddRepo />
        <div style={{display: 'flex'}}>
          <Repos />
          <Settings />
        </div>
      </div>
    )
  }

  componentDidMount() {
    this.props.dispatch(fetchUserData())
  }
}

export const App = connect()(AppComponent)
