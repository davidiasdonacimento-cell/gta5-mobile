export class Minimap {
  constructor(canvas) {
    this.canvas=canvas;this.ctx=canvas?.getContext('2d');
  }
  render(player,target=null) {
    if(!this.ctx||!this.canvas)return;
    const c=this.ctx,w=this.canvas.width,h=this.canvas.height;
    c.clearRect(0,0,w,h);c.fillStyle='rgba(4,12,22,.86)';c.fillRect(0,0,w,h);
    c.strokeStyle='rgba(111,211,245,.32)';c.lineWidth=10;
    c.beginPath();c.moveTo(w/2,0);c.lineTo(w/2,h);c.moveTo(0,h/2);c.lineTo(w,h/2);c.stroke();
    c.strokeStyle='rgba(255,255,255,.12)';c.lineWidth=1;
    for(let i=0;i<5;i++){c.beginPath();c.moveTo(i*w/4,0);c.lineTo(i*w/4,h);c.stroke();c.beginPath();c.moveTo(0,i*h/4);c.lineTo(w,i*h/4);c.stroke();}
    const scale=.5,px=w/2+player.x*scale,pz=h/2+player.z*scale;
    if(target){c.fillStyle='#ffcf62';c.beginPath();c.arc(w/2+target.x*scale,h/2+target.z*scale,5,0,Math.PI*2);c.fill();}
    c.fillStyle='#64e7ff';c.beginPath();c.arc(px,pz,5,0,Math.PI*2);c.fill();
    c.strokeStyle='#fff';c.lineWidth=2;c.stroke();
  }
}
