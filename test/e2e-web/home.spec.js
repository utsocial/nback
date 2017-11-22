const _ = require('lodash')
const el = require('../utils').el
const url = require('../utils').BASE_URL

module.exports = {
  tags: ['Home Page'],

  before (client) {
    client
      .url(url)
      .execute('localStorage.clear()')
      .url(url)
      .waitForElementVisible('body', 5000)
  },

  'Assert redirect home' (client) {
    client.assert.urlContains('/home')
  },

  'Assert defaults modes' (client) {
    client.expect.element(el('HomeContainer-modePosition')).to.be.visible
    client.expect.element(el('HomeContainer-modePosition')).to.have.attribute('class').contains('active')
    client.expect.element(el('HomeContainer-modeAudio')).to.be.visible
    client.expect.element(el('HomeContainer-modeAudio')).to.not.have.attribute('class').contains('active')
    client.expect.element(el('HomeContainer-modeColor')).to.be.visible
    client.expect.element(el('HomeContainer-modeColor')).to.have.attribute('class').contains('active')
  },

  'Assert toggling modes on click' (client) {
    client.click(el('HomeContainer-modePosition'))
    client.expect.element(el('HomeContainer-modePosition')).to.not.have.attribute('class').contains('active')
    client.click(el('HomeContainer-modePosition'))
    client.expect.element(el('HomeContainer-modePosition')).to.have.attribute('class').contains('active')
    client.click(el('HomeContainer-modeAudio'))
    client.expect.element(el('HomeContainer-modeAudio')).to.have.attribute('class').contains('active')
    client.click(el('HomeContainer-modeAudio'))
    client.expect.element(el('HomeContainer-modeAudio')).to.not.have.attribute('class').contains('active')
    client.click(el('HomeContainer-modeColor'))
    client.expect.element(el('HomeContainer-modeColor')).to.not.have.attribute('class').contains('active')
    client.click(el('HomeContainer-modeColor'))
    client.expect.element(el('HomeContainer-modeColor')).to.have.attribute('class').contains('active')
  },

  'Assert alert when trying to toggle last active mode' (client) {
    client.click(el('HomeContainer-modePosition'))
    client.click(el('HomeContainer-modeColor'))
    client.acceptAlert()
    client.expect.element(el('HomeContainer-modeColor')).to.have.attribute('class').contains('active')
  },

  'Assert default nBack' (client) {
    client.expect.element(el('HomeContainer-nBack')).text.to.equal('2')
  },

  'Assert decrement nBack' (client) {
    client.click(el('HomeContainer-nBackDecrement'))
    client.expect.element(el('HomeContainer-nBack')).text.to.equal('1')
    // can't go below 1
    client.click(el('HomeContainer-nBackDecrement'))
    client.expect.element(el('HomeContainer-nBack')).text.to.equal('1')
  },

  'Assert increment nBack' (client) {
    client.click(el('HomeContainer-nBackIncrement'))
    client.click(el('HomeContainer-nBackIncrement'))
    client.expect.element(el('HomeContainer-nBack')).text.to.equal('3')
  },

  'Assert default speed' (client) {
    client.expect.element(el('HomeContainer-speed')).text.to.equal('Normal')
  },

  'Assert decrement speed' (client) {
    client.click(el('HomeContainer-speedDecrement'))
    client.expect.element(el('HomeContainer-speed')).text.to.equal('Slow')
    // can't go below 100
    _.times(5, () => client.click(el('HomeContainer-speedDecrement')))
    client.expect.element(el('HomeContainer-speed')).text.to.equal('Turtle')
  },

  'Assert increment speed' (client) {
    client.click(el('HomeContainer-speedIncrement'))
    client.expect.element(el('HomeContainer-speed')).text.to.equal('Slow')
    client.click(el('HomeContainer-speedIncrement'))
    client.expect.element(el('HomeContainer-speed')).text.to.equal('Normal')
    client.click(el('HomeContainer-speedIncrement'))
    client.expect.element(el('HomeContainer-speed')).text.to.equal('Fast')
    client.click(el('HomeContainer-speedIncrement'))
    client.expect.element(el('HomeContainer-speed')).text.to.equal('INSANE')
  },

  'Assert bestScore when no previous games' (client) {
    client.expect.element(el('HomeContainer-bestScore')).text.to.contain('0')
  },

  'Assert routing to auth when user not logged in' (client) {
    client.expect.element(el('HomeContainer-routeToAuth')).to.be.visible
    client.click(el('HomeContainer-routeToAuth'))
    client.assert.urlContains('auth')
    client
      .url(url)
      .waitForElementVisible('body', 5000)
  },

  'Assert routing to play screen' (client) {
    client.expect.element(el('HomeContainer-routeToPlay')).to.be.visible
    client.click(el('HomeContainer-routeToPlay'))
    client.assert.urlContains('play')
    client
      .url(url)
      .waitForElementVisible('body', 5000)
  },

  'Assert loading game config from LS' (client) {
    client
      .execute('localStorage.setItem("gameConfig", JSON.stringify({nBack: 6, speed: 500, modes:{ audio: true, color: true, position: false }}))')
      .execute('store.dispatch({ type: "init app" })')
    client.expect.element(el('HomeContainer-nBack')).text.to.equal('6')
    client.expect.element(el('HomeContainer-speed')).text.to.equal('INSANE')
    client.expect.element(el('HomeContainer-modePosition')).to.not.have.attribute('class').contains('active')
    client.expect.element(el('HomeContainer-modeAudio')).to.have.attribute('class').contains('active')
    client.expect.element(el('HomeContainer-modeColor')).to.have.attribute('class').contains('active')
  },

  'Assert loading scores from LS' (client) {
    client
      .execute('localStorage.setItem("bestScores", JSON.stringify({audiocolor6: 7}))')
      .execute('store.dispatch({ type: "init app" })')
    client.expect.element(el('HomeContainer-bestScore')).text.to.contain('7')
    client.click(el('HomeContainer-nBackIncrement'))
    client.expect.element(el('HomeContainer-bestScore')).text.to.contain('0')
  },

  'Assert no auth link when user is logged in' (client) {
    client
      .execute('localStorage.setItem("user", JSON.stringify({name: "John Wayne"}))')
      .execute('store.dispatch({ type: "init app" })')
    client.expect.element(el('HomeContainer-routeToAuth')).to.not.be.present
    client
      .url(url)
      .waitForElementVisible('body', 5000)
  },

  after (client) {
    client.execute('localStorage.clear()')
    client.end()
  },
}
