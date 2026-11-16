import './style.css';
import { OpenWorldGame } from './game/OpenWorldGame.js';
const canvas=document.querySelector('#game-canvas');
let game;
try { game=new OpenWorldGame(canvas); game.start(); }
catch(error){ console.error(error); document.querySelector('#loading').innerHTML='<b>Não foi possível iniciar o 3D.</b><small>Verifique se o navegador suporta WebGL.</small>'; }
window.addEventListener('beforeunload',()=>game?.dispose());
