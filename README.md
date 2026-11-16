# METRO CITY — Mobile Open World

Projeto original de mundo aberto para navegador/mobile, com Three.js + Vite. O repositório foi reiniciado para abandonar o antigo visual de blocos.

## Rodar
```bash
npm install
npm run dev
``
Build: `npm run build`

## Controles
- PC: WASD/setas, Espaço para pular, E para entrar/sair do veículo.
- Celular: joystick virtual, PULAR e AÇÃO.

## Estrutura
- `src/world.js`: cidade costeira, avenidas, prédios com fachadas, praça, árvores e orla.
- `src/character.js`: personagem 3D articulado com ciclo de caminhada e salto.
- `src/vehicle.js`: veículo dirigível com rodas animadas.
- `src/controls.js`: teclado e controles touch.
- `tools/blender/build_city.py`: fonte de cena Blender 4.x para gerar GLB.

## Blender
Instale Blender 4.x e execute:
`blender -b --python tools/blender/build_city.py`
O script exporta `assets/metro_city.glb`. A cena exportada é uma base de arte editável; ela ainda precisa de passes de detalhe, UVs, texturas e rigging profissional para alcançar qualidade AAA.

## Escopo honesto
Esta é a primeira fundação jogável reescrita, não um jogo AAA completo. Os personagens e veículos atuais são modelos procedurais de jogo; a cidade ainda é uma área inicial. Não inclui ainda interiores completos, missões narrativas, dublagem, tráfego complexo, multiplayer ou assets de estúdio.
