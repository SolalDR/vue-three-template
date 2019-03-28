const MousePlugin = {
  install(Vue) {
    Vue.prototype.$mouse = new Vue({
      data() {
        return {
          x: 0,
          y: 0,
          xUnit: 0.5,
          yUnit: 0.5,
          canDrag: false,
          hasDrag: false,
          xDrag: null,
          yDrag: null,
          scroll: 0,
        };
      },
      methods: {
        onMousemove(event) {
          this.x = event.clientX;
          this.y = event.clientY;
          this.xUnit = (event.clientX / window.innerWidth) * 2 - 1;
          this.yUnit = -(event.clientY / window.innerHeight) * 2 + 1;
          this.$bus.$emit('mouse:move', this);
          if (this.canDrag && (this.old[0] !== this.x || this.old[1] !== this.y)) {
            this.hasDrag = true;
            this.xDrag = this.x - this.old[0];
            this.yDrag = this.y - this.old[1];
          }
        },

        onTouchmove(event) {
          if (event.changedTouches && event.changedTouches[0]) {
            this.onMousemove(event.changedTouches[0]);
          }
        },

        onMousedown(event) {
          this.store(event.clientX, event.clientY);
          this.canDrag = true;
        },

        onTouchstart(event) {
          this.store(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
          this.canDrag = true;
        },

        onMouseup() {
          if (!this.hasDrag) { this.$bus.$emit('mouse:click', this); }
          this.store();
          this.canDrag = false;
        },

        onTouchend() {
          this.$bus.$emit('touch:click', this);
          this.store();
          this.canDrag = false;
        },

        store(x = null, y = null) {
          this.old[0] = x;
          this.old[1] = y;
          this.xDrag = null;
          this.yDrag = null;
          this.hasDrag = false;
        },

        onMousewheel(event) {
          this.scroll = event.deltaY;
          this.$bus.$emit('mouse:wheel', this.scroll);
        },

      },
      created() {
        this.old = [0, 0];

        window.addEventListener('mousemove', this.onMousemove.bind(this));
        window.addEventListener('mousedown', this.onMousedown.bind(this));
        window.addEventListener('mouseup', this.onMouseup.bind(this));
        window.addEventListener('touchstart', this.onTouchstart.bind(this));
        window.addEventListener('touchend', this.onTouchend.bind(this));
        window.addEventListener('touchmove', this.onTouchmove.bind(this));
        window.addEventListener('wheel', this.onMousewheel.bind(this));
      },
    });
  },
};

export default MousePlugin;
