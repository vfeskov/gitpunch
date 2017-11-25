import { createModule as createRepoAddModule } from './RepoAdd'

export const RepoAdd = createRepoAddModule(
  'RepoAddInternal', // module's redux state will be isolated in RepoAddInternal property
  'REPO_ADD_INTERNAL_' // module's actions will be prefixed with ADD_REPO_INTERNAL_
)
