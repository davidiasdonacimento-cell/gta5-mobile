export class MissionSystem {
  constructor(onChange = () => {}) {
    this.onChange = onChange;
    this.current = null;
    this.completed = new Set();
  }
  start(mission) {
    if (!mission?.id || !mission.title) throw new Error('Missão precisa de id e título.');
    if (this.completed.has(mission.id)) return false;
    this.current = { ...mission, state: 'active' };
    this.onChange(this.current);
    return true;
  }
  complete() {
    if (!this.current) return false;
    this.completed.add(this.current.id);
    this.current = { ...this.current, state: 'completed' };
    this.onChange(this.current);
    this.current = null;
    return true;
  }
  getState() { return { current: this.current, completed: [...this.completed] }; }
}
