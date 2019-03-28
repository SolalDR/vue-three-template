import UAParser from 'ua-parser-js';

const UAPlugin = {

  install(Vue) {
    Vue.prototype.$ua = new Vue({
      data() {
        return new UAParser();
      },

      computed: {
        device() {
          return this.getDevice().type ? this.getDevice().type : 'desktop';
        },
      },
    });
  },
};


export default UAPlugin;
