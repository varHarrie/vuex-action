import createAction from './createAction'
import {isString, isObject} from './utils'

function createType (prefix, name, autoGen) {
  return autoGen ? undefined : prefix + name
}

function objectToActions (object, prefix, autoGen) {
  const actions = {}

  for (let key in object) {
    const type = createType(prefix, key, autoGen)
    actions[key] = createAction(type, object[key])
  }

  return actions
}

function arrayToActions (array, prefix, autoGen) {
  const actions = {}

  if (Array.isArray(array)) {
    for (let name of array) {
      if (isString(name)) {
        const type = createType(prefix, name, autoGen)
        actions[name] = createAction(type)
      } else if (isObject(name)) {
        const _actions = objectToActions(name, prefix, autoGen)
        for (let prop in _actions) actions[prop] = _actions[prop]
      }
    }
  }

  return actions
}

export default function createActions (prefix, handlers, autoGen) {
  let actions = {}

  if (!isString(prefix)) {
    autoGen = handlers
    handlers = prefix
    prefix = ''
  }

  autoGen = !!autoGen

  if (Array.isArray(handlers)) actions = arrayToActions(handlers, prefix, autoGen)
  else if (isObject(handlers)) actions = objectToActions(handlers, prefix, autoGen)

  return actions
}
