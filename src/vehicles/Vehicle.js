import * as THREE from 'three';

export class Vehicle {
  constructor(scene, position = new THREE.Vector3(3, 0, 3)) {
    this.group = new THREE.Group();
    const paint = new THREE.MeshStandardMaterial({ color: 0xd34c4c, metalness: 0.25, roughness: 0.55 });
    const glass = new THREE.MeshStandardMaterial({ color: 0x243c4b, roughness: 0.25 });
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.65, 3.8), paint);
    chassis.position.y = 0.65;
    this.group.add(chassis);
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.7, 1.8), glass);
    cabin.position.set(0, 1.25, -0.2);
    this.group.add(cabin);
    this.group.position.copy(position);
    scene.add(this.group);
    this.speed = 0;
  }
  update(throttle, steering, delta) {
    this.speed = THREE.MathUtils.clamp(this.speed + throttle * 9 * delta, -4, 22);
    this.speed *= Math.pow(0.985, delta * 60);
    this.group.rotation.y += steering * this.speed * 0.035 * delta;
    this.group.translateZ(-this.speed * delta);
  }
}
