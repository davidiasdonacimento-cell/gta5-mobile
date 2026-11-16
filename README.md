# GTA5 Mobile — projeto independente

Projeto experimental de mundo aberto 3D para navegador e dispositivos móveis, construído com JavaScript, Three.js e Vite.

> Projeto de fã e independente, sem vínculo com a Rockstar Games. Não inclui código, mapas, personagens, músicas ou recursos oficiais de GTA V. Todo conteúdo futuro deverá ser original ou devidamente licenciado.

## Estado atual
- Cena 3D com cidade procedural simples
- Personagem controlável
- Controles por toque e teclado
- Câmera em terceira pessoa
- Layout adaptável a celular

## Executar
Requer Node.js 20.19+ ou 22.12+.

```bash
npm install
npm run dev
```

Para validar a compilação:

```bash
npm run build
npm run preview
```

## Próximas etapas
1. Colisão e física do personagem
2. Veículos dirigíveis
3. Sistema de missões original
4. NPCs e tráfego
5. Salvamento local e configurações
6. Otimização gráfica para Android

## Estrutura
- `src/game`: ciclo principal e estado do jogo
- `src/input`: entrada por toque/teclado
- `src/world`: geração do cenário
- `src/ui`: interface do jogo (próxima etapa)
