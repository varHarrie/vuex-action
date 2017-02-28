export const isString = (val) => typeof val === 'string'

export const isObject = (val) => val && typeof val === 'object'

export const isFunction = (val) => typeof val === 'function'

export const isPromise = (val) => isObject(val) && isFunction(val.then)
