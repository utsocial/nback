import chai from 'chai'
import { spy, stub } from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)

global.expect = chai.expect
global.spy = spy
global.stub = stub

global.SHOUT = SHOUT
global.navigator = { userAgent: 'node.js' }

function SHOUT (...args) {
  console.log('*********************') // eslint-disable-line no-console
  console.log.apply(null, args) // eslint-disable-line no-console
  console.log('*********************') // eslint-disable-line no-console
}
