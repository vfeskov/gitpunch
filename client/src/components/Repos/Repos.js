import React from 'react'
import DeleteIcon from '@material-ui/icons/Delete'
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive'
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff'
import withStyles from '@material-ui/core/styles/withStyles'
import PropTypes from 'prop-types'
import Header, { propTypes as HeaderPropTypes } from './ReposHeader'
import ReactTooltip from 'react-tooltip'

function Repos (props) {
  const { classes, ...headerProps } = props
  const { className, removeRepo, shownRepos, muteRepo, unwatchingNonstars } = props
  setTimeout(ReactTooltip.rebuild)
  return (
    <div className={`${className} ${classes.container}`}>
      <Header {...headerProps} />
      {shownRepos.map(({ repo, muted }) =>
        <div className={classes.item} key={repo}>
          <span className={muted ? classes.muted : ''}>{repo}</span>
          <div style={{ flex: 1 }}></div>
          <button className="action" aria-label={muted ? 'Unmute' : 'Mute'} onClick={() => muteRepo(repo, !muted)} data-tip={muted ? 'Emails are OFF' : 'Emails are ON'}>
            {muted ? <NotificationsOffIcon /> : <NotificationsActiveIcon />}
          </button>
          {unwatchingNonstars ||
          <button
            className={`${classes.deleteButton} action`}
            aria-label="Delete"
            onClick={() => removeRepo(repo)}
          >
            <DeleteIcon />
          </button>
          }
          {/* {alerted[repo] &&
            <a
              href={`https://github.com/${repo}/releases/tag/${alerted[repo]}`}
              target="_blank"
              rel="noopener noreferrer"
              className={classes.releaseLink}
            >
              {alerted[repo]}
            </a>
          } */}
        </div>
      )}
    </div>
  )
}

Repos.propTypes = {
  alerted: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  removeRepo: PropTypes.func.isRequired,
  shownRepos: PropTypes.arrayOf(PropTypes.object).isRequired,
  unwatchingNonstars: PropTypes.bool.isRequired,
  ...HeaderPropTypes
}

const styles = theme => ({
  container: {
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center'
    }
  },
  item: {
    alignItems: 'center',
    display: 'flex',
    minHeight: '48px',
    '@global': {
      'button.action': {
        marginLeft: theme.spacing.unit,
        visibility: 'hidden'
      }
    },
    '&:hover': {
      background: 'rgba(53,114,156,0.075)',
      borderRadius: '24px',
      margin: '0 -10px',
      padding: '0 10px',
      '@global': {
        'button.action': {
          visibility: 'visible'
        }
      }
    }
  },
  releaseLink: {
    fontSize: '0.8em'
  },
  deleteButton: {
    '&:hover, &:focus, &:active': {
      color: `${theme.palette.error.main} !important`
    },
    '&[disabled]': {
      color: `${theme.palette.primary[500]} !important`
    }
  },
  muted: {
    color: theme.palette.primary[500],
    textDecoration: 'line-through'
  }
})

export default withStyles(styles)(Repos)
