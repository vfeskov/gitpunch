import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
// import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

function ReposConfirmDeleteAll (props) {
  return <Dialog
    maxWidth="xs"
    aria-labelledby="delete-all-confirmation-dialog-title"
    {...props}
  >
    <DialogTitle id="delete-all-confirmation-dialog-title">Are you sure you want to remove all repos?</DialogTitle>
    <DialogActions>
      <Button onClick={() => props.onClose(false)}>
        No
      </Button>
      <Button onClick={() => props.onClose(true)} color="secondary">
        Yes, remove
      </Button>
    </DialogActions>
  </Dialog>
}

ReposConfirmDeleteAll.propTypes = {
  onClose: PropTypes.func
};

export default ReposConfirmDeleteAll
