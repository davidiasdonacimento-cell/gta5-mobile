import * as THREE from 'three';
import { createPlayer } from './character.js';
export class NPCSystem{
 constructor(scene,count=8){this.people=[];for(let i=0;i<count;i++){const actor=createPlayer(scene);actor.group.position.set(-24+Math.random()*48,0,-55+Math.random()*110);actor.group.scale.setScalar(.82+Math.random()*.16);this.people.push({actor,phase:Math.random()*Math.PI*2,pace:1.1+Math.random()*.8,origin:actor.group.position.clone()});}}
 update(dt){for(const p of this.people){p.phase+=dt*.22;if(p.phase>Math.PI*2)p.phase-=Math.PI*2;const x=Math.sin(p.phase)*.35,z=Math.cos(p.phase*.7)*.35;p.actor.update({x,z,jump:false},dt*p.pace);if(p.actor.group.position.distanceTo(p.origin)>13)p.phase+=Math.PI;}}
}
