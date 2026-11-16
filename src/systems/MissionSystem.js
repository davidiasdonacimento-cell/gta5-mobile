export class MissionSystem {
  constructor(onChange=()=>{}) { this.onChange=onChange;this.current=null;this.completed=new Set(); }
  start(mission) {
    if(!mission?.id||!mission.title)throw new Error('Missão precisa de id e título.');
    if(this.current||this.completed.has(mission.id))return false;
    this.current={...mission,state:'active'};
    this.onChange(this.current);
    return true;
  }
  update(position,radius=3) {
    if(!this.current||!position)return null;
    const dx=position.x-this.current.target.x,dz=position.z-this.current.target.z;
    if(Math.hypot(dx,dz)>radius)return null;
    return this.complete();
  }
  complete() {
    if(!this.current)return null;
    const done={...this.current,state:'completed'};
    this.completed.add(done.id);this.current=null;this.onChange(null);
    return done;
  }
  restore(ids=[]) { this.completed=new Set(Array.isArray(ids)?ids:[]); }
  getState() { return {current:this.current,completed:[...this.completed]}; }
}
