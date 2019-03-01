import * as THREE from 'three';
import EffectComposer from './composer/EffectComposer';
import RenderPass from './composer/RenderPass';
import BokehPass from './pass/bokeh';
import BloomPass from './pass/bloom';
import SobelPass from './pass/sobel';
import OutlinePass from './pass/outline';

class RendererComposer {
  constructor({
    scene = null,
    camera = null,
    canvas = null,
  } = {}) {
    this.camera = camera;
    this.scene = scene;

    this.baseRenderer = new THREE.WebGLRenderer({ canvas });
    this.baseRenderer.setPixelRatio(1.2);
    this.baseRenderer.setClearColor(0x000d8f, 1);
    this.baseRenderer.setSize(window.innerWidth, window.innerHeight);

    this.composer = new EffectComposer(this.baseRenderer);

    this.sobelPass = new SobelPass();
    // this.outlinePass = new OutlinePass(undefined, this.scene, this.camera, this.scene.children)
    const renderScene = new RenderPass(scene, camera);
    this.composer.addPass(renderScene);
    // renderScene.renderToScreen = true;
    this.composer.addPass(this.sobelPass);
    this.sobelPass.renderToScreen = true;
  }

  setSize(width, height) {
    this.baseRenderer.setSize(width, height);
    this.composer.setSize(width, height);
  }

  render() {
    this.composer.render(17);
  }
}

export default RendererComposer;
