import * as THREE from 'three';
const material=(color,roughness=.75)=>new THREE.MeshStandardMaterial({color,roughness});
function capsule(radius,length,color){return new THREE.Mesh(new THREE.CapsuleGeometry(radius,length,5,10),material(color));}
export function createPlayer(scene){const group=new THREE.Group();const skin=material(0x9a684d),shirt=material(0x253f58),pants=material(0x252b35),shoe=material(0x171b20),hair=material(0x171717);
const torso=capsule(.39,.72,0x253f58);torso.position.y=1.48;group.add(torso);
const neck=new THREE.Mesh(new THREE.CylinderGeometry(.13,.15,.22,12),skin);neck.position.y=2.05;group.add(neck);
const head=new THREE.Mesh(new THREE.SphereGeometry(.29,20,16),skin);head.scale.set(.88,1.15,.9);head.position.y=2.36;head.castShadow=true;group.add(head);
const haircap=new THREE.Mesh(new THREE.SphereGeometry(.295,18,12,0,Math.PI*2,0,Math.PI*.53),hair);haircap.position.set(0,2.45,-.015);group.add(haircap);
const limbs=[];for(const side of [-1,1]){const arm=new THREE.Group();arm.position.set(side*.48,1.77,0);const upper=capsule(.13,.42,0x253f58);upper.position.y=-.27;arm.add(upper);const fore=capsule(.105,.36,0x9a684d);fore.position.y=-.67;arm.add(fore);group.add(arm);limbs.push(arm);
const leg=new THREE.Group();leg.position.set(side*.2,1.02,0);const thigh=capsule(.17,.42,0x252b35);thigh.position.y=-.29;leg.add(thigh);const shin=capsule(.13,.42,0x252b35);shin.position.y=-.7;leg.add(shin);const foot=new THREE.Mesh(new THREE.SphereGeometry(.16,12,10),shoe);foot.scale.set(1,.55,1.5);foot.position.set(0,-.96,.12);leg.add(foot);group.add(leg);limbs.push(leg);}
group.position.set(-5,0,10);group.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
let walk=0,vy=0,onGround=true;function update(input,dt){const v=new THREE.Vector3(input.x,0,input.z);if(v.lengthSq()>1)v.normalize();const moving=v.lengthSq()>.001;walk+=dt*(moving?9:2);if(moving){const a=Math.atan2(v.x,v.z);group.rotation.y=THREE.MathUtils.lerp(group.rotation.y,a,Math.min(1,dt*10));group.position.addScaledVector(v,dt*7);}if(input.jump&&onGround){vy=7.2;onGround=false;}vy-=19*dt;group.position.y+=vy*dt;if(group.position.y<=0){group.position.y=0;vy=0;onGround=true;}limbs[0].rotation.x=Math.sin(walk)*.48*(moving?1:0);limbs[1].rotation.x=-Math.sin(walk)*.48*(moving?1:0);limbs[2].rotation.x=-Math.sin(walk)*.65*(moving?1:0);limbs[3].rotation.x=Math.sin(walk)*.65*(moving?1:0);torso.position.y=1.48+(moving?Math.abs(Math.sin(walk*2))*.035:0);}
return {group,update};}
