import * as THREE from 'three';
import { TouchControls } from '../input/TouchControls.js';
import { createCity } from '../world/createCity.js';
import { UIController } from '../ui/UIController.js';
import { Minimap } from '../ui/Minimap.js';
import { SaveSystem } from '../systems/SaveSystem.js';
import { MissionSystem } from '../systems/MissionSystem.js';
import { NPCSystem } from '../systems/NPCSystem.js';
import { TrafficSystem } from '../systems/TrafficSystem.js';
import { PoliceAI } from '../systems/PoliceAI.js';
import { Vehicle } from '../vehicles/Vehicle.js';

const MISSION_DATA={
  'city-tour':{id:'city-tour',title:'Passeio pela cidade',description:'Chegue ao ponto de observação na avenida.',target:{x:0,z:-48},reward:500},
  'shop-delivery':{id:'shop-delivery',title:'Entrega na loja',description:'Encontre a loja iluminada no distrito.',target:{x:13,z:8},reward:750},
  'patrol-escape':{id:'patrol-escape',title:'Rota da patrulha',description:'Chegue ao destino enquanto a patrulha acompanha você.',target:{x:-55,z:-65},reward:1000}
};

export class OpenWorldGame {
  constructor(canvas) {
    this.canvas=canvas;
    this.scene=new THREE.Scene();
    this.scene.background=new THREE.Color(0x91b9d0);
    this.scene.fog=new THREE.Fog(0x91b9d0,75,250);
    this.camera=new THREE.PerspectiveCamera(65,innerWidth/innerHeight,.1,500);
    this.camera.position.set(0,7,12);
    this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
    this.renderer.setSize(innerWidth,innerHeight);
    this.renderer.shadowMap.enabled=false;
    this.clock=new THREE.Clock();
    this.scene.add(new THREE.HemisphereLight(0xffffff,0x53616b,2));
    const sun=new THREE.DirectionalLight(0xffffff,2);sun.position.set(-30,60,25);this.scene.add(sun);

    this.city=createCity(this.scene);
    this.player=new THREE.Group();
    const body=new THREE.Mesh(new THREE.CapsuleGeometry(.38,.75,4,8),new THREE.MeshStandardMaterial({color:0x16a6c9}));
    body.position.y=.95;this.player.add(body);this.playerBody=body;
    if(saved.characterColor)this.playerBody.material.color.setHex(saved.characterColor);
    const head=new THREE.Mesh(new THREE.SphereGeometry(.23,12,10),new THREE.MeshStandardMaterial({color:0xc9916b}));
    head.position.y=1.65;this.player.add(head);
    const saved=new SaveSystem().load()||{};
    this.player.position.set(saved.player?.x??0,0,saved.player?.z??5);
    this.scene.add(this.player);

    this.vehicle=new Vehicle(this.scene,new THREE.Vector3(4,0,2));
    this.inVehicle=false;
    this.npcs=new NPCSystem(this.scene,10);
    this.traffic=new TrafficSystem(this.scene,6);
    this.police=new PoliceAI(this.scene);
    this.wantedLevel=0;
    this.controls=new TouchControls();
    this.keys=new Set();
    this.save=new SaveSystem();
    this.money=Number.isFinite(saved.money)?saved.money:2500;
    this.supplies=Number.isFinite(saved.supplies)?saved.supplies:0;
    this.vehicleColor=saved.vehicleColor||0xd34c4c;
    if(saved.vehicleColor)this.vehicle.setPaint(saved.vehicleColor);
    this.ui=new UIController({
      money:this.money,
      onPlay:()=>this.enterGame(),
      onResume:()=>this.resume(),
      onMenu:()=>this.showMenu(),
      onPurchase:price=>this.purchase(price),
      onInteract:()=>this.handleInteract(),
      onMissionStart:id=>this.startMission(id)
    });
    this.ui.setMoney(this.money);
    this.minimap=new Minimap(document.querySelector('#minimap'));
    this.missions=new MissionSystem(mission=>this.ui.showMission(mission));
    this.missions.restore(saved.completedMissions||[]);
    this.missionMarker=new THREE.Group();
    const markerRing=new THREE.Mesh(new THREE.TorusGeometry(2,.16,10,36),new THREE.MeshBasicMaterial({color:0xffcf62,emissive:0x805000}));
    markerRing.rotation.x=Math.PI/2;markerRing.position.y=.18;this.missionMarker.add(markerRing);
    const beacon=new THREE.Mesh(new THREE.CylinderGeometry(.1,.42,5,12,1,true),new THREE.MeshBasicMaterial({color:0xffc85b,transparent:true,opacity:.28,side:THREE.DoubleSide}));
    beacon.position.y=2.8;this.missionMarker.add(beacon);this.missionMarker.visible=false;this.scene.add(this.missionMarker);

    this.active=false;this.started=false;this.verticalVelocity=0;this.jumpWasDown=false;
    this.onKeyDown=e=>{this.keys.add(e.key.toLowerCase());if(e.key==='Escape')this.ui.togglePause();};
    this.onKeyUp=e=>this.keys.delete(e.key.toLowerCase());
    this.onResize=()=>this.resize();
    addEventListener('keydown',this.onKeyDown);
    addEventListener('keyup',this.onKeyUp);
    addEventListener('resize',this.onResize);
    this.animate=this.animate.bind(this);
  }

  start(){this.renderer.setAnimationLoop(this.animate);document.querySelector('#loading').classList.add('hidden');}
  enterGame(){this.started=true;this.active=true;this.ui.hideScreens();this.ui.setStatus('Explorando');this.ui.notify('Bem-vindo à cidade!');}
  resume(){this.active=true;this.ui.hideScreens();}
  showMenu(){this.active=false;this.saveProgress();this.ui.showMenu();}

  getActorPosition(){return this.inVehicle?this.vehicle.group.position:this.player.position;}
  saveProgress(){
    this.save.save({
      money:this.money,
      player:{x:this.player.position.x,z:this.player.position.z},
      completedMissions:this.missions.getState().completed,
      supplies:this.supplies,
      characterColor:this.playerBody.material.color.getHex(),
      vehicleColor:this.vehicleColor
    });
  }
  purchase(item){
    const price=Number(item?.price)||0;
    if(!price||this.money<price){this.ui.notify('Dinheiro insuficiente.');return false;}
    this.money-=price;
    if(item.id==='outfit')this.playerBody.material.color.setHex(0x9464d8);
    if(item.id==='vehicle-paint'){this.vehicleColor=0x168dff;this.vehicle.setPaint(this.vehicleColor);}
    if(item.id==='supplies')this.supplies+=1;
    this.ui.setMoney(this.money);this.saveProgress();return true;
  }
  startMission(id){
    const template=MISSION_DATA[id];
    if(!template)return false;
    const started=this.missions.start({...template,target:{...template.target}});
    if(!started)return false;
    this.wantedLevel=id==='patrol-escape'?1:0;
    this.missionMarker.position.set(template.target.x,0,template.target.z);
    this.missionMarker.visible=true;
    this.ui.setStatus('Missão ativa');
    return true;
  }
  handleInteract(){
    if(this.inVehicle){this.exitVehicle();return;}
    const actor=this.getActorPosition();
    if(actor.distanceTo(this.vehicle.group.position)<4){this.enterVehicle();return;}
    if(actor.distanceTo(this.city.shopPosition)<4){this.ui.openPanel('store');return;}
    this.ui.notify('Chegue perto do carro ou da loja para interagir.');
  }
  enterVehicle(){
    this.inVehicle=true;this.vehicle.stop();this.player.visible=false;
    this.ui.setStatus('Dirigindo');this.ui.showInteract(true,'SAIR DO CARRO');this.ui.notify('Você entrou no carro.');
  }
  exitVehicle(){
    this.inVehicle=false;this.vehicle.stop();this.player.position.set(this.vehicle.group.position.x+2.5,0,this.vehicle.group.position.z);
    this.player.visible=true;this.ui.setStatus('Explorando');this.ui.showInteract(false);this.ui.notify('Você saiu do carro.');
  }

  isBlocked(x,z){
    if(Math.abs(x)>112||Math.abs(z)>112)return true;
    return this.city.colliders.some(box=>Math.abs(x-box.x)<box.halfX+.45&&Math.abs(z-box.z)<box.halfZ+.45);
  }
  updateOnFoot(input,dt){
    const forward=input.forward||this.keys.has('w')||this.keys.has('arrowup');
    const back=input.back||this.keys.has('s')||this.keys.has('arrowdown');
    const left=input.left||this.keys.has('a')||this.keys.has('arrowleft');
    const right=input.right||this.keys.has('d')||this.keys.has('arrowright');
    const direction=new THREE.Vector3(Number(right)-Number(left),0,Number(back)-Number(forward));
    if(input.jump&&!this.jumpWasDown&&this.player.position.y<=.001)this.verticalVelocity=6;
    this.jumpWasDown=input.jump;
    this.verticalVelocity-=16*dt;
    this.player.position.y=Math.max(0,this.player.position.y+this.verticalVelocity*dt);
    if(this.player.position.y===0)this.verticalVelocity=0;
    if(direction.lengthSq()){
      direction.normalize();
      const nx=this.player.position.x+direction.x*7*dt,nz=this.player.position.z+direction.z*7*dt;
      if(!this.isBlocked(nx,this.player.position.z))this.player.position.x=nx;
      if(!this.isBlocked(this.player.position.x,nz))this.player.position.z=nz;
      this.player.rotation.y=Math.atan2(direction.x,direction.z);
    }
    this.ui.setSpeed(direction.lengthSq()?7:0);
  }
  updateDriving(input,dt){
    const forward=input.forward||this.keys.has('w')||this.keys.has('arrowup');
    const back=input.back||this.keys.has('s')||this.keys.has('arrowdown');
    const left=input.left||this.keys.has('a')||this.keys.has('arrowleft');
    const right=input.right||this.keys.has('d')||this.keys.has('arrowright');
    this.vehicle.update(Number(forward)-Number(back),Number(right)-Number(left),dt);
    this.vehicle.group.position.x=THREE.MathUtils.clamp(this.vehicle.group.position.x,-112,112);
    this.vehicle.group.position.z=THREE.MathUtils.clamp(this.vehicle.group.position.z,-112,112);
    this.ui.setSpeed(Math.abs(this.vehicle.speed)*3.6);
  }
  updateCamera(dt){
    const actor=this.getActorPosition();
    if(this.inVehicle){
      const offset=new THREE.Vector3(0,6,13).applyAxisAngle(new THREE.Vector3(0,1,0),this.vehicle.group.rotation.y);
      this.camera.position.lerp(actor.clone().add(offset),1-Math.exp(-4*dt));
      this.camera.lookAt(actor.x,actor.y+1,actor.z);
    }else{
      this.camera.position.lerp(new THREE.Vector3(actor.x,7,actor.z+11),1-Math.exp(-5*dt));
      this.camera.lookAt(actor.x,.8,actor.z);
    }
  }
  updateInteractHint(){
    if(this.inVehicle){this.ui.showInteract(true,'SAIR DO CARRO');return;}
    const actor=this.getActorPosition();
    if(actor.distanceTo(this.vehicle.group.position)<4)this.ui.showInteract(true,'DIRIGIR');
    else if(actor.distanceTo(this.city.shopPosition)<4)this.ui.showInteract(true,'ENTRAR NA LOJA');
    else this.ui.showInteract(false);
  }
  updateMission(){
    const actor=this.getActorPosition();
    const active=this.missions.getState().current;
    if(active){
      this.missionMarker.rotation.y+=.012;
      this.missionMarker.position.y=.12+Math.sin(this.clock.elapsedTime*2.5)*.12;
      const done=this.missions.update(actor,4);
      if(done){
        this.money+=done.reward;this.ui.setMoney(this.money);
        this.wantedLevel=0;this.missionMarker.visible=false;
        this.ui.setStatus(this.inVehicle?'Dirigindo':'Explorando');
        this.saveProgress();
        this.ui.notify('Missão concluída! +$ '+done.reward.toLocaleString('pt-BR'),3200);
      }
    }else this.missionMarker.visible=false;
    this.minimap.render(actor,active?.target||null);
  }
  animate(){
    const dt=Math.min(this.clock.getDelta(),.05);
    if(this.active){
      const input=this.controls.read();
      if(this.inVehicle)this.updateDriving(input,dt);else this.updateOnFoot(input,dt);
      this.npcs.update(dt,this.clock.elapsedTime);
      this.traffic.update(dt);
      this.police.update(dt,this.getActorPosition(),this.wantedLevel);
      this.updateCamera(dt);
      this.updateInteractHint();
      this.updateMission();
    }
    this.renderer.render(this.scene,this.camera);
  }
  resize(){this.camera.aspect=innerWidth/innerHeight;this.camera.updateProjectionMatrix();this.renderer.setSize(innerWidth,innerHeight);}
  dispose(){
    this.saveProgress();
    this.renderer.setAnimationLoop(null);this.controls.dispose();this.ui.dispose();
    this.npcs.dispose();this.traffic.dispose();this.police.dispose();this.vehicle.dispose();
    removeEventListener('keydown',this.onKeyDown);removeEventListener('keyup',this.onKeyUp);removeEventListener('resize',this.onResize);
    this.renderer.dispose();
  }
}
