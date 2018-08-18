import React, { Component } from 'react'
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
        <div data-tip={`Timezone: ${moment.tz.guess()}`}>&nbsp;at <a className={classes.text} onClick={this.openDialog}>{timeText(fromUTC(utcHour))}</a></div>
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
