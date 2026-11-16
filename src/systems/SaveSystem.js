const SAVE_KEY = 'gta5-mobile-save-v1';

export class SaveSystem {
  save(data) {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ version: 1, savedAt: Date.now(), data }));
      return true;
    } catch (error) {
      console.error('Não foi possível salvar o jogo:', error);
      return false;
    }
  }
  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed?.version === 1 ? parsed.data : null;
    } catch (error) {
      console.error('Save inválido:', error);
      return null;
    }
  }
  clear() { localStorage.removeItem(SAVE_KEY); }
}
