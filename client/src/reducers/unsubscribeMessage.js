export function unsubscribeMessage (state = null, action) {
  switch (action.type) {
    case 'ERROR_UNSUBSCRIBE':
      return { error: true }
    case 'RECEIVE_UNSUBSCRIBE':
      return { success: true, sameUser: action.sameUser }
    default:
      return state
  }
}
