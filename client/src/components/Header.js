import React, { useState, useEffect } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { SignOutIcon } from './icons'
import { Link } from 'react-router-dom'
import logo from '../big-logo.png'
import Input from '@material-ui/core/Input'
import Done from '@material-ui/icons/Done'
import Close from '@material-ui/icons/Close'
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { patchProfile } from '../services/api';

function Header ({ className, classes, email, signOut, patchProfileSuccess }) {
  const [editingEmail, setEditingEmail] = useState(false)
  const [newEmail, setNewEmail] = useState(email)
  const [emailError, setEmailError] = useState(null)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const onSignOut = e => {
    e.preventDefault()
    signOut()
  }

  const editEmail = e => {
    setNewEmail(email)
    setEmailError(null)
    setEditingEmail(true)
    setFormSubmitted(false)
  }

  const cancelEditingEmail = e => setEditingEmail(false)

  const onNewEmailChange = e => {
    const { value } = e.target
    setNewEmail(value)
    if (!value) {
      setEmailError('Required')
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError('Invalid')
    } else {
      setEmailError(null)
    }
  }

  const submitNewEmail = e => {
    e.preventDefault()
    setFormSubmitted(true)
    if (email === newEmail) {
      return setEditingEmail(false)
    }
    if (emailError) {
      return;
    }
    patchProfile({ email: newEmail })
      .then(response => {
        setNewEmail(email)
        setEditingEmail(false)
        patchProfileSuccess(response)
      })
      .catch((error = {}) => {
        if (error.status === 400) {
          return setEmailError('Taken')
        }
        setEmailError('Internal error :(')
      })
  }

  return (
    <div className={`${className} ${classes.container}`}>
      <Link to="/" className={classes.logo}><img src={logo} alt="GitPunch" width="150px"/></Link>
      <span className={classes.spacer}></span>
      {
        email && (
          editingEmail ? (
            <form noValidate onSubmit={submitNewEmail} style={{ alignItems: 'center', display: 'flex', height: '32px' }}>
              <FormControl error={emailError && formSubmitted}>
                <div style={{ height: 0, visibility: 'hidden' }}>{email}</div>
                <Input value={newEmail} autoFocus={true} onChange={onNewEmailChange} />
                {emailError && formSubmitted && <FormHelperText style={{ position: 'absolute', top: '100%', left: 0 }}>{emailError}</FormHelperText>}
              </FormControl>
              <button type="submit" className="soft" ><Done /></button>
              <button className="soft" onClick={cancelEditingEmail}><Close /></button>
            </form>
          ) : (
            <span style={{ alignItems: 'center', display: 'flex', height: '32px' }}>
              <span style={{ display: 'inline-block', paddingRight: '34px', cursor: 'pointer', letterSpacing: 'normal' }} testid="current-user-email" onClick={editEmail}>{email}</span>
              <button style={{ display: 'inline-flex' }} className="soft" onClick={onSignOut}>{SignOutIcon()}</button>
            </span>
          )
        )
      }
    </div>
  )
}

export default withStyles(theme => ({
  container: {
    alignItems: 'center',
    background: 'linear-gradient(to bottom, rgba(53,114,156,0.2) 1%,rgba(207,207,207,0) 100%)',
    display: 'flex',
    marginBottom: theme.spacing(6),
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      marginBottom: theme.spacing(4)
    }
  },
  spacer: {
    flex: 1,
    [theme.breakpoints.down('xs')]: {
      height: theme.spacing(2)
    }
  },
  logo: {
    ...theme.typography.h5,
    border: 'none',
    display: 'inline-block',
    marginRight: '1rem'
  }
}))(Header)
