import './style.css';
import { OpenWorldGame } from './game/OpenWorldGame.js';

const canvas = document.querySelector('#game-canvas');
const game = new OpenWorldGame(canvas);
game.start();

window.addEventListener('beforeunload', () => game.dispose());
