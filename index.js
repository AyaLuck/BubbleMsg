import BubbleMsg from './bubbleMsg.js'

const install = function (vue) {
  if (vue.prototype) {
    // vue2
    vue.prototype.$bub = new BubbleMsg()
  } else {
    // vue3
    vue.config.globalProperties.$bub = new BubbleMsg()
  }
}

export default install
