import * as THREE from 'three';
import { TouchControls } from '../input/TouchControls.js';
import { createCity } from '../world/createCity.js';
import { UIController } from '../ui/UIController.js';
import { SaveSystem } from '../systems/SaveSystem.js';
import { Vehicle } from '../vehicles/Vehicle.js';

export class OpenWorldGame {
  constructor(canvas) {
    this.canvas=canvas; this.scene=new THREE.Scene();
    this.scene.background=new THREE.Color(0x91b9d0); this.scene.fog=new THREE.Fog(0x91b9d0,75,250);
    this.camera=new THREE.PerspectiveCamera(65,innerWidth/innerHeight,.1,500); this.camera.position.set(0,7,12);
    this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.5)); this.renderer.setSize(innerWidth,innerHeight);
    this.renderer.shadowMap.enabled=false; this.clock=new THREE.Clock();
    this.scene.add(new THREE.HemisphereLight(0xffffff,0x53616b,2));
    const sun=new THREE.DirectionalLight(0xffffff,2); sun.position.set(-30,60,25); this.scene.add(sun);
    this.city=createCity(this.scene);
    this.player=new THREE.Group();
    const body=new THREE.Mesh(new THREE.CapsuleGeometry(.38,.75,4,8),new THREE.MeshStandardMaterial({color:0x16a6c9}));
    body.position.y=.95; this.player.add(body);
    const head=new THREE.Mesh(new THREE.SphereGeometry(.23,12,10),new THREE.MeshStandardMaterial({color:0xc9916b}));
    head.position.y=1.65; this.player.add(head); this.player.position.set(0,0,5); this.scene.add(this.player);
    this.vehicle=new Vehicle(this.scene,new THREE.Vector3(4,0,2));
    this.controls=new TouchControls(); this.keys=new Set(); this.save=new SaveSystem();
    this.money=this.save.load()?.money ?? 2500;
    this.ui=new UIController({money:this.money,onPlay:()=>this.enterGame(),onResume:()=>this.resume(),onMenu:()=>this.showMenu(),onPurchase:(price)=>this.purchase(price)});
    this.ui.setMoney(this.money);
    this.onKeyDown=e=>{this.keys.add(e.key.toLowerCase());if(e.key==='Escape')this.ui.togglePause();};
    this.onKeyUp=e=>this.keys.delete(e.key.toLowerCase()); this.onResize=()=>this.resize();
    addEventListener('keydown',this.onKeyDown);addEventListener('keyup',this.onKeyUp);addEventListener('resize',this.onResize);
    this.active=false;this.started=false;this.verticalVelocity=0;this.animate=this.animate.bind(this);
  }
  start(){this.renderer.setAnimationLoop(this.animate);document.querySelector('#loading').classList.add('hidden');}
  enterGame(){this.started=true;this.active=true;this.ui.hideScreens();this.ui.setStatus('Explorando');}
  resume(){this.active=true;this.ui.hideScreens();}
  showMenu(){this.active=false;this.ui.showMenu();}
  purchase(price){if(this.money<price){this.ui.notify('Dinheiro insuficiente.');return false;}this.money-=price;this.ui.setMoney(this.money);this.save.save({money:this.money,player:{x:this.player.position.x,z:this.player.position.z}});this.ui.notify('Compra realizada!');return true;}
  animate(){
    const dt=Math.min(this.clock.getDelta(),.05);
    if(this.active){
      const input=this.controls.read();
      const forward=input.forward||this.keys.has('w')||this.keys.has('arrowup');
      const back=input.back||this.keys.has('s')||this.keys.has('arrowdown');
      const left=input.left||this.keys.has('a')||this.keys.has('arrowleft');
      const right=input.right||this.keys.has('d')||this.keys.has('arrowright');
      const direction=new THREE.Vector3(Number(right)-Number(left),0,Number(back)-Number(forward));
      if(input.jump&&this.player.position.y<=0.001)this.verticalVelocity=6;
      this.verticalVelocity-=16*dt;this.player.position.y=Math.max(0,this.player.position.y+this.verticalVelocity*dt);
      if(this.player.position.y===0)this.verticalVelocity=0;
      if(direction.lengthSq()){direction.normalize();this.player.position.addScaledVector(direction,7*dt);this.player.rotation.y=Math.atan2(direction.x,direction.z);}
      this.camera.position.lerp(new THREE.Vector3(this.player.position.x,7,this.player.position.z+11),1-Math.exp(-5*dt));
      this.camera.lookAt(this.player.position.x,.8,this.player.position.z);
      this.ui.setSpeed(direction.lengthSq()?7:0);
      const nearShop=this.city.shopPosition.distanceTo(this.player.position)<4;
      this.ui.showInteract(nearShop);
    }
    this.renderer.render(this.scene,this.camera);
  }
  resize(){this.camera.aspect=innerWidth/innerHeight;this.camera.updateProjectionMatrix();this.renderer.setSize(innerWidth,innerHeight);}
  dispose(){this.renderer.setAnimationLoop(null);this.controls.dispose();this.ui.dispose();removeEventListener('keydown',this.onKeyDown);removeEventListener('keyup',this.onKeyUp);removeEventListener('resize',this.onResize);this.renderer.dispose();}
}
