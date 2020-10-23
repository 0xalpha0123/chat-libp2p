import Vue from 'vue'

import 'sakura.css/css/sakura-dark.css'

import App from './App.vue'
import * as Node from './libp2p'

const main = async () => {
  const node = await Node.create()

  Vue.config.productionTip = false

  Vue.use(Node.plugin, node)

  new Vue({
    render: h => h(App)
  }).$mount('#app')
}

main()
