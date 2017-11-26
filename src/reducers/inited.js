export function inited (state = false, action) {
  switch (action.type) {
    case 'ERROR_USER_DATA':
    case 'RECEIVE_USER_DATA':
      return true
    default:
      return state
  }
}
