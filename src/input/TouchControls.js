export class TouchControls {
  constructor() {
    this.state={forward:false,back:false,left:false,right:false,jump:false};
    this.handlers=[];
    document.querySelectorAll('[data-dir]').forEach(button=>{
      const dir=button.dataset.dir;
      const start=e=>{e.preventDefault();this.state[dir]=true;};
      const stop=e=>{e.preventDefault();this.state[dir]=false;};
      for(const event of ['pointerdown'])button.addEventListener(event,start);
      for(const event of ['pointerup','pointercancel','pointerleave'])button.addEventListener(event,stop);
      this.handlers.push(()=>{button.removeEventListener('pointerdown',start);for(const event of ['pointerup','pointercancel','pointerleave'])button.removeEventListener(event,stop);});
    });
    const jump=document.querySelector('#jump');
    if(jump){
      const start=e=>{e.preventDefault();this.state.jump=true;};
      const stop=e=>{e.preventDefault();this.state.jump=false;};
      jump.addEventListener('pointerdown',start);jump.addEventListener('pointerup',stop);jump.addEventListener('pointercancel',stop);jump.addEventListener('pointerleave',stop);
      this.handlers.push(()=>{jump.removeEventListener('pointerdown',start);jump.removeEventListener('pointerup',stop);jump.removeEventListener('pointercancel',stop);jump.removeEventListener('pointerleave',stop);});
    }
  }
  read(){return {...this.state};}
  dispose(){this.handlers.forEach(remove=>remove());}
}
