# vuex-action

> Utilities for vuex to create actions.

## Installation

```bash
  npm install --save vuex-action
```

## Usage

```javascript
  import {createAction} from 'vuex-action'
```

### createAction([description], [payloadHandler])

It creates an `action`, and the action `type` will generated acorrding to an increment variable (`index`) and description, like "[`index`]`description`".

```javascript
  // Create an action, description is optional
  // You can note the arguments required or anything you want
  const increment = createAction('description')
  // Same as
  const increment = createAction()
```

```javascript
  // PayloadHandler allows you to customize the payload, initialize the arg
  const add = createAction((num) => num || 1)
  // Therefore
  this.add() // +1
  this.add(5) // +5
```

```javascript
  // Or
  const fetchUserApi = function (name) {
    return Promise((resolve, reject) => resolve({username: name}))
  }
  // Return a Promise
  const fetchUser = createAction((name) => fetchUserApi(name))
  this.fetchUser('Harrie') // payload = {username: 'Harrie'}
```

```javascript
  // The store
  const store = new Vuex.Store({
    state: {
      count: 0,
      user: null
    },
    mutations: {
      [increment] (state, num) {
        state.count += num
      },
      [fetchUser] (state, user) {
        state.user = user
      }
    }
  })
```

## Inspired by

* [redux-act](https://github.com/pauldijou/redux-act) by [pauldijou](https://github.com/pauldijou)