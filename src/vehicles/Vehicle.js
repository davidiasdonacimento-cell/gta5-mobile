import * as THREE from 'three';

export class Vehicle {
  constructor(scene,position=new THREE.Vector3(3,0,3)) {
    this.group=new THREE.Group();this.speed=0;this.maxSpeed=24;this.steeringAngle=0;
    const paint=new THREE.MeshStandardMaterial({color:0xd34c4c,metalness:.28,roughness:.48});this.paint=paint;
    const glass=new THREE.MeshStandardMaterial({color:0x243c4b,metalness:.1,roughness:.22});
    const rubber=new THREE.MeshStandardMaterial({color:0x11151a,roughness:.9});
    const rim=new THREE.MeshStandardMaterial({color:0x9daab5,metalness:.7,roughness:.3});
    const chassis=new THREE.Mesh(new THREE.BoxGeometry(2.05,.62,3.8),paint);chassis.position.y=.68;this.group.add(chassis);
    const cabin=new THREE.Mesh(new THREE.BoxGeometry(1.62,.72,1.82),glass);cabin.position.set(0,1.28,-.18);this.group.add(cabin);
    const hood=new THREE.Mesh(new THREE.BoxGeometry(1.9,.16,.85),paint);hood.position.set(0,1,-1.32);this.group.add(hood);
    this.wheels=[];
    for(const x of [-.98,.98])for(const z of [-1.22,1.22]){
      const wheel=new THREE.Group();wheel.position.set(x,.42,z);
      const tire=new THREE.Mesh(new THREE.CylinderGeometry(.38,.38,.22,14),rubber);tire.rotation.z=Math.PI/2;wheel.add(tire);
      const hub=new THREE.Mesh(new THREE.CylinderGeometry(.18,.18,.235,12),rim);hub.rotation.z=Math.PI/2;wheel.add(hub);
      this.group.add(wheel);this.wheels.push({mesh:wheel,front:z<0});
    }
    const lampMat=new THREE.MeshBasicMaterial({color:0xffefc5});
    for(const x of [-.65,.65]){const lamp=new THREE.Mesh(new THREE.BoxGeometry(.42,.18,.08),lampMat);lamp.position.set(x,.83,-1.94);this.group.add(lamp);}
    this.group.position.copy(position);scene.add(this.group);
  }
  update(throttle,steering,delta) {
    this.speed=THREE.MathUtils.clamp(this.speed+throttle*11*delta,-7,this.maxSpeed);
    if(!throttle)this.speed*=Math.pow(.965,delta*60);
    if(Math.abs(this.speed)<.06)this.speed=0;
    this.steeringAngle=THREE.MathUtils.damp(this.steeringAngle,steering*.45,7,delta);
    this.group.rotation.y+=this.steeringAngle*(this.speed/this.maxSpeed)*2.4*delta;
    this.group.translateZ(-this.speed*delta);
    for(const wheel of this.wheels){if(wheel.front)wheel.mesh.rotation.y=this.steeringAngle;wheel.mesh.rotation.x-=this.speed*delta/.38;}
    return this.speed;
  }
  setPaint(color){this.paint.color.setHex(color);}
  stop(){this.speed=0;}
  dispose(){this.group.removeFromParent();}
}
