import * as THREE from 'three';

// Sistema simples de patrulha/follow. Não contém combate nem armas.
export class PoliceAI {
  constructor(scene) {
    this.group=new THREE.Group();
    const blue=new THREE.MeshStandardMaterial({color:0x1d4d89,metalness:.2,roughness:.55});
    const white=new THREE.MeshStandardMaterial({color:0xdfe8ee,roughness:.65});
    const body=new THREE.Mesh(new THREE.BoxGeometry(1.9,.62,3.7),white);body.position.y=.62;this.group.add(body);
    const hood=new THREE.Mesh(new THREE.BoxGeometry(1.88,.18,1.05),blue);hood.position.set(0,.98,-1.15);this.group.add(hood);
    const cabin=new THREE.Mesh(new THREE.BoxGeometry(1.52,.65,1.65),new THREE.MeshStandardMaterial({color:0x243b4c}));cabin.position.set(0,1.22,.1);this.group.add(cabin);
    const light=new THREE.Mesh(new THREE.BoxGeometry(.82,.15,.22),new THREE.MeshBasicMaterial({color:0x4ecaff}));light.position.set(0,1.62,.05);this.group.add(light);
    this.group.position.set(-5,0,-26);scene.add(this.group);this.visible=false;
  }
  update(delta,target,wantedLevel=0) {
    this.visible=wantedLevel>0;this.group.visible=this.visible;
    if(!this.visible||!target)return;
    const dx=target.x-this.group.position.x,dz=target.z-this.group.position.z;
    const distance=Math.hypot(dx,dz);
    if(distance>3){
      const step=Math.min(distance,4.5*delta);
      this.group.position.x+=dx/distance*step;this.group.position.z+=dz/distance*step;
      this.group.rotation.y=Math.atan2(dx,dz);
    }
  }
  dispose(){this.group.removeFromParent();}
}
