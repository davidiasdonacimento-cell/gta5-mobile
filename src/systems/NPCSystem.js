import * as THREE from 'three';

export class NPCSystem {
  constructor(scene,count=10) {
    this.people=[];
    const skin=new THREE.MeshStandardMaterial({color:0xc58d6c});
    const clothes=[0x287fba,0x3e9b69,0xa34f79,0xc18c38,0x777fce].map(color=>new THREE.MeshStandardMaterial({color}));
    for(let i=0;i<count;i++){
      const person=new THREE.Group();
      const body=new THREE.Mesh(new THREE.CapsuleGeometry(.24,.62,3,7),clothes[i%clothes.length]);
      body.position.y=.72;person.add(body);
      const head=new THREE.Mesh(new THREE.SphereGeometry(.16,10,8),skin);
      head.position.y=1.28;person.add(head);
      const route=i%4;
      const lane=route<2?-11:11;
      const start=-38+(i*17)%76;
      person.position.set(route<2?lane:start,0,route<2?start:lane);
      scene.add(person);
      this.people.push({group:person,route,lane,offset:i*5.4,phase:Math.random()*Math.PI*2});
    }
  }
  update(delta,time) {
    for(const npc of this.people){
      const t=(time*.75+npc.offset)%76-38;
      if(npc.route===0){npc.group.position.set(-11,0,t);npc.group.rotation.y=0;}
      else if(npc.route===1){npc.group.position.set(11,0,-t);npc.group.rotation.y=Math.PI;}
      else if(npc.route===2){npc.group.position.set(t,0,-11);npc.group.rotation.y=Math.PI/2;}
      else {npc.group.position.set(-t,0,11);npc.group.rotation.y=-Math.PI/2;}
      npc.group.position.y=Math.abs(Math.sin(time*7+npc.phase))*.035;
    }
  }
  dispose(){for(const npc of this.people)npc.group.removeFromParent();this.people.length=0;}
}
