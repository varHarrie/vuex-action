import uuid from 'uuid/v4'
import {isPromise, isFunction} from './utils'

function createPayload (handler, args) {
  return isFunction(handler) ? handler(...args) : args[0]
}

export default function createAction (type, handler) {
  if (typeof type !== 'string') {
    handler = type
    type = uuid()
  }

  const action = function ({commit, dispatch}, ...args) {
    commit = commit || dispatch
    const payload = createPayload(handler, args)
    if (isPromise(payload)) {
      return payload.then((arg) => {
        commit(type, arg)
        return arg
      })
    } else {
      commit(type, payload)
    }
  }

  action.toString = () => type

  return action
}
