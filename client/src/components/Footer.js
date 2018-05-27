import React, { PureComponent } from 'react'
import { withStyles } from 'material-ui/styles'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export class Footer extends PureComponent {
  render () {
    const { className, classes } = this.props
    return (
      <div className={`${className} ${classes.container}`}>
        Made with ♥ by <a href="https://github.com/vfeskov" target="_bank" className="soft">vfeskov</a>&nbsp;|&nbsp;
        <Link to="/privacy" className="soft">Privacy</Link>&nbsp;|&nbsp;
        <a href='m&#97;ilt&#111;&#58;v&#64;vla&#100;im&#105;rfeskov&#46;com' className="soft">Contact</a>&nbsp;|&nbsp;
        <a onClick={this.props.watchIntro} className="soft">Watch&nbsp;Intro</a>
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
    marginBottom: '0 !important',
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing.unit * 2
    }
  }
}))(Footer)
