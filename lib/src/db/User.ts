import { ObjectID } from 'mongodb'
import * as mongoose from 'mongoose'
import './connection'
const { assign, keys } = Object

const reposValidator = (repos: string[]) => {
  return repos.every(repo => /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo))
}
const userSchemaObj: mongoose.SchemaDefinition = {
  email: { type: String, required: true, index: true, match: /\S+@\S+\.\S+/ },
  accessToken: { type: String, default: '' },
  passwordEncrypted: { type: String, default: '' },
  watching: { type: Boolean, default: true },
  watchingStars: { type: Number, min: 0, max: 3, default: 0, validate: { validator: Number.isInteger } },
  repos: { type: [String], default: [], validate: { validator: reposValidator } },
  mutedRepos: { type: [String], default: [], validate: { validator: reposValidator } },
  majors: { type: [String], default: [], validate: { validator: reposValidator } },
  minors: { type: [String], default: [], validate: { validator: reposValidator } },
  patches: { type: [String], default: [], validate: { validator: reposValidator } },
  alerted: { type: [], default: [] },
  frequency: { type: String, enum: ['realtime', 'daily'], default: 'realtime' },
  checkAt: { type: Number, min: 0, max: 23, default: 0, validate: { validator: Number.isInteger } }
}
const UserSchema = new mongoose.Schema(userSchemaObj)
export const UserModel = mongoose.model('User', UserSchema)

export class CuteRepo {
  repo: string
  muted: boolean
  filter: number
}

export class CuteUser {
  accessToken?: string
  passwordEncrypted?: string
  watching?: boolean
  watchingStars?: number
  alerted?: string[][]
  frequency?: string
  checkAt?: number
  email?: string
  id?: string
  repos?: CuteRepo[]
}

export class UpdateAllReposParams {
  muted?: boolean
  filter?: number
}

export class RawUser {
  accessToken?: string
  passwordEncrypted?: string
  watching?: boolean
  watchingStars?: number
  alerted?: string[][]
  frequency?: string
  checkAt?: number
  email?: string
  _id?: ObjectID
  repos?: string[]
  majors?: string[]
  minors?: string[]
  patches?: string[]
  mutedRepos? : string[]
  [key: string]: any
}

export class User extends CuteUser {
  constructor (params: CuteUser) {
    super()
    assign(this, params)
  }

  async save (doc: CuteUser = null) {
    if (this.id) {
      await User.update({ id: this.id }, doc || this)
      return assign(this, doc)
    }
    const raw = await UserModel.create(toRaw(this))
    return assign(this, toCute(raw))
  }

  errors () {
    try {
      const model = new UserModel(toRaw(this))
      return model.validateSync()
    } catch (e) {
      return true
    }
  }

  async addRepos (repos: CuteRepo[]) {
    await User.addRepos({ id: this.id }, repos)
    const names = this.repos.map(r => r.repo)
    this.repos = [...repos.filter(r => !names.includes(r.repo)).reverse(), ...this.repos]
    return this
  }

  async removeRepos (repos: CuteRepo[]) {
    await User.removeRepos({ id: this.id }, repos)
    const repoNames = repos.map(r => r.repo)
    this.repos = this.repos.filter(r => !repoNames.includes(r.repo))
    return this
  }

  async updateRepo (repo: CuteRepo) {
    await User.updateRepo({ id: this.id }, repo)
    this.repos.some(r => {
      if (r.repo === repo.repo) {
        assign(r, repo)
        return true
      }
    })
    return this
  }

  async updateAllRepos (params: UpdateAllReposParams) {
    await User.updateAllRepos({ id: this.id }, this.repos, params)
    this.repos = this.repos.map(r => {
      if (typeof params.muted !== 'undefined') {
        r.muted = params.muted
      }
      if (typeof params.filter !== 'undefined') {
        r.filter = params.filter
      }
      return r
    })
    return this
  }

  static async load (search: CuteUser) {
    const raw = await UserModel.findOne(toRaw(search))
    return raw ? new User(toCute(raw)) : null
  }

  static async create (doc: CuteUser) {
    const raw = await UserModel.create(toRaw(doc))
    return new User(toCute(raw))
  }

  static update (search: CuteUser, doc: CuteUser) {
    return UserModel.updateOne(toRaw(search), toRaw(doc))
  }

  static addRepos (search: CuteUser, repos: CuteRepo[]) {
    const raw = toRaw({ repos })
    const $addToSet = ['repos', 'mutedRepos', 'majors', 'minors', 'patches'].reduce(
      (r, k) => raw[k].length ? assign(r, {[k]: { $each: raw[k].reverse() }}) : r,
      {}
    )
    return UserModel.updateOne(toRaw(search), { $addToSet })
  }

  static removeRepos (search: CuteUser, repos: CuteRepo[]) {
    const repoNames = toRaw({ repos }).repos
    return UserModel.updateOne(
      toRaw(search),
      {
        $pull: {
          repos: { $in: repoNames },
          mutedRepos: { $in: repoNames },
          majors: { $in: repoNames },
          minors: { $in: repoNames },
          patches: { $in: repoNames }
        }
      }
    )
  }

  static updateRepo (search: CuteUser, { repo, filter, muted }: CuteRepo) {
    const command: any = {
      $addToSet: {},
      $pull: {}
    }
    if (typeof muted !== 'undefined') {
      command[muted ? '$addToSet' : '$pull'].mutedRepos = repo
    }
    if (typeof filter !== 'undefined') {
      ['majors', 'minors', 'patches'].forEach((listName, index) =>
        command[filter === index ? '$addToSet' : '$pull'][listName] = repo
      )
    }
    keys(command).forEach(k => {
      if (!keys(command[k]).length) {
        delete command[k]
      }
    })
    return UserModel.updateOne(toRaw(search), command)
  }

  static updateAllRepos (search: CuteUser, repos: CuteRepo[], params: UpdateAllReposParams) {
    const { muted, filter } = params
    const command: RawUser = {}
    const repoNames = repos.map(r => r.repo)
    if (typeof muted !== 'undefined') {
      command.mutedRepos = muted ? repoNames : []
    }
    if (typeof filter !== 'undefined') {
      ['majors', 'minors', 'patches'].forEach((listName, index) => {
        command[listName] = (filter === index) ? repoNames : []
      })
    }
    return UserModel.updateOne(toRaw(search), command)
  }

  static async find (rawSearch: any) {
    const rawUsers = await UserModel.find(rawSearch)
    return rawUsers.map(raw => new User(toCute(raw)))
  }
}

function toRaw ({ id, repos, ...rest }: CuteUser): RawUser {
  const result: RawUser = rest
  if (id) {
    result._id = new ObjectID(id)
  }
  if (repos) {
    assign(result, {
      repos: repos.map(r => r.repo),
      mutedRepos: repos.filter(r => r.muted).map(r => r.repo),
      majors: repos.filter(r => r.filter === 0).map(r => r.repo),
      minors: repos.filter(r => r.filter === 1).map(r => r.repo),
      patches: repos.filter(r => r.filter === 2).map(r => r.repo),
    })
  }
  return Object.keys(result)
    .filter(k => k === '_id' || !!userSchemaObj[k])
    .reduce((r, k) => ({ ...r, [k]: result[k] }), {})
}

function toCute (raw: RawUser): CuteUser {
  // keys(raw) doesn't return document keys but some internal mongoose keys
  const { repos, mutedRepos, majors, minors, patches, _id, ...rest } =
    keys(userSchemaObj).reduce(
      (r, k) => typeof raw[k] !== 'undefined' ? assign(r, {[k]: raw[k]}) : r,
      {} as RawUser
    )
  return {
    id: raw._id.toString(),
    repos: repos.map(repo => ({
      repo,
      muted: mutedRepos.includes(repo),
      filter: (() => {
        const lists: [string[], number][] = [[majors, 0], [minors, 1], [patches, 2]];
        return (lists.find(([l]) => l.includes(repo)) || [null, 3])[1]
      })()
    })).reverse(),
    ...rest
  }
}
