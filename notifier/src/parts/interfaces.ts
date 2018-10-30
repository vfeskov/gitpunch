import { ObjectID } from 'mongodb'

export interface User {
  _id: ObjectID
  email: string
  alerted: Alerted,
  mutedRepos: string[],
  accessToken?: string,
  majors: string[],
  minors: string[],
  patches: string[]
}

export interface Alerted {
  [repo: string]: string
}

export interface DBUser extends User {
  repos: string[]
}

export interface FullUser extends User {
  repos: RepoWithTags[]
}

export interface ActionableUser extends User {
  actionableRepos: {
    [type: string]: RepoWithTags[]
  }
}

export interface RepoGroup {
  repo: string
  users: User[]
}

export interface RepoGroupWithTags extends RepoGroup {
  tags: Tag[]
}

export interface RepoWithTags {
  repo: string
  tags: Tag[]
}

export interface Tag {
  name: string
  entry: string
}
