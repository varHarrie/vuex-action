import 'babel-polyfill'
import {expect} from 'chai'

import Vue from 'vue'
import Vuex from 'vuex'
import {createAction, types} from '../src/index'

const state = {
  count: 0,
  user: {
    id: 1,
    name: 'Harrie'
  },
  pet: null
}

const increment = createAction('+=1')
const decrement = createAction('-=1')
const add = createAction('+=num')

const setUser = createAction('set user', (user) => {
  user.gender = user.gender || 'male'
  return user
})

const fetchPetApi = function (name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const pets = {
        'Cloris': {name: 'Cloris', type: 'cat'},
        'Cara': {name: 'Cara', type: 'dog'}
      }
      if (pets[name]) resolve(pets[name])
      else reject(new Error('Can not fetch pets'))
    }, 100)
  })
}

const fetchPet = createAction('fetch pet', (name) => fetchPetApi(name))

console.log(types.all())

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
    fetchPet(store, 'Not Such Name').then(() => {
      expect(state.pet).to.be.null
      done()
    }).catch((err) => done())
  })

  it('fetchPet success', function (done) {
    const promise = fetchPet(store, 'Cloris').then((a) => {
      expect(state.pet).to.be.an('object')
      expect(state.pet).to.have.property('name', 'Cloris')
      expect(state.pet).to.have.property('type', 'cat')
      done()
    })
    expect(promise).to.be.a('promise')
  })
})
