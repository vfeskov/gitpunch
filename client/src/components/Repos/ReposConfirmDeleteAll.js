import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import Dialog from '@material-ui/core/Dialog'
import withTheme from '@material-ui/core/styles/withTheme'

function ReposConfirmDeleteAll ({ open, onClose, theme }) {
  return <Dialog
    maxWidth="xs"
    aria-labelledby="delete-all-confirmation-dialog-title"
    open={open}
    onClose={() => onClose(false)}
  >
    <DialogTitle id="delete-all-confirmation-dialog-title">Are you sure you want to remove all repos?</DialogTitle>
    <DialogActions>
      <Button onClick={() => onClose(false)}>
        No
      </Button>
      <Button onClick={() => onClose(true)} style={{ color: theme.palette.error.main }}>
        Yes, remove
      </Button>
    </DialogActions>
  </Dialog>
}

ReposConfirmDeleteAll.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired
}

export default withTheme()(ReposConfirmDeleteAll)
