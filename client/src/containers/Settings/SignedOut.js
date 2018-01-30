import React, { Component } from 'react'
import Button from 'material-ui/Button'
import Input, { InputLabel } from 'material-ui/Input'
import { FormControl } from 'material-ui/Form'
import PropTypes from 'prop-types'
import GitHubButton from '../../components/GitHubButton'

const { assign } = Object

export default class SignedOut extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }

  render () {
    const { classes, bufferRepos } = this.props
    const { email, password } = this.state
    return <div>
      <GitHubButton bufferRepos={bufferRepos} text="Sign In with GitHub"/>
      <div className={classes.or}>or</div>
      <form onSubmit={e => this.signIn(e)} className={classes.form}>
        <FormControl required className={classes.formControl}>
          <InputLabel htmlFor="email">Email</InputLabel>
          <Input id="email" value={email} type="email" required onChange={ev => this.handleEmailChange(ev)} />
        </FormControl>
        <FormControl required className={classes.formControl}>
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input id="password" type="password" required value={password} onChange={ev => this.handlePasswordChange(ev)} />
        </FormControl>
        <Button type="submit" raised>
          Sign In
        </Button>
      </form>
    </div>
  }

  signIn (e) {
    e.preventDefault()
    if (!this.valid()) { return }
    const { email, password } = this.state
    const { signIn, bufferRepos } = this.props
    signIn(email, password, bufferRepos)
  }

  valid () {
    const { email, password } = this.state
    return password && email && /^[^@]+@[^@]+$/.test(email)
  }

  handleEmailChange (ev) {
    const email = ev.target.value
    this.setState(state => assign({}, state, { email }))
  }

  handlePasswordChange (ev) {
    const password = ev.target.value
    this.setState(state => assign({}, state, { password }))
  }
}

SignedOut.propTypes = {
  classes: PropTypes.object.isRequired,
  bufferRepos: PropTypes.arrayOf(PropTypes.string).isRequired,
  signIn: PropTypes.func.isRequired,
}
