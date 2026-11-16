export class UIController {
  constructor({money=0,onPlay=()=>{},onResume=()=>{},onMenu=()=>{},onPurchase=()=>{},onInteract=()=>{},onMissionStart=()=>{}}={}) {
    this.money=money;this.onPlay=onPlay;this.onResume=onResume;this.onMenu=onMenu;this.onPurchase=onPurchase;this.onInteract=onInteract;this.onMissionStart=onMissionStart;
    this.toastTimer=null;this.handlers=[];
    this.bind('#play-button','click',()=>this.onPlay());
    this.bind('#pause-button','click',()=>this.togglePause());
    this.bind('#resume-button','click',()=>this.onResume());
    this.bind('#menu-button','click',()=>this.onMenu());
    this.bind('#close-panel','click',()=>this.closePanel());
    this.bind('#interact-button','click',()=>this.onInteract());
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
  showInteract(show,label='INTERAGIR'){const el=document.querySelector('#interact-button');if(!el)return;el.classList.toggle('hidden',!show);el.textContent=label;}
  showMission(mission){
    const box=document.querySelector('#mission-banner'),title=document.querySelector('#mission-title');
    if(!box)return;
    if(!mission){box.classList.add('hidden');return;}
    title.textContent=mission.title;box.classList.remove('hidden');
  }
  addPanelItem(container,{title,description,action,disabled=false}) {
    const row=document.createElement('div');row.className='panel-item';
    const info=document.createElement('div'),strong=document.createElement('strong'),small=document.createElement('small');
    strong.textContent=title;small.textContent=description;info.append(strong,small);
    const button=document.createElement('button');button.className='buy-button';button.textContent=action.label;button.disabled=disabled;
    if(action.run)button.addEventListener('click',action.run);
    row.append(info,button);container.append(row);
  }
  openPanel(name){
    this.menuWasActive=document.querySelector('#menu-screen')?.classList.contains('active')||false;
    const title=document.querySelector('#panel-title'),content=document.querySelector('#panel-content');
    content.replaceChildren();
    title.textContent=({store:'LOJAS DA CIDADE',garage:'GARAGEM',missions:'MISSÕES',settings:'CONFIGURAÇÕES'})[name]||'CENTRAL DA CIDADE';
    if(name==='store'){
      [
        {title:'Loja de roupas',description:'Personalização visual do personagem',price:450},
        {title:'Oficina',description:'Pintura e melhorias visuais do carro',price:900},
        {title:'Mercado',description:'Suprimentos para explorar a cidade',price:150}
      ].forEach(item=>this.addPanelItem(content,{title:item.title,description:item.description,action:{label:'$ '+item.price.toLocaleString('pt-BR'),run:()=>{if(this.onPurchase(item.price)){this.notify(item.title+' comprado!');}}}}));
    } else if(name==='garage'){
      this.addPanelItem(content,{title:'Sedan esportivo',description:'Seu primeiro veículo. Encontre-o na avenida.',action:{label:'LOCALIZAR',run:()=>{this.closePanel();this.notify('O veículo está marcado perto da avenida.');}}});
      this.addPanelItem(content,{title:'Personalização',description:'Pintura, rodas e melhorias — próximas atualizações',action:{label:'EM BREVE'},disabled:true});
    } else if(name==='missions'){
      const missions=[
        {id:'city-tour',title:'Passeio pela cidade',description:'Dirija ou caminhe até o ponto de observação.',reward:500},
        {id:'shop-delivery',title:'Entrega na loja',description:'Encontre a loja iluminada no distrito.',reward:750},
        {id:'patrol-escape',title:'Rota da patrulha',description:'Chegue ao destino enquanto a patrulha acompanha você.',reward:1000}
      ];
      missions.forEach(m=>this.addPanelItem(content,{title:m.title,description:m.description+' • Recompensa: $ '+m.reward,action:{label:'INICIAR',run:()=>{if(this.onMissionStart(m.id)){this.closePanel();this.notify('Missão iniciada: '+m.title,2800);}else this.notify('Conclua a missão atual antes de iniciar outra.');}}}));
    } else if(name==='settings'){
      this.addPanelItem(content,{title:'Qualidade gráfica',description:'Resolução adaptada para celulares.',action:{label:'AUTOMÁTICA'},disabled:true});
      this.addPanelItem(content,{title:'Controles',description:'Use o direcional na tela ou WASD/teclas de seta.',action:{label:'TOQUE + TECLADO'},disabled:true});
      this.addPanelItem(content,{title:'Salvar progresso',description:'O dinheiro e a posição são salvos neste navegador.',action:{label:'AUTOMÁTICO'},disabled:true});
    }
    this.show('#panel-screen');
  }
  closePanel(){if(this.menuWasActive)this.showMenu();else this.hideScreens();}
  dispose(){this.handlers.forEach(remove=>remove());clearTimeout(this.toastTimer);}
}
