<template>
  <div id="app">
    <scene/>
    <router-view/>
  </div>
</template>

<script>
import Scene from './components/Scene.vue';

export default {
  components: {
    Scene,
  },
};
</script>
