export function inited (state = false, action) {
  switch (action.type) {
    case 'ERROR_PROFILE':
    case 'RECEIVE_PROFILE':
      return true
    default:
      return state
  }
}
