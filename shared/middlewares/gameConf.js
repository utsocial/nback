import _ from 'lodash'

export default class GameConfMiddleware {

  toMiddleware () {
    return store => next => action => {
      if (action.type === 'toggle mode') {
        this.alertIfNoModes(store.getState().play, action.payload)
      }
      next(action)
    }
  }

  alertIfNoModes ({ modes }, modesToToggle) {
    const newMode = Object.assign({}, modes)
    newMode[modesToToggle] = !newMode[modesToToggle]
    // don't toggle this modes if all others are off
    if (_.some(Object.values(newMode))) {
      return
    }
    global.alert('At least one modes is required to play \n wont b much of a game otherwise, would it? :)')
  }
}
