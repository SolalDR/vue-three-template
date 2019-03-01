import fragmentShader from "./fragment.glsl";
import vertexShader from "./vertex.glsl";
import * as THREE from "three";
import Pass from "../../composer/Pass"

/**
 * @author SolalDR
 * Depth-of-field post-process with bokeh shader
 * @param {float} focus Interpolated between camera near and far
 * @param {float} aperture Focal aperture [0 - 1] (when equal 1 there is no visible effect)
 * @param {float} maxblur Clamp value to limitate dof intensity [0 - 1]
 */
class BokehPass extends Pass {
	
	/**
	 * @constructor
	 * @param {THREE.Scene} scene 
	 * @param {THREE.Camera} camera 
	 * @param {{focus: float, aperture: float, maxblur: float}} params 
	 */
	constructor(scene, camera, {
		focus = 1.0,
		aperture = 0.025,
		maxblur = 1.0,
	} = {}){
		super();

		this.scene = scene;
		this.camera = camera;
		this.focus = focus;
		this.aspect = camera.aspect;
		this._aperture = aperture;
		this._maxblur = maxblur;

		this.initRenderTarget();
		this.initBokehMaterial();
		this.initScene();


	}

	set aperture(value){ 
		this._aperture = value;
		this.material.uniforms.aperture.value = value;
	}
	get aperture(){ 
		return this._aperture;
	}

	set maxblur(value){ 
		this._maxblur = value;
		this.material.uniforms.maxblur.value = value;
	}
	get maxblur(){ 
		return this._maxblur;
	}


	/**
	 * Render method used by EffectComposer
	 * @private
	 */
	render( renderer, writeBuffer, readBuffer, delta, maskActive ) {
		// Render into depthTexture
		renderer.render( this.scene, this.camera, this.target, true );

		// Render bokeh composite
		this.material.uniforms.tColor.value = readBuffer.texture;
		this.material.uniforms.nearClip.value = this.camera.near;
		this.material.uniforms.farClip.value = this.camera.far;
		this.material.uniforms.focus.value = this.linearizedFocus;

		if ( this.renderToScreen ) {
			renderer.render( this.scene2, this.camera2 );
		} else {
			renderer.render( this.scene2, this.camera2, writeBuffer, this.clear );
		}
	}

	/**
	 * Initialize render target to compute depthTexture
	 * @private
	 */
	initRenderTarget(){
		this.target = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight );
		this.target.texture.format = THREE.RGBFormat;
		this.target.texture.minFilter = THREE.NearestFilter;
		this.target.texture.magFilter = THREE.NearestFilter;
		this.target.texture.generateMipmaps = false;
		this.target.stencilBuffer = false;
		this.target.depthBuffer = true;
		this.target.depthTexture = new THREE.DepthTexture();
		this.target.depthTexture.type = THREE.UnsignedShortType;
	}

	/**
	 * Init the shader material for the dof effect
	 * @private
	 */
	initBokehMaterial(){
		this.material = new THREE.ShaderMaterial( {
			defines: {
				DEPTH_PACKING: 1,
				PERSPECTIVE_CAMERA: 1
			},
			uniforms: {
				tColor:   	{ value: null },
				tDepth:   	{ value: this.target.depthTexture },
				focus:    	{ value: this.linearizedFocus },
				aspect:   	{ value: this.aspect },
				aperture: 	{ value: this.aperture },
				maxblur:  	{ value: this.maxblur },
				nearClip:  	{ value: this.camera.near },
				farClip: 	{ value: this.camera.far }
			},
			vertexShader,
			fragmentShader
		} );
	}

	/**
	 * @private
	 */
	initScene(){
		this.camera2 = new THREE.OrthographicCamera(- 1, 1, 1, - 1, 0, 1 );
		this.scene2  = new THREE.Scene();
		this.quad2 = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), null );
		this.quad2.frustumCulled = false;
		this.quad2.material = this.material;
		this.scene2.add( this.quad2 );
	}

	/**
	 * @private
	 */
	get linearizedFocus(){
		return (this.focus - this.camera.near)/(this.camera.far - this.camera.near);
	}

}
export default BokehPass;
