import React, { Component } from 'react'
import Tooltip from 'material-ui/Tooltip'
import moment from 'moment-timezone'
import { withStyles } from 'material-ui/styles'
import EditIcon from 'material-ui-icons/Edit'
import HourpickerDialog from './HourpickerDialog'
import { timeText, fromUTC } from './util'

class Hourpicker extends Component {
  state = {
    dialogOpen: false
  }

  openDialog = () => {
    this.setState({ dialogOpen: true })
  }

  closeDialog = (e, value) => {
    this.setState({ dialogOpen: false })
    if (value === 'backdropClick') { return }
    const { utcHour, onSave } = this.props
    if (value !== utcHour) { onSave(value) }
  }

  render() {
    const { utcHour, classes } = this.props
    const { dialogOpen } = this.state
    return (
      <div className={classes.container}>
        <Tooltip title={`Timezone: ${moment.tz.guess()}`} placement="bottom">
          <div>&nbsp;at <span className={classes.text} onClick={this.openDialog}>{timeText(fromUTC(utcHour))}<EditIcon className={classes.editIcon}/></span></div>
        </Tooltip>
        <HourpickerDialog
          classes={classes}
          open={dialogOpen}
          onClose={this.closeDialog}
          value={utcHour}
        />
      </div>
    )
  }
}

const styles = theme => ({
  controlsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  ampm: {
    marginLeft: theme.spacing.unit * 2
  },
  value: {
    fontSize: '1.2em',
    textAlign: 'center',
    marginBottom: theme.spacing.unit * 2
  },
  canvas: {
    width: '200px',
    height: '200px',
    position: 'absolute',
    left: '-1px',
    top: '-1px'
  },
  canvasBg: {
    stroke: 'none',
    fill: '#c0e5f7'
  },
  canvasBearing: {
    stroke: 'none',
    fill: '#0095dd'
  },
  canvasFg: {
    stroke: 'none',
    fill: '#0095dd'
  },
  canvasLine: {
    stroke: '#0095dd',
    strokeWidth: 1,
    strokeLinecap: 'round'
  },
  plate: {
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '50%',
    width: '200px',
    height: '200px',
    overflow: 'visible',
    position: 'relative',
    '-webkit-touch-callout': 'none',
    '-webkit-user-select': 'none',
    '-khtml-user-select': 'none',
    '-moz-user-select': 'none',
    '-ms-user-select': 'none',
    'userSelect': 'none'
  },
  dial: {
    height: '200px',
    position: 'absolute',
    width: '200px',
    left: '-1px',
    top: '-1px',
    fontSize: '14px'
  },
  tick: {
    borderRadius: '50%',
    color: '#666',
    lineHeight: '26px',
    textAlign: 'center',
    width: '26px',
    height: '26px',
    position: 'absolute',
    cursor: 'pointer'
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  container: {
    fontSize: theme.typography.body1.fontSize
  },
  text: {
    cursor: 'pointer',
    position: 'relative',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  editIcon: {
    bottom: 0,
    display: 'none',
    left: '100%',
    position: 'absolute',
    ':hover > &': {
      display: 'block'
    }
  }
})

export default withStyles(styles)(Hourpicker)
