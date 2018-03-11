import fetchAtom, { NoTags, BadStatus } from './fetchAtom'
import { expect } from 'chai'
import * as nock from 'nock'
import fetch from 'node-fetch'
import 'mocha'

// TODO: move this to helper
nock.back.setMode('record')
nock.back.fixtures = './fixtures'

describe('fetchAtom', function () {
  const host = 'https://github.com'
  const path = '/vfeskov/for-fixtures/releases.atom'
  const url = host + path
  const fixture = 'fetchAtom.json'

  let goodResponse

  before(async () => {
    const { nockDone } = await (nock.back as any)(fixture)
    await fetch(url)
    nockDone()
    goodResponse = require(`../../fixtures/${fixture}`)[0].response
  })

  afterEach(() => nock.cleanAll())

  it('retries 5xx errors 2 times', async () => {
    nock(host)
      .get(path).times(2).reply(500)
      .get(path).reply(200, goodResponse)
    const [v2, v1] = await fetchAtom(url, false)
    expect(v2.name).to.equal('v2.0.0')
    expect(v1.name).to.equal('v1.0.0')

    nock(host)
      .get(path).times(3).reply(500)
      .get(path).reply(200, goodResponse);
    try {
      await fetchAtom(url, false)
      throw new Error('should\'ve thrown')
    } catch (error) {
      expect(error).to.be.instanceof(BadStatus)
    }
  })

  it('rejects without retrying if error is 4xx', async () => {
    nock(host)
      .get(path).reply(404)
      .get(path).reply(200, goodResponse)
    try {
      await fetchAtom(url, false)
      throw new Error('should\'ve thrown')
    } catch (error) {
      expect(error).to.be.instanceof(NoTags)
    }
  })

  it('rejects with NoTags if response doesn\'t contain <entry>', async () => {
    nock(host).get(path).reply(200, '')
    try {
      await fetchAtom(url, false)
      throw new Error('should\'ve thrown')
    } catch (error) {
      expect(error).to.be.instanceof(NoTags)
    }
  })
})
