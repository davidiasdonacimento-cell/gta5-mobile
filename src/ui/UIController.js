export class UIController {
  constructor({money=0,onPlay=()=>{},onResume=()=>{},onMenu=()=>{},onPurchase=()=>{}}={}) {
    this.money=money;this.onPlay=onPlay;this.onResume=onResume;this.onMenu=onMenu;this.onPurchase=onPurchase;
    this.toastTimer=null;this.handlers=[];
    this.bind('#play-button','click',()=>this.onPlay());
    this.bind('#pause-button','click',()=>this.togglePause());
    this.bind('#resume-button','click',()=>this.onResume());
    this.bind('#menu-button','click',()=>this.onMenu());
    this.bind('#close-panel','click',()=>this.closePanel());
    this.bind('#interact-button','click',()=>this.openPanel('store'));
    document.querySelectorAll('[data-panel]').forEach(button=>this.bindElement(button,'click',()=>this.openPanel(button.dataset.panel)));
  }
  bind(selector,event,callback){const el=document.querySelector(selector);if(el)this.bindElement(el,event,callback);}
  bindElement(el,event,callback){el.addEventListener(event,callback);this.handlers.push(()=>el.removeEventListener(event,callback));}
  show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));document.querySelector(id)?.classList.add('active');}
  hideScreens(){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));}
  showMenu(){this.show('#menu-screen');}
  togglePause(){const pause=document.querySelector('#pause-screen');if(pause.classList.contains('active'))this.onResume();else this.show('#pause-screen');}
  setStatus(value){const el=document.querySelector('#status');if(el)el.textContent=value;}
  setSpeed(value){const el=document.querySelector('#speed');if(el)el.textContent=Math.round(value)+' km/h';}
  setMoney(value){this.money=value;const el=document.querySelector('#money');if(el)el.textContent='$ '+Number(value).toLocaleString('pt-BR');}
  notify(message,duration=2200){const el=document.querySelector('#toast');if(!el)return;el.textContent=message;el.classList.add('show');clearTimeout(this.toastTimer);this.toastTimer=setTimeout(()=>el.classList.remove('show'),duration);}
  showInteract(show){document.querySelector('#interact-button')?.classList.toggle('hidden',!show);}
  openPanel(name){
    this.menuWasActive=document.querySelector('#menu-screen')?.classList.contains('active')||false;
    const title=document.querySelector('#panel-title'),content=document.querySelector('#panel-content');
    const panels={
      store:{title:'LOJAS DA CIDADE',items:[['Loja de roupas','Estilo e personalização do personagem',450],['Oficina','Visual e melhorias para veículos',900],['Mercado','Itens e suprimentos do mundo',150]]},
      garage:{title:'GARAGEM',items:[['Carro esportivo','Veículo de demonstração • em desenvolvimento',0],['Oficina pessoal','Personalização de veículos • em breve',0]]},
      missions:{title:'MISSÕES',items:[['Primeiros passos','Explore a cidade e conheça os pontos principais',0],['Entrega urbana','Missão de entrega • em breve',0],['Desafio de direção','Prova de direção • em breve',0]]},
      settings:{title:'CONFIGURAÇÕES',settings:true}
    };
    const panel=panels[name]||panels.store;title.textContent=panel.title;content.replaceChildren();
    if(panel.settings){
      const row=document.createElement('div');row.className='setting-row';row.innerHTML='<span>Qualidade gráfica</span><strong>Automática</strong>';content.append(row);
      const note=document.createElement('p');note.className='setting-note';note.textContent='O jogo limita a resolução para manter o desempenho em celulares.';content.append(note);
      const row2=document.createElement('div');row2.className='setting-row';row2.innerHTML='<span>Controles</span><strong>Toque + teclado</strong>';content.append(row2);
    } else {
      panel.items.forEach(([label,description,price])=>{
        const row=document.createElement('div');row.className='panel-item';
        const info=document.createElement('div');const strong=document.createElement('strong');strong.textContent=label;const small=document.createElement('small');small.textContent=description;info.append(strong,small);
        const button=document.createElement('button');button.className='buy-button';
        if(price>0){button.textContent='$ '+price.toLocaleString('pt-BR');button.addEventListener('click',()=>{if(this.onPurchase(price)){button.textContent='ADQUIRIDO';button.disabled=true;}});}
        else {button.textContent='EM BREVE';button.disabled=true;}
        row.append(info,button);content.append(row);
      });
    }
    this.show('#panel-screen');
  }
  closePanel(){if(this.menuWasActive)this.showMenu();else this.hideScreens();}
  dispose(){this.handlers.forEach(remove=>remove());clearTimeout(this.toastTimer);}
}
