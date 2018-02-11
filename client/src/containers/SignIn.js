import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import Button from 'material-ui/Button'
import Input, { InputLabel } from 'material-ui/Input'
import { FormControl } from 'material-ui/Form'
import GitHubButton from '../components/GitHubButton'

import { connect } from 'react-redux'
import { mapDispatchToProps } from '../actions'

const { assign } = Object

class SignIn extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }

  render () {
    const { bufferRepos, className, classes } = this.props
    const { email, password } = this.state
    return (
      <Paper className={className}>
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
      </Paper>
    )
  }

  signIn (e) {
    e.preventDefault()
    if (!this.valid()) { return }
    const { email, password } = this.state
    const { signIn, bufferRepos } = this.props
    signIn({ email, password, repos: bufferRepos })
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

SignIn.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  bufferRepos: PropTypes.arrayOf(PropTypes.string).isRequired,
  signIn: PropTypes.func.isRequired,
}

function styles (theme) {
  return {
    form: {
      display: 'flex',
      flexDirection: 'column'
    },
    formControl: {
      marginBottom: theme.spacing.unit * 2
    },
    or: {
      textAlign: 'center'
    },
    frequencyOptions: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    checkAtText: {
      cursor: 'pointer',
      textDecoration: 'underline'
    },
    dailyOption: {
      marginRight: 0
    }
  }
}

export default connect(
  state => ({
    bufferRepos: state.bufferRepos
  }),
  mapDispatchToProps()
)(withStyles(styles)(SignIn))
