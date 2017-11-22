const _ = require('lodash')
const el = require('../utils').el
const url = require('../utils').BASE_URL + '/play'
const EXEC_DELAY_FACTOR = Number(process.env.EXEC_DELAY_FACTOR) || 1

module.exports = {
  tags: ['Play Page'],

  before (client) {
    client
      .url(url)
      .execute('localStorage.clear()')
      .waitForElementVisible('body', 5000)
  },

  'initial UI' (client) {
    assertInitialUi(client)
  },

  'controls disabled on Init' (client) {
    // 5 times just to b sure :)
    _.times(5, () => client.click(el('PlayContainer-guessPosition')))
    _.times(5, () => client.click(el('PlayContainer-guessColor')))
    _.times(5, () => client.keys('cap'))
    assertInitialUi(client) // check that controls didn't do anything. There's probably a better way to test this ...
  },

  'home button' (client) {
    client
      .click(el('PlayContainer-home'))
      .assert.urlContains('/home')
      .url(url)
      .waitForElementVisible('body', 5000)
  },

  'game 1 - 2Back position color' (client) {
    client
      .execute('store.dispatch({ type: "sync gameConfig", payload: { nBack: 2, speed: 1000, modes: { audio: false, position: true, color: true } } })')
      .click(el('PlayContainer-start'))
      .pause(2000 * EXEC_DELAY_FACTOR)
      // score click color
      .pause(1000 * EXEC_DELAY_FACTOR, () => {
        client
          .click(el('PlayContainer-guessColor'))
          .expect.element(el('PlayContainer-score')).text.to.equal(1)
         // disabled after correct guess
        client
          .click(el('PlayContainer-guessColor'))
          .keys('c')
          .expect.element(el('PlayContainer-score')).text.to.equal(1)
      })
      // score click position
      .pause(1000 * EXEC_DELAY_FACTOR, () => {
        client
          .click(el('PlayContainer-guessPosition'))
          .expect.element(el('PlayContainer-score')).text.to.equal(2)
         // disabled after correct guess
        client
          .click(el('PlayContainer-guessPosition'))
          .keys('p')
          .expect.element(el('PlayContainer-score')).text.to.equal(2)
      })
      // score click color & position
      .pause(1000 * EXEC_DELAY_FACTOR, () => {
        client
          .click(el('PlayContainer-guessColor'))
          .expect.element(el('PlayContainer-score')).text.to.equal(3)
         // disabled after correct guess
        client
          .click(el('PlayContainer-guessColor'))
          .keys('c')
          .expect.element(el('PlayContainer-score')).text.to.equal(3)
        client
          .click(el('PlayContainer-guessPosition'))
          .expect.element(el('PlayContainer-score')).text.to.equal(4)
        // disabled after correct guess
        client
          .click(el('PlayContainer-guessPosition'))
          .click(el('PlayContainer-guessColor'))
          .keys('cp')
          .expect.element(el('PlayContainer-score')).text.to.equal(4)
      })
      // lose - miss color match
      .pause(2500, () => {
        assertGameOver(client, { score: 4, bestScore: 4 })
      })
  },

  'game 2 - 2Back position color' (client) {
    client
      .execute('store.dispatch({ type: "sync gameConfig", payload: { nBack: 2, speed: 1000, modes: { audio: false, position: true, color: true } } })')
      .click(el('PlayContainer-retry'))
      .pause(2000 * EXEC_DELAY_FACTOR)
      // score keypress position
      .pause(1000 * EXEC_DELAY_FACTOR, () => {
        client
          .keys('p')
          .expect.element(el('PlayContainer-score')).text.to.equal(1)
        // disabled after correct guess
        client
          .keys('p')
          .click(el('PlayContainer-guessPosition'))
          .expect.element(el('PlayContainer-score')).text.to.equal(1)
      })
      // score keypress color
      .pause(1000 * EXEC_DELAY_FACTOR, () => {
        client
          .keys('c')
          .expect.element(el('PlayContainer-score')).text.to.equal(2)
        // disabled after correct guess
        client
          .keys('c')
          .click(el('PlayContainer-guessColor'))
          .expect.element(el('PlayContainer-score')).text.to.equal(2)
      })
      // score color & position
      .pause(1000 * EXEC_DELAY_FACTOR, () => {
        client
          .click(el('PlayContainer-guessColor'))
          .expect.element(el('PlayContainer-score')).text.to.equal(3)
        // disabled after correct guess
        client
          .keys('c')
          .click(el('PlayContainer-guessColor'))
          .expect.element(el('PlayContainer-score')).text.to.equal(3)
        client
          .click(el('PlayContainer-guessPosition'))
          .expect.element(el('PlayContainer-score')).text.to.equal(4)
        // disabled after correct guess
        client
          .click(el('PlayContainer-guessPosition'))
          .click(el('PlayContainer-guessColor'))
          .keys('pc')
          .expect.element(el('PlayContainer-score')).text.to.equal(4)
      })
      // lose - miss color match
      .pause(2500, () => {
        assertGameOver(client, { score: 4, bestScore: 4 })
      })
  },

  'game 3 - 2Back position color' (client) {
    client
      .execute('store.dispatch({ type: "sync gameConfig", payload: { nBack: 2, speed: 1000, modes: { audio: false, position: true, color: true } } })')
      .click(el('PlayContainer-retry'))
      .pause(2000 * EXEC_DELAY_FACTOR)
      // lose - miss color match
      .pause(2500, () => {
        assertGameOver(client, { score: 0, bestScore: 4 })
      })
  },

  'game 4 - 1Back position color' (client) {
    client
      .execute('store.dispatch({ type: "sync gameConfig", payload: { nBack: 1, speed: 1000, modes: { audio: false, position: true, color: true } } })')
      .click(el('PlayContainer-retry'))
      // lose - click position wrong
      .pause(2000 * EXEC_DELAY_FACTOR, () => {
        client.click(el('PlayContainer-guessPosition'))
        assertGameOver(client, { score: 0, bestScore: 0 })
      })
  },

  'game 5 - 1Back position color' (client) {
    client
      .execute('store.dispatch({ type: "sync gameConfig", payload: { nBack: 1, speed: 1000, modes: { audio: false, position: true, color: true } } })')
      .click(el('PlayContainer-retry'))
      // lose - click color wrong
      .pause(2000 * EXEC_DELAY_FACTOR, () => {
        client.click(el('PlayContainer-guessColor'))
        assertGameOver(client, { score: 0, bestScore: 0 })
      })
  },

  'game 6 - 1Back position color' (client) {
    client
      .execute('store.dispatch({ type: "sync gameConfig", payload: { nBack: 1, speed: 1000, modes: { audio: false, position: true, color: true } } })')
      .click(el('PlayContainer-retry'))
      // lose - keypress position wrong
      .pause(2000 * EXEC_DELAY_FACTOR, () => {
        client.keys('p')
        assertGameOver(client, { score: 0, bestScore: 0 })
      })
  },

  'game 7 - 1Back position color' (client) {
    client
      .execute('store.dispatch({ type: "sync gameConfig", payload: { nBack: 1, speed: 1000, modes: { audio: false, position: true, color: true } } })')
      .click(el('PlayContainer-retry'))
      // lose - keypress color wrong
      .pause(2000 * EXEC_DELAY_FACTOR, () => {
        client.keys('c')
        assertGameOver(client, { score: 0, bestScore: 0 })
      })
  },

  // 'controls disabled on init' (client) {
  //   client.click(el('PlayContainer-guessPosition'))
  //   client.click(el('PlayContainer-guessColor'))
  //   client.keys('cap')
  //   client.expect.element(el('PlayContainer-gameOverScore')).to.not.be.present
  // },

  // 'pause button' (client) {
  //   client.click(el('PlayContainer-pause'))
  //   client.expect.element(el('PlayContainer-pause')).to.not.be.present
  //   client.expect.element(el('PlayContainer-resume')).to.be.present
  //   client.expect.element(el('PlayContainer-score')).to.be.present
  //   client.expect.element(el('PlayContainer-gameOverScore')).to.not.be.present
  //   client.expect.element(el('PlayContainer-gameOverAudio')).to.not.be.present
  //   client.expect.element(el('PlayContainer-menu')).to.not.be.present
  //   client.expect.element(el('PlayContainer-gameOverNBack')).to.not.be.present
  // },

  // 'controls disabled on pause' (client) {
  //   client.click(el('PlayContainer-guessPosition'))
  //   client.click(el('PlayContainer-guessColor'))
  //   client.keys('cap')
  //   client.expect.element(el('PlayContainer-gameOverScore')).to.not.be.present
  // },

  // 'resume button' (client) {
  //   client.click(el('PlayContainer-resume'))
  //   client.expect.element(el('PlayContainer-score')).to.be.present
  //   client.expect.element(el('PlayContainer-gameOverScore')).to.not.be.present
  //   client.expect.element(el('PlayContainer-gameOverAudio')).to.not.be.present
  //   client.expect.element(el('PlayContainer-menu')).to.not.be.present
  //   client.expect.element(el('PlayContainer-gameOverNBack')).to.not.be.present
  // },

  after (client) {
    client.execute('localStorage.clear()')
    client.end()
  },
}

function assertInitialUi (client) {
  client.expect.element(el('PlayContainer-start')).to.be.visible
  client.elements('css selector', el('Square'), res => client.expect(res.value.length).to.equal(9))
  client.expect.element(el('PlayContainer-guessPosition')).to.be.present
  client.expect.element(el('PlayContainer-guessColor')).to.be.present
  client.expect.element(el('PlayContainer-guessAudio')).to.not.be.present
  client.expect.element(el('PlayContainer-score')).to.not.be.present
  client.expect.element(el('PlayContainer-pause')).to.not.be.present
  client.expect.element(el('PlayContainer-resume')).to.not.be.present
  client.expect.element(el('PlayContainer-gameOverAudio')).to.not.be.present
  client.expect.element(el('PlayContainer-menu')).to.not.be.present
  client.expect.element(el('PlayContainer-retry')).to.not.be.present
  client.expect.element(el('PlayContainer-gameOverNBack')).to.not.be.present
  client.expect.element(el('PlayContainer-gameOverScore')).to.not.be.present
}

function assertActiveUi (client, { modes }) {
  client.expect.element(el('PlayContainer-start')).to.not.be.present
  client.expect.element(el('PlayContainer-score')).to.be.present
  client.expect.element(el('PlayContainer-pause')).to.be.present
  client.expect.element(el('PlayContainer-resume')).to.not.be.present
  client.expect.element(el('PlayContainer-menu')).to.not.be.present
  client.expect.element(el('PlayContainer-retry')).to.not.be.present
  client.expect.element(el('PlayContainer-gameOverAudio')).to.not.be.present
  client.expect.element(el('PlayContainer-gameOverNBack')).to.not.be.present
  client.expect.element(el('PlayContainer-gameOverScore')).to.not.be.present
  _.forOwn(modes, (isActive, mode) => {
    isActive && client.expect.element(el(`PlayContainer-guess${_.capitalize(mode)}`)).to.be.present
    !isActive && client.expect.element(el(`PlayContainer-guess${_.capitalize(mode)}`)).to.not.be.present
  })
  if (modes.position) {
    client.elements('css selector', el('Square'), res => client.expect(res.value.length).to.equal(9))
  }
}

// TODO - pass nBack turn and last turn
function assertGameOver (client, { score, bestScore, modes } = {}) {
  client.expect.element(el('PlayContainer-start')).to.not.be.present
  client.expect.element(el('PlayContainer-guessPosition')).to.not.be.present
  client.expect.element(el('PlayContainer-guessColor')).to.not.be.present
  client.expect.element(el('PlayContainer-guessAudio')).to.not.be.present
  client.expect.element(el('PlayContainer-score')).to.not.be.present
  client.expect.element(el('PlayContainer-pause')).to.not.be.present
  client.expect.element(el('PlayContainer-resume')).to.not.be.present
  client.expect.element(el('PlayContainer-menu')).to.be.present
  client.expect.element(el('PlayContainer-retry')).to.be.present
  client.expect.element(el('PlayContainer-gameOverHeader')).to.be.present
  client.expect.element(el('PlayContainer-gameOverNBack')).to.be.present
  client.expect.element(el('PlayContainer-gameOverScore')).to.be.present
  // modes.audio && client.expect.element(el('PlayContainer-gameOverAudio')).to.be.present
  // !modes.audio && client.expect.element(el('PlayContainer-gameOverAudio')).to.not.be.present

  if (score) {
    client.expect.element(el('PlayContainer-gameOverScore')).text.to.contain(`${score}/`)
  }
  if (bestScore) {
    client.expect.element(el('PlayContainer-gameOverScore')).text.to.contain(`/${bestScore}`)
  }
}
