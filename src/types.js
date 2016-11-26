const types = {}

let i = 0

export function create (description) {
  const name = `[${i++}]${description}`
  types[name] = true
  return name
}

export function remove (name) {
  delete types[name]
}

export function has (name) {
  return !!types[name]
}

export function all () {
  return Object.keys(types).filter(has)
}
