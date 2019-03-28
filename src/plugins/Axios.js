import axios from 'axios';
import Vue from 'vue';

const axiosInstance = axios.create();

const AxiosPlugin = {
  install() {
    Vue.prototype.$axios = axiosInstance;
  },
};

export default AxiosPlugin;
