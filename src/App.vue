<template>
  <div id="app">
    <h1> Libp2p chat </h1>
    <p> Your id: {{ self }} </p>

    <!-- Connect -->
    <form @submit.prevent="fetchPeer">
      <label for="peer"> Peer </label>
      <input type="text" name="peer" v-model="peer">
      <button @press="fetchPeer"> Connect </button>
    </form>

    <!-- Send -->
    <form @submit.prevent="sendMessage">
      <label for="message"> Message </label>
      <input type="text" name="message" v-model="message">
      <button @press="sendMessage"> Send </button>
    </form>

    <!-- Messages -->
    <section>
      <h2> Messages </h2>
      <p> Total messages: {{ messages.length }} </p>
      <ul>
        <li v-for="message of messages" :key="message"> {{ message }} </li>
      </ul>
    </section>

    <!-- Peers -->
    <section>
      <h2> Peers </h2>
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
    this.$p2p.pubsub.subscribe('chat')

    // New message
    this.$p2p.pubsub.on('chat', msg => {
      const message = uint8ArrayToString(msg.data)
      this.messages.push(message)
    })

    // New peer
    this.$p2p.peerStore.on('peer', peer => {
      this.peers.push(peer)
    })
  }
}
</script>
