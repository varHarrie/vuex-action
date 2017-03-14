<template>
  <div>
    <p>Hello, {{user.username}}</p>
    <p>Count: {{count}}</p>
    <button @click="decrease()">-</button>
    <button @click="increase(2)">+</button>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import store from './store'

  export default {
    mounted () {
      // same with store.dispatch('user', 'Harrie')
      this.fetchUser('Harrie').then((user) => {
        // do something...
      })
    },
    computed: {
      ...mapState(['count', 'user'])
    },
    methods: {
      ...mapActions(['fetchUser', 'decrease', 'increase'])
    }
  }
</script>
