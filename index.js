import bub from './bubbleMsg.js'

const install = function (vue) {
  if (vue.prototype) {
    // vue2
    vue.prototype.$bub = bub
  } else {
    // vue3
    vue.config.globalProperties.$bub = bub
  }
}

export {bub}
export default install
