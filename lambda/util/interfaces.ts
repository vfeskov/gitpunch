export interface UserRaw {
  email: string
  repos: string
  alerted: string
}

export interface User {
  email: string
  repos: string[]
  alerted: {
    [repo: string]: string
  }
  error?: any
}

export interface UserData {
  email: string
  alerted: Alerted
}

export interface RepoWithUsersData {
  repo: string,
  usersData: UserData[]
}

export interface RepoWithUsersDataAndLatestTag {
  repo: string
  latestTag: string
  usersData: UserData[]
  error?: any
}

export interface Alerted {
  [repo: string]: string
}

export interface Action {
  error?: any,
  action: string
  tag: string
  repo: string
  alerted: Alerted
  email: string
}
