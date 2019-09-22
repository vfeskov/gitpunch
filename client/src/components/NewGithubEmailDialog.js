import React, { useState, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as cookie from '../services/cookie';
import { patchProfile } from '../services/api';

export default function NewGithubEmailDialog ({ patchProfileSuccess }) {
  const githubEmail = cookie.get('githubEmail');
  const [open, setOpen] = useState(!!githubEmail);
  const [error, setError] = useState(null);
  if (githubEmail) {
    cookie.unset('githubEmail');
  }

  const close = () => {
    setOpen(false);
  };

  const updateEmail = () => {
    patchProfile({ email: githubEmail })
      .then(response => {
        patchProfileSuccess(response);
        setOpen(false);
      })
      .catch((response = {}) => {
        if (response.status === 400) {
          return setError('taken');
        }
        setError('internal');
      });
  };

  let text;
  switch (error) {
    case 'taken':
      text = 'Your new email was taken by another user, please contact us using the link in the footer and we\'ll sort this out';
      break;
    case 'internal':
      text = 'Sorry, we couldn\'t update your email at this time, please try again later';
      break;
    case null:
    default:
      text = <Fragment>Looks like your email on GitHub changed to <strong>{githubEmail}</strong>, would you like to change it here as well?'</Fragment>
      break;
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={close}
        aria-labelledby="new-github-email-dialog-title"
        aria-describedby="new-github-email-dialog-description"
      >
        <DialogTitle id="new-github-email-dialog-title">{"Do you want to update your email?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="new-github-email-dialog-description">
            {text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={close} color="primary">
            {error ? 'OK' : 'No'}
          </Button>
          {!error && <Button onClick={updateEmail} color="primary" autoFocus>
            Yes
          </Button>}
        </DialogActions>
      </Dialog>
    </div>
  );
}
