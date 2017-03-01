import 'babel-polyfill'
import {expect} from 'chai'

import Vue from 'vue'
import Vuex from 'vuex'
import {createActions} from '../src/index'

Vue.use(Vuex)

const fetchUserFailApi = function (id) {
  return Promise.reject(new Error(id + ' not found'))
}

const fetchUserApi = function (id) {
  return Promise.resolve({id: id, name: 'varHarrie'})
}

const actions = Object.assign(
  {},
  createActions([
    'increment',
    'decrement',
    {
      'add': (count) => count || 1,
      'subtract': (count) => count || 1
    }
  ]),
  createActions('[fetch]', {
    fetchUser: (id) => fetchUserApi(id),
    fetchUserFail: (id) => fetchUserFailApi(id)
  }),
  createActions(['foo', { bar: (o) => o }], true)
)

const state = {
  count: 0,
  user: null
}

const mutations = {
  [actions.increment] (state, count) { state.count += count },
  [actions.decrement] (state, count) { state.count -= count },
  [actions.add] (state, count) { state.count += count },
  [actions.subtract] (state, count) { state.count -= count },
  [actions.fetchUserFail] (state, user) { throw new Error('Unreachable code block') },
  [actions.fetchUser] (state, user) { state.user = user },
  [actions.foo] () {},
  [actions.bar] () {}
}

const store = new Vuex.Store({state, mutations, actions})

describe('[createAction]', function () {
  it('increment --- payload', function () {
    store.dispatch('increment', 5)
    expect(store.state.count).to.equal(5)
  })

  it('decrement --- normal function', function () {
    store.dispatch('decrement', 1)
    expect(store.state.count).to.equal(4)
  })

  it('add --- only type', function () {
    expect(actions.add.toString()).to.equal('add')
  })

  it('subtract --- type and handler', function () {
    expect(actions.subtract.toString()).to.equal('subtract')
  })

  it('fetchUser --- type prefix', function () {
    expect(actions.fetchUser.toString()).to.equal('[fetch]fetchUser')
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

  it('foo&&bar --- auto generate type', function () {
    expect(actions.foo.toString()).to.not.equal('foo')
    expect(actions.bar.toString()).to.not.equal('bar')
  })
})
