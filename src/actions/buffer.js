export const addRepoToBuffer = repo => ({
  type: 'ADD_REPO_TO_BUFFER',
  repo
})

export const removeRepoFromBuffer = repo => ({
  type: 'REMOVE_REPO_FROM_BUFFER',
  repo
})
