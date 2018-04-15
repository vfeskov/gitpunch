import { fetchAtom, BadStatus, NotFound, NoTags } from './githubAtom'
import { expect } from 'chai'
import * as nock from 'nock'
import fetch from 'node-fetch'
import { join } from 'path'
import 'mocha'

describe('githubAtom', () => {
  describe('fetchAtom', () => {
    const host = 'https://github.com'
    const path = '/vfeskov/for-fixtures/releases.atom'
    const url = host + path
    const fixture = 'fetchAtom.json'

    let goodResponse

    before(async () => {
      nock.back.setMode('record')
      nock.back.fixtures = join(__dirname, '..', 'fixtures')
      const { nockDone } = await nock.back(fixture)
      const response = await fetch(url).then(r => r.text())
      nockDone()
      goodResponse = response
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
        const r = await fetchAtom(url, false)
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
        expect(error).to.be.instanceof(NotFound)
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
})
