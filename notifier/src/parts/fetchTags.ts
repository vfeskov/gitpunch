import fetch from 'node-fetch'
import { RepoGroupWithTags, RepoGroup, Tag, User } from './interfaces'
import log from './log'

export default async function fetchTags (byRepo: RepoGroup[]) {
  const byRepoWithTags = await Promise.all(byRepo
    .map(async ({ repo, users }) => {
      try {
        const tags = await fetchThem(repo)
        if (!tags || !tags.length) { throw Error('No tags') }
        return { repo, users, tags }
      } catch (e) {
        log('fetchTagsError', { repo, message: e.message })
        return null
      }
    })
  )
  return byRepoWithTags.filter(Boolean)
}

const entryRegExp = /<entry>[\s\S]*?<\/entry>/gm
const titleRegExp = /<title>([^<]+)<\/title>/

async function fetchThem (repo: string) {
  const response = await fetch(`https://github.com/${ repo }/releases.atom`)
  const xml = await response.text()
  return (xml.match(entryRegExp) || [])
    .map(entry => {
      const match = entry.match(titleRegExp)
      if (!match) { return }
      return { name: match[1], entry }
    })
    .filter(Boolean)
}
