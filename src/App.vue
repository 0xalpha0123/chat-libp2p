<template>
  <div id="app">
    <h1> P2P chat </h1>
    <p> Your id: {{ self }} </p>

    <!-- Chat -->
    <section>
      <h2> Messages </h2>
      <p> Total messages: {{ messages.length }} </p>

      <!-- Messages -->
      <textarea rows="10" readonly v-model="chat" />

      <!-- Send -->
      <form @submit.prevent="sendMessage">
        <label for="message"> Message </label>
        <input type="text" name="message" v-model="message" placeholder="msg">
        <button @press="sendMessage"> Send </button>
      </form>
    </section>

    <!-- Peers -->
    <section>
      <h2> Peers </h2>

      <form @submit.prevent="fetchPeer">
        <label for="peer"> Connect </label>
        <input type="text" name="peer" v-model="peer" placeholder="id">
        <button @press="fetchPeer"> Connect </button>
      </form>

      <p> Total peers: {{ peers.length }} </p>

      <ul>
        <li v-for="(item, i) of peers" :key="i"> {{ item.toB58String() }} </li>
      </ul>
    </section>
  </div>
</template>

<script>
import PeerId from 'peer-id'
import uint8ArrayToString from 'uint8arrays/to-string'
import uint8ArrayFromString from 'uint8arrays/from-string'

export default {
  name: 'App',

  data: () => ({
    peer: '',
    peers: [],

    message: '',
    messages: []
  }),

  computed: {
    self () {
      return this.$p2p.peerId.toB58String()
    },
    chat () {
      return this.messages.join('\n')
    }
  },

  methods: {
    async fetchPeer () {
      const id = PeerId.createFromB58String(this.peer)
      const peer = await this.$p2p.peerRouting.findPeer(id)
      this.peers.push(peer.id)
      this.peer = ''
    },
    async sendMessage () {
      const msg = uint8ArrayFromString(this.message)
      await this.$p2p.pubsub.publish('chat', msg)
      this.messages.push(this.message)
      this.message = ''
    }
  },

  beforeMount () {
    // New message
    this.$p2p.pubsub.on('chat', msg => {
      const message = uint8ArrayToString(msg.data)
      this.messages.push(message)
    })

    this.$p2p.pubsub.subscribe('chat')

    // New peer
    this.$p2p.peerStore.on('peer', peer => {
      this.peers.push(peer)
    })
  }
}
</script>
