import React, { Component } from 'react'
import Button from 'material-ui/Button'
import Input, { InputLabel } from 'material-ui/Input'
import { FormControl } from 'material-ui/Form'
import PropTypes from 'prop-types'

const { assign } = Object

export class LoggedOut extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }

  render () {
    const { classes } = this.props
    const { email, password } = this.state

    return <div className={classes.container}>
      <FormControl required className={classes.formControl}>
        <InputLabel htmlFor="email">Email</InputLabel>
        <Input id="email" value={email} onChange={ev => this.handleEmailChange(ev)} />
      </FormControl>
      <FormControl required className={classes.formControl}>
        <InputLabel htmlFor="password">Password</InputLabel>
        <Input id="password" type="password" value={password} onChange={ev => this.handlePasswordChange(ev)} />
      </FormControl>
      <div className={classes.buttons}>
        <Button raised onClick={() => this.login()}>
          Login
        </Button>
        <span className={classes.buttonDivider}>or</span>
        <Button raised onClick={() => this.register()}>
          Register
        </Button>
      </div>
    </div>
  }

  login () {
    if (!this.valid()) { return }
    this.props.login(this.state.email, this.state.password)
  }

  register () {
    if (!this.valid()) { return }
    const { email, password } = this.state
    const { register, shownRepos } = this.props
    register(email, password, shownRepos)
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

LoggedOut.propTypes = {
  classes: PropTypes.object.isRequired,
  shownRepos: PropTypes.arrayOf(PropTypes.string).isRequired,
  register: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired
}
