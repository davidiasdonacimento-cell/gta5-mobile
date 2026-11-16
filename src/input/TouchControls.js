export class TouchControls {
  constructor() {
    this.state = { forward:false, back:false, left:false, right:false };
    this.handlers = [];
    document.querySelectorAll('[data-dir]').forEach(button => {
      const dir = button.dataset.dir;
      const start = e => { e.preventDefault(); this.state[dir] = true; };
      const stop = e => { e.preventDefault(); this.state[dir] = false; };
      button.addEventListener('pointerdown', start);
      button.addEventListener('pointerup', stop);
      button.addEventListener('pointercancel', stop);
      button.addEventListener('pointerleave', stop);
      this.handlers.push(() => {
        button.removeEventListener('pointerdown', start);
        button.removeEventListener('pointerup', stop);
        button.removeEventListener('pointercancel', stop);
        button.removeEventListener('pointerleave', stop);
      });
    });
  }
  read() { return { ...this.state }; }
  dispose() { this.handlers.forEach(remove => remove()); }
}
