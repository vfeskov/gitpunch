import React, { useState } from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import moment from 'moment-timezone'
import withStyles from '@material-ui/core/styles/withStyles'
import HourpickerDialog from './HourpickerDialog'
import { timeText, fromUTC } from './Hourpicker-util'
import styles from './Hourpicker-styles'

function Hourpicker (props) {
  const [dialogOpen, setDialogOpen] = useState(false)

  const openDialog = () => {
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
  }

  const { utcHour, classes, onSave } = props
  return (
    <div className={classes.container}>
      <Tooltip title={`Timezone: ${moment.tz.guess()}`} placement="bottom">
        <div>&nbsp;at <a className={classes.text} onClick={openDialog}>{timeText(fromUTC(utcHour))}</a></div>
      </Tooltip>
      <HourpickerDialog
        classes={classes}
        open={dialogOpen}
        onClose={closeDialog}
        onChange={onSave}
        value={utcHour}
      />
    </div>
  )
}

export default withStyles(styles)(Hourpicker)
