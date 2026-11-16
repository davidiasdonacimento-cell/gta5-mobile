import * as THREE from 'three';
import { TouchControls } from '../input/TouchControls.js';
import { createCity } from '../world/createCity.js';

export class OpenWorldGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x91b9d0);
    this.scene.fog = new THREE.Fog(0x91b9d0, 65, 230);
    this.camera = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, 0.1, 500);
    this.camera.position.set(0, 7, 12);
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.shadowMap.enabled = false;
    this.clock = new THREE.Clock();
    this.player = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.5, 0.55), new THREE.MeshStandardMaterial({ color: 0x16a6c9 }));
    body.position.y = 0.9;
    this.player.add(body);
    this.player.position.set(0, 0, 5);
    this.scene.add(this.player);
    this.controls = new TouchControls();
    this.keys = new Set();
    this.onKeyDown = e => this.keys.add(e.key.toLowerCase());
    this.onKeyUp = e => this.keys.delete(e.key.toLowerCase());
    this.onResize = () => this.resize();
    addEventListener('keydown', this.onKeyDown);
    addEventListener('keyup', this.onKeyUp);
    addEventListener('resize', this.onResize);
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x53616b, 2));
    const sun = new THREE.DirectionalLight(0xffffff, 2);
    sun.position.set(-30, 60, 25);
    this.scene.add(sun);
    createCity(this.scene);
    this.animate = this.animate.bind(this);
  }
  start() { this.renderer.setAnimationLoop(this.animate); document.querySelector('#loading').classList.add('hidden'); }
  animate() {
    const dt = Math.min(this.clock.getDelta(), 0.05);
    const input = this.controls.read();
    const forward = input.forward || this.keys.has('w') || this.keys.has('arrowup');
    const back = input.back || this.keys.has('s') || this.keys.has('arrowdown');
    const left = input.left || this.keys.has('a') || this.keys.has('arrowleft');
    const right = input.right || this.keys.has('d') || this.keys.has('arrowright');
    const direction = new THREE.Vector3(Number(right)-Number(left), 0, Number(back)-Number(forward));
    if (direction.lengthSq()) {
      direction.normalize();
      this.player.position.addScaledVector(direction, 7 * dt);
      this.player.rotation.y = Math.atan2(direction.x, direction.z);
    }
    this.camera.position.lerp(new THREE.Vector3(this.player.position.x, 7, this.player.position.z + 11), 1 - Math.exp(-5 * dt));
    this.camera.lookAt(this.player.position.x, 0.8, this.player.position.z);
    document.querySelector('#speed').textContent = direction.lengthSq() ? '7 km/h' : '0 km/h';
    this.renderer.render(this.scene, this.camera);
  }
  resize() {
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(innerWidth, innerHeight);
  }
  dispose() {
    this.renderer.setAnimationLoop(null);
    this.controls.dispose();
    removeEventListener('keydown', this.onKeyDown);
    removeEventListener('keyup', this.onKeyUp);
    removeEventListener('resize', this.onResize);
    this.renderer.dispose();
  }
}
