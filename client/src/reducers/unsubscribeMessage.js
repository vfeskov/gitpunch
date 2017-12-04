export function unsubscribeMessage (state = null, action) {
  switch (action.type) {
    case 'ERROR_UNSUBSCRIBE':
      return { error: true }
    case 'RECEIVE_UNSUBSCRIBE':
      return {
        sameUser: action.payloadEmail === action.currentEmail,
        success: true
      }
    default:
      return state
  }
}
