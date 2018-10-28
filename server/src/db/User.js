import { ObjectID } from 'mongodb'
import * as mongoose from 'mongoose'
import './connection'
const { assign, keys } = Object

const reposValidator = repos => {
  return repos.every(repo => /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo))
}
const userSchemaObj = {
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

export class User {
  constructor (params) {
    assign(this, params)
  }

  async save (doc = null) {
    if (this.id) {
      await User.update(toRaw({ id: this.id }), doc || this)
      return assign(this, doc)
    }
    const raw = await UserModel.create(toRaw(this))
    return assign(this, fromRaw(raw))
  }

  errors () {
    try {
      const model = new UserModel(toRaw(this))
      return model.validateSync()
    } catch (e) {
      return true
    }
  }

  async addRepos (repos) {
    await User.addRepos({ id: this.id }, repos)
    const names = this.repos.map(r => r.repo)
    this.repos = [...repos.filter(r => !names.includes(r.repo)).reverse(), ...this.repos]
    return this
  }

  async removeRepos (repos) {
    await User.removeRepos({ id: this.id }, repos)
    repos = repos.map(r => r.repo)
    this.repos = this.repos.filter(r => !repos.includes(r.repo))
    return this
  }

  async updateRepo (repo) {
    await User.updateRepo({ id: this.id }, repo)
    this.repos.some(r => r.repo === repo.repo && assign(r, repo))
    return this
  }

  async updateAllRepos (params) {
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

  static async load (search) {
    const raw = await UserModel.findOne(toRaw(search))
    return raw ? new User(fromRaw(raw)) : null
  }

  static async create (doc) {
    const raw = await UserModel.create(toRaw(doc))
    return new User(fromRaw(raw))
  }

  static update (search, doc) {
    return UserModel.updateOne(toRaw(search), toRaw(doc))
  }

  static addRepos (search, repos) {
    const raw = toRaw({ repos })
    const $addToSet = ['repos', 'mutedRepos', 'majors', 'minors', 'patches'].reduce(
      (r, k) => raw[k].length ? assign(r, {[k]: { $each: raw[k].reverse() }}) : r,
      {}
    )
    return UserModel.updateOne(toRaw(search), { $addToSet })
  }

  static removeRepos (search, repos) {
    repos = toRaw({ repos }).repos
    return UserModel.updateOne(
      toRaw(search),
      {
        $pull: {
          repos: { $in: repos },
          mutedRepos: { $in: repos },
          majors: { $in: repos },
          minors: { $in: repos },
          patches: { $in: repos }
        }
      }
    )
  }

  static updateRepo (search, { repo, filter, muted }) {
    const command = {
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
    console.log(command)
    return UserModel.updateOne(toRaw(search), command)
  }

  static updateAllRepos (search, repos, { muted, filter }) {
    const command = {}
    repos = repos.map(r => r.repo)
    if (typeof muted !== 'undefined') {
      command.mutedRepos = muted ? repos : []
    }
    if (typeof filter !== 'undefined') {
      ['majors', 'minors', 'patches'].forEach((listName, index) => {
        command[listName] = (filter === index) ? repos : []
      })
    }
    return UserModel.updateOne(toRaw(search), command)
  }

  static find (rawSearch) {
    return UserModel.find(rawSearch).map(raw => new User(fromRaw(raw)))
  }
}

function toRaw ({ id, repos, ...result }) {
  if (id) {
    result._id = ObjectID(id)
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
  return result
}

function fromRaw (raw) {
  // keys(raw) doesn't return document keys but some internal mongoose keys
  const { repos, mutedRepos, majors, minors, patches, ...rest } =
    keys(userSchemaObj).reduce(
      (r, k) => typeof raw[k] !== 'undefined' ? assign(r, {[k]: raw[k]}) : r,
      {}
    )
  return {
    id: raw._id.toString(),
    repos: repos.map(repo => ({
      repo,
      muted: mutedRepos.includes(repo),
      filter: (() =>
        (
          [[majors, 0], [minors, 1], [patches, 2]]
            .find(([l]) => l.includes(repo)) ||
          [null, 3]
        )[1]
      )()
    })).reverse(),
    ...rest
  }
}
