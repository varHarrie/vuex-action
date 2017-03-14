import Vuex from 'vuex'
import {createActions} from 'vuex-action'

const fetchUserApi = function (name) {
  return Promise.resolve({username: name})
}

const state = {
  count: 0,
  user: null
}

const actions = createActions('[I am optional prefix]', [
  'decrease', // a normal action
  {
    increase: (num) => num || 1,
    fetchUser: (name) => fetchUserApi(name)
  }
])

// All actions with handler
// const actions = createActions('[I am optional prefix]', {
//   increase: (num) => num || 1,
//   fetchUser: (name) => fetchUserApi(name)
// })

const mutations = {
  [actions.decrease] (state, num) {
    state.count -= num
  },
  [actions.increament] (state, num) {
    state.count += num
  },
  [actions.fetchUser] (state, user) {
    state.user = user
  }
}

export default new Vuex.Store({
  state, mutations, actions
})
