import Libp2p from 'libp2p'

// import TCP from 'libp2p-tcp'
// import mDNS from 'libp2p-mdns'
import Mplex from 'libp2p-mplex'
import KadDHT from 'libp2p-kad-dht'
import { NOISE } from 'libp2p-noise'
import Gossipsub from 'libp2p-gossipsub'
import Bootstrap from 'libp2p-bootstrap'
import Websockets from 'libp2p-websockets'
import WebRTCStar from 'libp2p-webrtc-star'

const listeners = [
  '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
  '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star'
]

const bootstrapers = [
  '/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
  '/dns4/lon-1.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3',
  '/dns4/sfo-3.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM',
  '/dns4/sgp-1.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu',
  '/dns4/nyc-1.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm',
  '/dns4/nyc-2.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64'
]

export const options = {
  addresses: {
    listen: listeners
  },
  modules: {
    transport: [Websockets, WebRTCStar],
    connEncryption: [NOISE],
    streamMuxer: [Mplex],
    peerDiscovery: [Bootstrap],
    dht: KadDHT,
    pubsub: Gossipsub
  },
  config: {
    dht: {
      enabled: true
    },
    peerDiscovery: {
      [Bootstrap.tag]: {
        enabled: true,
        list: bootstrapers
      }
    }
  }
}

export const plugin = {
  install (Vue, node) {
    Vue.prototype.$p2p = node
  }
}

export const create = async () => {
  const node = await Libp2p.create(options)
  await node.start()
  return node
}
