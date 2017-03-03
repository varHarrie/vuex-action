import 'babel-polyfill'
import {expect} from 'chai'

import Vue from 'vue'
import Vuex from 'vuex'
import {createAction} from '../src/index'

Vue.use(Vuex)

const fetchUserFailApi = function (id) {
  return Promise.reject(new Error(id + ' not found'))
}

const fetchUserApi = function (id) {
  return Promise.resolve({id: id, name: 'varHarrie'})
}

const actions = {
  increment: createAction(),
  decrement: createAction((count) => count || 1),
  add: createAction('ADD'),
  subtract: createAction('SUBTRACT', (count) => count || 1),
  fetchUser: createAction((id) => fetchUserApi(id)),
  fetchUserFail: createAction((id) => fetchUserFailApi(id)),
  multiParamFunc: createAction(({a, b, c}) => ({a, b, c}))
}

const state = {
  count: 0,
  user: null,
  a: 0,
  b: 0,
  c: 0
}

const mutations = {
  [actions.increment] (state, count) { state.count += count },
  [actions.decrement] (state, count) { state.count -= count },
  [actions.add] (state, count) { state.count += count },
  [actions.subtract] (state, count) { state.count -= count },
  [actions.fetchUserFail] (state, user) { throw new Error('Unreachable code block') },
  [actions.fetchUser] (state, user) { state.user = user },
  [actions.multiParamFunc] (state, {a, b, c}) {
    state.a = a
    state.b = b
    state.c = c
  }
}

const store = new Vuex.Store({state, mutations, actions})

describe('[createAction]', function () {
  it('increment --- payload', function () {
    store.dispatch('increment', 5)
    expect(store.state.count).to.equal(5)
  })

  it('decrement --- normal function', function () {
    store.dispatch('decrement')
    expect(store.state.count).to.equal(4)
  })

  it('add --- only type', function () {
    expect(actions.add.toString()).to.equal('ADD')
  })

  it('subtract --- type and handler', function () {
    expect(actions.subtract.toString()).to.equal('SUBTRACT')
  })

  it('fetchUserFail --- rejected promise', function (done) {
    store.dispatch('fetchUserFail', '123').catch((err) => {
      expect(store.state.user).to.be.null
      if (err.message === '123 not found') done()
      else done(err)
    })
  })

  it('fetchUser --- resolved promise', function (done) {
    store.dispatch('fetchUser', '123').then((data) => {
      expect(store.state.user).to.have.property('id', '123')
      expect(store.state.user).to.have.property('name', 'varHarrie')
      expect(data).to.have.property('id', '123')
      expect(data).to.have.property('name', 'varHarrie')
      done()
    })
  })

  it('multiParamFunc', function () {
    store.dispatch('multiParamFunc', {a: 1, b: 2, c: 3})
    expect(store.state.a).to.equal(1)
    expect(store.state.b).to.equal(2)
    expect(store.state.c).to.equal(3)
  })
})
