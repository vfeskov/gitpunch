import React, { PureComponent } from 'react'
import { withStyles } from 'material-ui/styles'
import PropTypes from 'prop-types'

export class Footer extends PureComponent {
  render () {
    const { className, classes, email } = this.props
    return (
      <div className={`${className} ${classes.container}`}>Made with ♥ by <a href="https://github.com/vfeskov" target="_bank">vfeskov</a> | <a href='m&#97;ilt&#111;&#58;v&#64;vla&#100;im&#105;rfeskov&#46;com'>Contact</a> | <a onClick={this.props.watchIntro}>Watch Intro</a></div>
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
