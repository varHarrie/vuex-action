import Vuex from 'vuex'
import {createAction} from 'vuex-action'

const fetchUserApi = function (name) {
  return Promise.resolve({username: name})
}

const state = {
  count: 0,
  user: null
}

const actions = {
  decrease: createAction(),
  increase: createAction((num) => num || 1),
  fetchUser: createAction((name) => fetchUserApi(name))
}

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
