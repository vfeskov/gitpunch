import { createModule as createAddRepoModule } from './AddRepo'

export const AddRepo = createAddRepoModule(
  'AddRepo', // module's redux state will be isolated in AddRepo property
  'ADD_REPO_' // module's actions will be prefixed with ADD_REPO_
)
