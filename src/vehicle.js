import * as THREE from 'three';
const paint=(c,metalness=.35)=>new THREE.MeshStandardMaterial({color:c,metalness,roughness:.32});
export function createVehicle(scene,position){const group=new THREE.Group();const body=new THREE.Mesh(new THREE.BoxGeometry(2.15,.62,4.15),paint(0x1d6670,.55));body.position.y=.85;body.castShadow=true;group.add(body);
const cabin=new THREE.Mesh(new THREE.BoxGeometry(1.78,.86,2.05),new THREE.MeshPhysicalMaterial({color:0x263d49,metalness:.25,roughness:.18,transparent:true,opacity:.88,clearcoat:1}));cabin.position.set(0,1.55,-.15);group.add(cabin);
const hood=new THREE.Mesh(new THREE.BoxGeometry(1.92,.17,1.15),paint(0x27858a,.5));hood.position.set(0,1.18,1.32);group.add(hood);
const wheels=[];for(const x of [-1,1])for(const z of [-1.35,1.35]){const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.43,.43,.28,24),paint(0x15191d,.05));wheel.rotation.z=Math.PI/2;wheel.position.set(x*1.08,.48,z);wheel.castShadow=true;group.add(wheel);wheels.push(wheel);}
for(const x of [-.72,.72]){const light=new THREE.Mesh(new THREE.BoxGeometry(.42,.18,.06),new THREE.MeshStandardMaterial({color:0xffe9b2,emissive:0xffd17a,emissiveIntensity:1.2}));light.position.set(x,.95,2.09);group.add(light);}
group.position.copy(position);scene.add(group);let speed=0;function update(input,dt){speed=THREE.MathUtils.damp(speed,input.z<-.1?8:input.z>.1?-3:0,2.2,dt);group.rotation.y-=input.x*speed*.16*dt;group.translateZ(-speed*dt);for(const w of wheels)w.rotation.x+=speed*dt*2.5;}
return {group,update};}
