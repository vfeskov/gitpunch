import React, { Component } from 'react'
import moment from 'moment-timezone'
import Dialog, { DialogActions, DialogContent, DialogTitle, withMobileDialog } from 'material-ui/Dialog'
import Radio, { RadioGroup } from 'material-ui/Radio'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui-icons/Close'
import { FormControl, FormControlLabel } from 'material-ui/Form'
import Button from 'material-ui/Button'
import { ampmMode, timeText, fromUTC, toUTC, fromLocal } from './util'
const { assign } = Object
const { cos, sin, PI } = Math

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
  state = {}

  setValue (value) {
    return this.setState({
      value,
      ampm: value > 11 ? 'pm' : 'am'
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.value !== this.props.value || !this.state.value) {
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
        <DialogTitle id="hourpicker-dialog-title">
          <div className={classes.dialogTitle}>
            Watch daily at
            <IconButton color="inherit" onClick={this.handleCancel} aria-label="Close">
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
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
          <Button onClick={this.handleOk} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default withMobileDialog({ breakpoint: 'xs' })(HourpickerDialog)
