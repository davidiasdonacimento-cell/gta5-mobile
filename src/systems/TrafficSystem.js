import * as THREE from 'three';

export class TrafficSystem {
  constructor(scene,count=6) {
    this.cars=[];
    const paints=[0xd84b4b,0x2579b9,0xe0b84f,0xdddddf,0x343b4e].map(color=>new THREE.MeshStandardMaterial({color,metalness:.2,roughness:.6}));
    const glass=new THREE.MeshStandardMaterial({color:0x243b4c,metalness:.1,roughness:.25});
    for(let i=0;i<count;i++){
      const car=new THREE.Group();
      const body=new THREE.Mesh(new THREE.BoxGeometry(1.65,.55,3.1),paints[i%paints.length]);body.position.y=.55;car.add(body);
      const cabin=new THREE.Mesh(new THREE.BoxGeometry(1.35,.62,1.5),glass);cabin.position.set(0,1.05,-.15);car.add(cabin);
      car.position.set(i%2===0?-3:3,0,-85+i*29);
      if(i%2===1)car.rotation.y=Math.PI;
      scene.add(car);
      this.cars.push({group:car,direction:i%2===0?1:-1,speed:5+(i%3)*1.5});
    }
  }
  update(delta) {
    for(const car of this.cars){
      car.group.position.z+=car.direction*car.speed*delta;
      if(car.group.position.z>100)car.group.position.z=-100;
      if(car.group.position.z<-100)car.group.position.z=100;
    }
  }
  dispose(){for(const car of this.cars)car.group.removeFromParent();this.cars.length=0;}
}
