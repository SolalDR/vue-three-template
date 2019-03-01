import * as THREE from 'three';
import { OBJLoader } from './loaders';
import { OrbitControls } from './controls';
import RendererComposer from './postprocessing';

class Scene {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    const ratio = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(75, ratio, 0.1, 1000);
    this.renderer = new RendererComposer({
      scene: this.scene,
      camera: this.camera,
      canvas,
    });
    this.objLoader = new OBJLoader();
    this.orbitControl = new OrbitControls(this.camera);

    this.initLight();
    this.main();
  }

  initLight() {
    this.light = new THREE.PointLight();
    this.light.position.set(2, 2, 2);
    this.scene.add(this.light);
  }

  main() {
    this.objLoader.load('/3d/chair.obj', (result) => {
      const chair = result.children[0];
      chair.material = new THREE.MeshNormalMaterial();
      chair.needsUpdate = true;
      chair.position.y = -2;
      chair.scale.set(0.01, 0.01, 0.01);
      chair.rotation.x = -Math.PI / 2;
      this.scene.add(chair);
      console.log(chair);
    });

    this.camera.position.z = 5;
    this.loop();
  }


  loop() {
    requestAnimationFrame(this.loop.bind(this));
    this.renderer.render();
  }
}

export default Scene;
