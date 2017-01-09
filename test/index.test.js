import 'babel-polyfill'
import {expect} from 'chai'

import Vue from 'vue'
import Vuex from 'vuex'
import {createAction} from '../src/index'

const state = {
  count: 0,
  user: {
    id: 1,
    name: 'Harrie'
  },
  pet: null
}

const increment = createAction()
const decrement = createAction()
const add = createAction()

const setUser = createAction((user) => {
  user.gender = user.gender || 'male'
  return user
})

const fetchPetApi = function (name) {
  if (name) return Promise.resolve({name, type: 'dog'})
  else return Promise.reject(new Error('Can not fetch pets'))
}

const fetchPet = createAction((name) => fetchPetApi(name))

const mutations = {
  [increment] (state) { state.count++ },
  [decrement] (state) { state.count-- },
  [add] (state, num) { state.count += num },
  [setUser] (state, user) { state.user = user },
  [fetchPet] (state, pet) {
    state.pet = pet
  }
}

Vue.use(Vuex)
const store = new Vuex.Store({state, mutations})

describe('test', function () {
  it('increment', function () {
    increment(store)
    expect(state.count).to.equal(1)
  })

  it('decrement', function () {
    decrement(store)
    expect(state.count).to.equal(0)
  })

  it('add', function () {
    add(store, 10)
    expect(state.count).to.equal(10)
  })

  it('setUser', function () {
    setUser(store, {id: 5, name: 'Bob'})
    expect(state.user).to.have.property('id', 5)
    expect(state.user).to.have.property('name', 'Bob')
    expect(state.user).to.have.property('gender')
  })

  it('fetchPet fail', function (done) {
    fetchPet(store).then(() => {
    }).catch((err) => done())
  })

  it('fetchPet success', function (done) {
    const promise = fetchPet(store, 'Cloris').then((a) => {
      expect(state.pet).to.be.an('object')
      expect(state.pet).to.have.property('name', 'Cloris')
      expect(state.pet).to.have.property('type', 'dog')
      done()
    })
    expect(promise).to.be.a('promise')
  })
})
