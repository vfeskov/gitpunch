let testMode = false
let _testTimePassed = 0

export default function (ms: number) {
  return testMode ? testTimeout(ms) : timeout(ms)
}

export function timeout (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function testTimeout (ms: number) {
  return new Promise(resolve => {
    _testTimePassed += ms
    resolve()
  })
}

export function enableTestMode () {
  testMode = true
  _testTimePassed = 0
}

export function testTimePassed () {
  return _testTimePassed
}
