<template>
  <div id="app">
    <h1> Libp2p chat </h1>

    <h3> Peers discovered </h3>
    <p> {{ totalPeers }} </p>

    <h3> Your id: </h3>
    <p> {{ self }} </p>

    <form @submit.prevent="fetchPeer">
      <label for="peer"> Peer </label>
      <input type="text" name="peer" v-model="peer">
      <button @press="fetchPeer"> Connect </button>
    </form>

    <h4> Connected </h4>
    <ul>
      <li v-for="peer of peers" :key="peer"> {{ peer }} </li>
    </ul>

    <form @submit.prevent="sendMessage">
      <label for="message"> Message </label>
      <input type="text" name="message" v-model="message">
      <button @press="sendMessage"> Send </button>
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
    totalPeers: 0,

    messages: [],
    message: '',

    peers: [],
    peer: ''
  }),

  computed: {
    self () {
      return this.libp2p.peerId.toB58String()
    },

    subscribers () {
      return this.libp2p.pubsub.getSubscribers('chat')
    }
  },

  methods: {
    fetchPeer () {
      const peerId = PeerId.createFromB58String(this.peer)
      this.libp2p.peerRouting.findPeer(peerId)
        .then(p => {
          console.log('Found peer:', p)
          this.peers.push(this.peer)
          this.peer = ''
        })
        .catch(e => console.error(`Error fetching: ${this.peer}`))
    },

    sendMessage () {
      console.log('Sending message:', this.message)
      const msg = uint8ArrayFromString(this.message)
      this.libp2p.pubsub.publish('chat', msg)
      this.message = ''
    }
  },

  beforeMount () {
    this.libp2p.pubsub.on('chat', msg => {
      const message = uint8ArrayToString(msg.data)
      console.log('Received message:', message)
      this.messages.push(message)
    })

    this.libp2p.connectionManager.on('peer:discovery', peer => {
      console.log('New peer connected:', peer.toB58String())
      const id = peer.toB58String()
      this.peers.push(id)
    })

    this.libp2p.peerStore.on('peer', peer => {
      console.log('New peer discovered:', peer.toB58String())
      this.totalPeers++
    })

    this.libp2p.pubsub.subscribe('chat')
  }
}
</script>
