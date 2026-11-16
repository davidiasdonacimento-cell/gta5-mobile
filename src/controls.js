export class Controls {
  constructor(canvas) {
    this.keys = {};
    this.touch = { x: 0, z: 0 };
    this.jump = false;
    addEventListener('keydown', e => { this.keys[e.code] = true; });
    addEventListener('keyup', e => { this.keys[e.code] = false; });
    const pad = document.querySelector('#pad');
    const stick = document.querySelector('#stick');
    let activePointer = null;
    const move = e => {
      if (activePointer !== e.pointerId) return;
      const r = pad.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const distance = Math.min(43, Math.hypot(dx, dy));
      const angle = Math.atan2(dy, dx);
      this.touch.x = Math.cos(angle) * distance / 43;
      this.touch.z = Math.sin(angle) * distance / 43;
      stick.style.transform = `translate(${this.touch.x * 38}px, ${this.touch.z * 38}px)`;
    };
    const end = e => {
      if (activePointer !== e.pointerId) return;
      activePointer = null;
      this.touch = { x: 0, z: 0 };
      stick.style.transform = 'translate(0, 0)';
      pad.classList.remove('active');
    };
    pad.addEventListener('pointerdown', e => {
      e.preventDefault();
      if (activePointer !== null) return;
      activePointer = e.pointerId;
      pad.setPointerCapture(e.pointerId);
      pad.classList.add('active');
      move(e);
    });
    pad.addEventListener('pointermove', e => { e.preventDefault(); move(e); });
    pad.addEventListener('pointerup', end);
    pad.addEventListener('pointercancel', end);
    pad.addEventListener('lostpointercapture', end);
    pad.addEventListener('contextmenu', e => e.preventDefault());
  }
  read() {
    const x = (this.keys.ArrowRight || this.keys.KeyD ? 1 : 0) -
      (this.keys.ArrowLeft || this.keys.KeyA ? 1 : 0) + this.touch.x;
    const z = (this.keys.ArrowDown || this.keys.KeyS ? 1 : 0) -
      (this.keys.ArrowUp || this.keys.KeyW ? 1 : 0) + this.touch.z;
    const jump = this.jump || this.keys.Space;
    this.jump = false;
    return { x: Math.max(-1, Math.min(1, x)), z: Math.max(-1, Math.min(1, z)), jump };
  }
}