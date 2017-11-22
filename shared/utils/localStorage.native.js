import { AsyncStorage } from 'react-native'
import logger from './logger'

export async function sync (dispatch, action, key, initValue = {}) {
  try {
    const value = await AsyncStorage.getItem(key)
    // initialize empty object on first run
    if (!value) {
      await AsyncStorage.setItem(key, JSON.stringify(initValue))
      return
    }
    dispatch(action(JSON.parse(value)))
  } catch (err) {
    logger.error(`localStorage helper: error syncing ${key}!`, err)
  }
}
