<template>
  <div id="app">
    Your id:
    {{ self }}

    <form @submit.prevent="fetchPeer">
      <label for="peer"> Peer </label>
      <input type="text" name="peer" v-model="peer">
    </form>

    <form @submit.prevent="sendMessage">
      <label for="message"> Message </label>
      <input type="text" name="message" v-model="message">
    </form>
  </div>
</template>

<script>
import PeerId from 'peer-id'
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
        .then(console.log)
        .catch(console.log)
    },

    sendMessage () {
      const msg = uint8ArrayFromString(this.message)
      this.libp2p.pubsub.publish('chat', msg)
    }
  },

  beforeMount () {
    this.self = this.libp2p.peerId.toB58String()
  }
}
</script>
