import {create} from './types'
import {isPromise} from './utils'

export default function createAction (description, handler) {
  if (typeof description !== 'string') {
    handler = description
    description = ''
  }

  const type = create(description)

  const action = function ({dispatch}, ...args) {
    if (!handler) dispatch(type, ...args)

    if (typeof handler === 'function') {
      const result = handler(...args)
      if (isPromise(result)) {
        return result.then((arg) => {
          dispatch(type, arg)
          return arg
        })
      } else if (result instanceof Array) {
        dispatch(type, ...result)
      } else {
        dispatch(type, result)
      }
    }
  }

  action.toString = () => type

  return action
}
