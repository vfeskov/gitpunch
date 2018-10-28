export default function styles (theme) {
  const maxWidth = {
    boxSizing: 'border-box',
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '600px',
    position: 'relative'
  }
  return ({
    '@global': {
      body: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        margin: 0,
        padding: 0
      },
      'html, body, #root': {
        height: '100%'
      },
      a: {
        color: theme.palette.secondary.main,
        textDecoration: 'none'
      },
      'a.soft': {
        color: theme.palette.primary[900],
        textDecoration: 'none !important'
      },
      'a:hover': {
        textDecoration: 'underline',
        color: theme.palette.secondary.main,
        cursor: 'pointer'
      },
      'button.action, a.action': {
        background: 'none',
        border: 'none',
        color: theme.palette.primary[600],
        cursor: 'pointer',
        padding: 0,
        '&:active, &:focus, &:hover': {
          color: theme.palette.secondary.main
        },
        '&[disabled]': {
          color: theme.palette.primary[500],
          cursor: 'default'
        }
      },
      svg: {
        fill: 'currentColor'
      }
    },
    app: {
      boxSizing: 'border-box',
      height: '100%',
      overflow: 'hidden',
      position: 'relative'
    },
    container: {
      [theme.breakpoints.up('sm')]: {
        flexDirection: 'row'
      },
      display: 'flex',
      flexDirection: 'column'
    },
    block: {
      [theme.breakpoints.up('sm')]: {
        marginBottom: theme.spacing.unit * 3,
        padding: theme.spacing.unit * 4
      },
      marginBottom: theme.spacing.unit * 1.5,
      padding: theme.spacing.unit * 2
    },
    maxWidth,
    maxWidthWide: { ...maxWidth, maxWidth: '1000px' },
    repos: {
      flex: 1
    },
    introContainer: {
      height: '100%',
      left: 0,
      top: 0,
      position: 'absolute',
      width: '100%',
      transition: 'opacity 500ms, top 500ms',
    },
    introOn: {
      opacity: 1,
      zIndex: 10
    },
    introOff: {
      opacity: 0,
      pointerEvents: 'none',
      top: '-500px',
      zIndex: 0
    },
    contentContainer: {
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      opacity: 0,
      overflow: 'auto',
      pointerEvents: 'none',
      paddingTop: '500px',
      transition: 'opacity 500ms, padding-top 500ms',
      width: '100%'
    },
    contentOn: {
      opacity: 1,
      pointerEvents: 'all',
      paddingTop: 0
    },
    content: {
      flex: '1 0 auto'
    }
  })
}
