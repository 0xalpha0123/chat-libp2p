import Vue from 'vue'

import 'sakura.css/css/sakura-dark.css'

import App from './App.vue'
import * as Node from './p2p'

Vue.config.productionTip = false

const main = async () => {
  const node = await Node.create()

  Vue.use(Node.plugin, node)

  new Vue({
    render: h => h(App)
  }).$mount('#app')
}

main()
