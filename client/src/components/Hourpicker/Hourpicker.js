import React, { Component } from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import moment from 'moment-timezone'
import withStyles from '@material-ui/core/styles/withStyles'
import HourpickerDialog from './HourpickerDialog'
import { timeText, fromUTC } from './Hourpicker-util'
import styles from './Hourpicker-styles'

class Hourpicker extends Component {
  state = {
    dialogOpen: false
  }

  openDialog = () => {
    this.setState({ dialogOpen: true })
  }

  closeDialog = () => {
    this.setState({ dialogOpen: false })
  }

  render() {
    const { utcHour, classes, onSave } = this.props
    const { dialogOpen } = this.state
    return (
      <div className={classes.container}>
        <Tooltip title={`Timezone: ${moment.tz.guess()}`} placement="bottom">
          <div>&nbsp;at <a className={classes.text} onClick={this.openDialog}>{timeText(fromUTC(utcHour))}</a></div>
        </Tooltip>
        <HourpickerDialog
          classes={classes}
          open={dialogOpen}
          onClose={this.closeDialog}
          onChange={onSave}
          value={utcHour}
        />
      </div>
    )
  }
}

export default withStyles(styles)(Hourpicker)
