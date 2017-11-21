import { connect } from 'react-redux'
import { Repos as ReposComponent } from './component'
import { removeRepo } from './actions'

export const Repos = connect(
  state => ({ repos: state.Repos }),
  dispatch => ({
    onRemove: repo => dispatch(removeRepo(repo))
  })
)(ReposComponent)
