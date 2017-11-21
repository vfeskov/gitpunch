export function Settings (state = {}, action) {
  switch (action.type) {
    case 'RECEIVE_USER_DATA':
      const { settings } = action.userData || {}
      return settings ? {...settings} : {}
    case 'RECEIVE_SETTINGS':
      return action.settings ? {...action.settings} : {}
    default:
      return state
  }
}
