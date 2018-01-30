import React, { Component } from 'react'
import Tooltip from 'material-ui/Tooltip'
import moment from 'moment-timezone'
import { withStyles } from 'material-ui/styles'
import EditIcon from 'material-ui-icons/Edit'
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog'
import Radio, { RadioGroup } from 'material-ui/Radio'
import { FormControl, FormControlLabel } from 'material-ui/Form'
import Button from 'material-ui/Button'
const { assign } = Object
const { cos, sin, PI } = Math

const ampmMode = new Date().toLocaleTimeString().toLowerCase().match(/(am|pm)/)

function fromUTC (utcHour) {
  return moment.utc(utcHour, 'H').local()
}

function toUTC (hour) {
  return +moment(hour, 'H').utc().format('H')
}

function fromLocal (hour) {
  return moment(hour, 'H')
}

function timeText (time) {
  return ampmMode ? time.format('LT') : time.format('HH:mm')
}

const ticks1to12 = [
  { l: '114',     t: '40.2346', v: '1' },
  { l: '133.765', t: '60',      v: '2' },
  { l: '141',     t: '87',      v: '3' },
  { l: '133.765', t: '114',     v: '4' },
  { l: '114',     t: '133.765', v: '5' },
  { l: '87',      t: '141',     v: '6' },
  { l: '60',      t: '133.765', v: '7' },
  { l: '40.2346', t: '114',     v: '8' },
  { l: '33',      t: '87',      v: '9' },
  { l: '40.2346', t: '60',      v: '10' },
  { l: '60',      t: '40.2346', v: '11' },
  { l: '87',      t: '33',      v: '12' }
].map(tick => assign(tick, { f: '120%' }))

const ticks13to23and00 = [
  { l: '127',     t: '17.718',  v: '13' },
  { l: '156.282', t: '47',      v: '14' },
  { l: '167',     t: '87',      v: '15' },
  { l: '156.282', t: '127',     v: '16' },
  { l: '127',     t: '156.282', v: '17' },
  { l: '87',      t: '167',     v: '18' },
  { l: '47',      t: '156.282', v: '19' },
  { l: '17.718',  t: '127',     v: '20' },
  { l: '7',       t: '87',      v: '21' },
  { l: '17.718',  t: '47',      v: '22' },
  { l: '47',      t: '17.718',  v: '23' },
  { l: '87',      t: '7',       v: '00' }
]

const innerRadius = 54
const outerRadius = 80

class HourpickerDialog extends Component {
  state = {
    value: undefined,
    ampm: undefined
  }

  setValue (value) {
    return this.setState({
      value,
      ampm: value > 11 ? 'pm' : 'am'
    })
  }

  componentWillMount () {
    this.setValue(fromUTC(this.props.value).format('H'))
  }

  componentWillUpdate (nextProps) {
    if (nextProps.value !== this.props.value) {
      // eslint-disable-next-line react/no-will-update-set-state
      this.setValue(fromUTC(nextProps.value).format('H'))
    }
  }

  handleCancel = e => {
    this.props.onClose(e, this.props.value)
  }

  handleOk = e => {
    this.props.onClose(e, toUTC(this.state.value))
  }

  handleValueChange = (value, ampm = this.state.ampm) => {
    value = +value
    if (ampmMode) {
      value = value % 12
      if (ampm === 'pm') { value += 12 }
    }
    this.setValue(value)
  }

  handleAMPMChange = ampm => {
    this.handleValueChange(this.state.value, ampm)
  }

  render () {
    const { classes, ...other } = this.props
    const { value } = this.state
    const angle = (450 - value % 12 * 30) % 360 * (PI / 180)
    let ticks, radius
    if (ampmMode) {
      ticks = ticks13to23and00.map((tick, i) => {
        const { v, f } = ticks1to12[i]
        return assign({}, tick, { v, f })
      })
      radius = outerRadius
    } else {
      ticks = [...ticks1to12, ...ticks13to23and00]
      radius = value === 0 || value > 12 ? outerRadius : innerRadius
    }
    const p = {
      x: radius * cos(angle),
      y: -radius * sin(angle)
    }

    const ticksWithStyle = ticks.map(({ l, t, f, v }) => {
      const style = { left: `${l}px`, top: `${t}px` }
      if (f) { style.fontSize = f }
      return { v, style }
    })

    return (
      <Dialog
        maxWidth="xs"
        aria-labelledby="hourpicker-dialog-title"
        {...other}
      >
        <DialogTitle id="hourpicker-dialog-title">Check repos daily at:</DialogTitle>
        <DialogContent>
          <div className={classes.value}>
            {timeText(fromLocal(value))}<br/><small>Timezone: {moment.tz.guess()}</small>
          </div>
          <div className={classes.controlsContainer}>
            <div className={classes.plate}>
              <div className={classes.canvas}>
                <svg width="200" height="200">
                  <g transform="translate(100,100)">
                    <line className={classes.canvasLine} x1="0" y1="0" x2={p.x} y2={p.y}></line>
                    <circle className={classes.canvasFg} r="3.5" cx={p.x} cy={p.y}></circle>
                    <circle className={classes.canvasBg} r="13" cx={p.x} cy={p.y}></circle>
                    <circle className={classes.canvasBearing} cx="0" cy="0" r="2"></circle>
                  </g>
                </svg>
              </div>
              <div className={classes.dial}>
                {ticksWithStyle.map(({ style, v }) => (
                  <div key={v} className={classes.tick} style={style} onClick={() => this.handleValueChange(v)}>{v}</div>
                ))}
              </div>
            </div>
            {ampmMode && (
            <FormControl component="fieldset" className={classes.ampm}>
              <RadioGroup
                aria-label="AM or PM"
                name="ampm"
                value={this.state.ampm}
                onChange={(e, ampm) => this.handleAMPMChange(ampm)}
              >
                <FormControlLabel value="am" control={<Radio />} label="AM" />
                <FormControlLabel value="pm" control={<Radio />} label="PM" />
              </RadioGroup>
            </FormControl>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleOk} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

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
    justifyContent: 'space-between'
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
