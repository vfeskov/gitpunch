import { createModule as createAddRepoModule } from './AddRepo'

export const AddRepo = createAddRepoModule(
  'AddRepoInternal', // module's redux state will be isolated in AddRepoInternal property
  'ADD_REPO_INTERNAL_' // module's actions will be prefixed with ADD_REPO_INTERNAL_
)
