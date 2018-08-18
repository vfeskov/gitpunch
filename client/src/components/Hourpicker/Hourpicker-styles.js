export default function styles (theme) {
  return {
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
      fill: theme.palette.secondary[100]
    },
    canvasBearing: {
      stroke: 'none',
      fill: theme.palette.secondary.main
    },
    canvasFg: {
      stroke: 'none',
      fill: theme.palette.secondary.main
    },
    canvasLine: {
      stroke: theme.palette.secondary.main,
      strokeWidth: 1,
      strokeLinecap: 'round'
    },
    plate: {
      backgroundColor: '#fff',
      border: '1px solid #000',
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
      color: '#000',
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
      position: 'relative'
    },
    active: {
      color: '#fff'
    },
    dialogTitle: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'space-between'
    }
  }
}
