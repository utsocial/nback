beforeEach('global setup', () => {
  global.localStorage = {
    getItem: stub(),
    setItem: spy(),
    clear: spy(),
  }
  global.alert = spy()
  global.dispatch = spy()
  global.setTimeout = stub().returns(1)
  global.setInterval = stub().returns(2)
  global.clearInterval = spy()
  global.clearTimeout = spy()
})

afterEach('global teardown', () => {
  global.localStorage = {
    getItem: stub(),
    setItem: spy(),
    clear: spy(),
  }
  global.alert = spy()
  global.dispatch = spy()
  global.setTimeout = stub().returns(1)
  global.setInterval = stub().returns(2)
  global.clearInterval = spy()
  global.clearTimeout = spy()
})
