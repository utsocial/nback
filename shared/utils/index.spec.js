import utils from './'

describe('shared/utils/index', () => {
  describe('getBestScore', () => {
    it('should return 0', () => {
      // given
      const modes = { audio: false, position: true, color: true }
      const nBack = 1
      const bestScores = {}

      // when
      const bestScore = utils.getBestScore(modes, nBack, bestScores)

      // then
      expect(bestScore).to.equal(0)
    })

    it('should return 0', () => {
      // given
      const modes = { audio: false, position: true, color: true }
      const nBack = 1
      const bestScores = { audioposition1: 20 }

      // when
      const bestScore = utils.getBestScore(modes, nBack, bestScores)

      // then
      expect(bestScore).to.equal(0)
    })

    it('should return 20', () => {
      // given
      const modes = { audio: true, position: true, color: false }
      const nBack = 1
      const bestScores = { audioposition1: 20, audioposition2: 30 }

      // when
      const bestScore = utils.getBestScore(modes, nBack, bestScores)

      // then
      expect(bestScore).to.equal(20)
    })
  })
})
