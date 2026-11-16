import * as THREE from 'three';

export function createCity(scene) {
  const colliders=[];
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(500,500),new THREE.MeshStandardMaterial({color:0x66766b}));
  ground.rotation.x=-Math.PI/2;ground.position.y=-.08;scene.add(ground);
  const roadMat=new THREE.MeshStandardMaterial({color:0x303943});
  const road=new THREE.Mesh(new THREE.PlaneGeometry(18,240),roadMat);road.rotation.x=-Math.PI/2;road.position.y=.01;scene.add(road);
  const crossRoad=new THREE.Mesh(new THREE.PlaneGeometry(240,18),roadMat);crossRoad.rotation.x=-Math.PI/2;crossRoad.position.y=.015;scene.add(crossRoad);
  const lineMat=new THREE.MeshBasicMaterial({color:0xd6c77a});
  for(let z=-110;z<120;z+=12){const line=new THREE.Mesh(new THREE.PlaneGeometry(.18,5),lineMat);line.rotation.x=-Math.PI/2;line.position.set(0,.025,z);scene.add(line);}
  for(let x=-110;x<120;x+=12){const line=new THREE.Mesh(new THREE.PlaneGeometry(5,.18),lineMat);line.rotation.x=-Math.PI/2;line.position.set(x,.026,0);scene.add(line);}
  const materials=[0x9babb8,0xc2a58d,0x6d879b,0xb7b9a7].map(color=>new THREE.MeshStandardMaterial({color}));
  for(let x=-5;x<=5;x++)for(let z=-5;z<=5;z++){
    if(Math.abs(x)<2||Math.abs(z)<2)continue;
    const h=5+(Math.abs(x*13+z*7)%8)*1.8;
    const bx=x*13,bz=z*13;
    const building=new THREE.Mesh(new THREE.BoxGeometry(7,h,7),materials[Math.abs(x*3+z)%materials.length]);
    building.position.set(bx,h/2,bz);scene.add(building);
    colliders.push({x:bx,z:bz,halfX:3.9,halfZ:3.9});
    const roof=new THREE.Mesh(new THREE.BoxGeometry(7.2,.16,7.2),new THREE.MeshStandardMaterial({color:0x48545e}));
    roof.position.set(bx,h+.06,bz);scene.add(roof);
  }
  const shop=new THREE.Group();shop.position.set(13,0,5);
  const facade=new THREE.Mesh(new THREE.BoxGeometry(5,3.4,3),new THREE.MeshStandardMaterial({color:0x24394b}));facade.position.y=1.7;shop.add(facade);
  const door=new THREE.Mesh(new THREE.BoxGeometry(1.1,2.2,.12),new THREE.MeshStandardMaterial({color:0x64dfff,emissive:0x126080}));door.position.set(0,1.1,1.56);shop.add(door);
  const sign=new THREE.Mesh(new THREE.BoxGeometry(3.8,.55,.2),new THREE.MeshBasicMaterial({color:0x23c8ff}));sign.position.set(0,3.25,1.6);shop.add(sign);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(1.25,.07,8,32),new THREE.MeshBasicMaterial({color:0x5de7ff}));ring.position.set(0,.08,2.3);ring.rotation.x=Math.PI/2;shop.add(ring);
  scene.add(shop);
  return {shopPosition:new THREE.Vector3(13,0,8),colliders};
}
