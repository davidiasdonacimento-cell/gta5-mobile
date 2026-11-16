import * as THREE from 'three';

export function createCity(scene) {
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), new THREE.MeshStandardMaterial({ color: 0x66766b }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.08;
  scene.add(ground);
  const roadMat = new THREE.MeshStandardMaterial({ color: 0x303943 });
  const road = new THREE.Mesh(new THREE.PlaneGeometry(18, 240), roadMat);
  road.rotation.x = -Math.PI / 2;
  road.position.y = 0.01;
  scene.add(road);
  const crossRoad = new THREE.Mesh(new THREE.PlaneGeometry(240, 18), roadMat);
  crossRoad.rotation.x = -Math.PI / 2;
  crossRoad.position.y = 0.015;
  scene.add(crossRoad);
  const materials = [0x9babb8,0xc2a58d,0x6d879b,0xb7b9a7].map(color => new THREE.MeshStandardMaterial({color}));
  for (let x=-5; x<=5; x++) for (let z=-5; z<=5; z++) {
    if (Math.abs(x)<2 || Math.abs(z)<2) continue;
    const h = 5 + ((Math.abs(x*13+z*7)%8)*1.8);
    const building = new THREE.Mesh(new THREE.BoxGeometry(7,h,7), materials[Math.abs(x*3+z)%materials.length]);
    building.position.set(x*13,h/2,z*13);
    scene.add(building);
  }
}
