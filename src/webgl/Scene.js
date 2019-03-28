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
    this.cube = new THREE.Mesh(new THREE.CubeGeometry(), new THREE.MeshPhongMaterial({
      color: 0xFF0000,
    }));
    this.scene.add(this.cube);
    this.camera.position.z = 5;
    this.loop();
  }


  loop() {
    requestAnimationFrame(this.loop.bind(this));
    this.renderer.render();
  }
}

export default Scene;
