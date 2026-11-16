export class HUD {
  setStatus(message) {
    const el = document.querySelector('#status');
    if (el) el.textContent = message;
  }
  setSpeed(kmh) {
    const el = document.querySelector('#speed');
    if (el) el.textContent = `${Math.max(0, Math.round(kmh))} km/h`;
  }
  notify(message, duration = 2200) {
    const el = document.querySelector('#toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(this.timer);
    this.timer = setTimeout(() => el.classList.remove('show'), duration);
  }
}
