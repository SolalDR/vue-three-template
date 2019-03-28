import Vue from 'vue';
import VueBus from 'vue-bus';
import App from './App.vue';
import router from './router';
import store from './store';
import plugins from './plugins';
import './assets/styles/index.scss';

Vue.use(VueBus);
Vue.use(plugins.Mouse);
Vue.use(plugins.UserAgent);
Vue.use(plugins.Axios);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
