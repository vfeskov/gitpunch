import React, { PureComponent } from 'react'
import { withStyles } from 'material-ui/styles'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export class Footer extends PureComponent {
  render () {
    const { className, classes } = this.props
    return (
      <div className={`${className} ${classes.container}`}>
        <ul className={classes.menu}>
          <li><Link to="/privacy" className="soft">Privacy</Link></li>
          <li><a href='m&#97;ilt&#111;&#58;v&#64;vla&#100;im&#105;rfeskov&#46;com' className="soft">Contact</a></li>
          <li><a onClick={this.props.watchIntro} className="soft">Watch&nbsp;Intro</a></li>
          <li><a className="soft" href="https://github.com/vfeskov/gitpunch" target="_blank" rel="noopener noreferrer">GitHub</a></li>
        </ul>
        <div>Made with ♥ by <a href="https://github.com/vfeskov" target="_blank" rel="noopener noreferrer" className="soft">vfeskov</a></div>
      </div>
    )
  }
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
  watchIntro: PropTypes.func.isRequired
}

export default withStyles(theme => ({
  container: {
    flexShrink: 0,
    fontSize: '0.9rem',
    lineHeight: '1.5',
    marginBottom: '0 !important',
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing.unit * 2
    }
  },
  menu: {
    listStyle: 'none',
    padding: '0',
    margin: '0',
    '@global': {
      li: {
        display: 'inline',
      },
      '> li:not(:last-child)::after': {
        content: '" | "',
        display: 'inline'
      }
    }
  }
}))(Footer)
