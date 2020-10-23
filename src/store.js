
const state = {}

const getters = {}

const actions = {}

const mutations = {}

const store = {
  state,
  getters,
  actions,
  mutations
}

const plugin = node => {
  return store => {
    node.on('error', err => {
      store.commit('newLog', `Error: ${err}`)
    })

    node.on('peer:discovery', peer => {
      store.commit('peerDiscovery', peer)
      store.commit('newLog', `Peer discovered: ${peer.toB58String()}`)
    })

    node.connectionManager.on('peer:connect', conn => {
      store.commit('peerConnect', conn)
      const peer = conn.remotePeer.toB548String()
      store.commit('newLog', `Peer connected: ${peer}`)
    })

    node.connectionManager.on('peer:disconnect', conn => {
      store.commit('peerDisconect', conn)
      const peer = conn.remotePeer.toB548String()
      store.commit('newLog', `Peer disconnected: ${peer}`)
    })
  }
}

export default {
  store,
  plugin
}
