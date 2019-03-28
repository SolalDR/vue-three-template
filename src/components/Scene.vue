<template>
  <canvas class="scene"/>
</template>

<script>
import Scene from '../webgl/Scene';

export default {
  mounted() {
    this.scene = new Scene(this.$el);
  },
  destroyed() {
    this.scene.destroy();
  },
};
</script>

<style lang="scss">
.scene {
  width: 100%;
  height: 100%;
  min-width: 100%;
  min-height: 100vh;
}
</style>
