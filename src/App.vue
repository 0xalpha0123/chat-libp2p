<template>
  <div id="app">
    <h1> Libp2p chat </h1>
    <h3> Your id: </h3>
    <p> {{ self }} </p>

    <form @submit.prevent="fetchPeer">
      <label for="peer"> Connect </label>
      <input type="text" name="peer" v-model="peer">
    </form>

    <form @submit.prevent="sendMessage">
      <label for="message"> Send </label>
      <input type="text" name="message" v-model="message">
    </form>

    <h4> Messages </h4>
    <ul>
      <li v-for="message of messages" :key="message"> {{ message }} </li>
    </ul>
  </div>
</template>

<script>
import PeerId from 'peer-id'
import uint8ArrayToString from 'uint8arrays/to-string'
import uint8ArrayFromString from 'uint8arrays/from-string'

export default {
  name: 'App',

  data: () => ({
    messages: [],
    message: '',
    input: '',
    peer: '',
    self: ''
  }),

  computed: {
    peerId () {
      return PeerId.createFromB58String(this.peer)
    }
  },

  methods: {
    fetchPeer () {
      this.libp2p.peerRouting.findPeer(this.peerId)
        .then(p => console.log('Found peer:', p))
        .catch(e => e)
    },

    sendMessage () {
      const msg = uint8ArrayFromString(this.message)
      this.libp2p.pubsub.publish('chat', msg)
    }
  },

  beforeMount () {
    this.self = this.libp2p.peerId.toB58String()

    this.libp2p.pubsub.on('chat', msg => {
      const message = uint8ArrayToString(msg.data)
      this.messages.push(message)
    })
    this.libp2p.pubsub.subscribe('chat')
  }
}
</script>
