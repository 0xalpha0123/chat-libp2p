import Vue from 'vue'
import Vuex from 'vuex'

import App from './App.vue'
import Store from './store'
import * as Node from './libp2p'

const main = async () => {
  const node = await Node.create()

  Vue.config.productionTip = false

  Vue.use(Vuex)
  Vue.use(Node.plugin, node)

  const plugin = Store.plugin(node)

  const store = new Vuex.Store({
    ...Store.store,
    plugins: [plugin]
  })

  new Vue({
    store,
    render: h => h(App)
  }).$mount('#app')
}

main()
