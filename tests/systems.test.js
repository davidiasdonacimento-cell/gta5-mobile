import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { MissionSystem } from '../src/systems/MissionSystem.js';
import { SaveSystem } from '../src/systems/SaveSystem.js';
import { Vehicle } from '../src/vehicles/Vehicle.js';
import { createCity } from '../src/world/createCity.js';
import { NPCSystem } from '../src/systems/NPCSystem.js';
import { TrafficSystem } from '../src/systems/TrafficSystem.js';
import { PoliceAI } from '../src/systems/PoliceAI.js';

test('missão inicia, conclui no destino e registra a conclusão',()=>{
  const events=[];const missions=new MissionSystem(value=>events.push(value));
  assert.equal(missions.start({id:'test',title:'Teste',target:{x:10,z:10},reward:100}),true);
  assert.equal(missions.start({id:'second',title:'Outra',target:{x:0,z:0}}),false);
  assert.equal(missions.update({x:0,z:0}),null);
  const done=missions.update({x:10,z:10});
  assert.equal(done.id,'test');
  assert.deepEqual(missions.getState().completed,['test']);
  assert.equal(missions.start({id:'test',title:'Repetida',target:{x:0,z:0}}),false);
});

test('salvamento local grava e recupera progresso',()=>{
  const previous=globalThis.localStorage;
  const data=new Map();
  globalThis.localStorage={setItem:(k,v)=>data.set(k,String(v)),getItem:k=>data.get(k)??null,removeItem:k=>data.delete(k)};
  try {
    const save=new SaveSystem();
    assert.equal(save.save({money:123,supplies:2}),true);
    assert.deepEqual(save.load(),{money:123,supplies:2});
    save.clear();assert.equal(save.load(),null);
  } finally {
    if(previous===undefined)delete globalThis.localStorage;else globalThis.localStorage=previous;
  }
});

test('veículo acelera, desloca e muda pintura',()=>{
  const scene=new THREE.Scene();const car=new Vehicle(scene,new THREE.Vector3(0,0,0));
  car.update(1,0,1);
  assert.ok(car.speed>0);assert.ok(car.group.position.z<0);
  car.setPaint(0x168dff);assert.equal(car.paint.color.getHex(),0x168dff);
  car.dispose();assert.equal(scene.children.length,0);
});

test('cidade cria cenário, loja e áreas de colisão',()=>{
  const scene=new THREE.Scene();const city=createCity(scene);
  assert.ok(scene.children.length>20);
  assert.ok(city.colliders.length>0);
  assert.ok(city.shopPosition instanceof THREE.Vector3);
});

test('sistemas de pedestres e tráfego atualizam entidades',()=>{
  const scene=new THREE.Scene();const people=new NPCSystem(scene,4);const traffic=new TrafficSystem(scene,3);
  assert.equal(people.people.length,4);assert.equal(traffic.cars.length,3);
  people.update(.016,2);traffic.update(.016);
  people.dispose();traffic.dispose();assert.equal(scene.children.length,0);
});

test('patrulha segue o jogador somente quando há nível de alerta',()=>{
  const scene=new THREE.Scene();const police=new PoliceAI(scene);
  const target=new THREE.Vector3(20,0,20);
  police.update(1,target,0);assert.equal(police.visible,false);
  const before=police.group.position.clone();
  police.update(1,target,1);assert.equal(police.visible,true);
  assert.ok(police.group.position.distanceTo(before)>0);
  police.dispose();assert.equal(scene.children.length,0);
});
