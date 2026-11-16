# GTA5 Mobile — mundo aberto independente

Jogo experimental de mundo aberto 3D para navegador e dispositivos móveis, usando JavaScript, Three.js e Vite.

> Projeto independente de fãs, sem vínculo com a Rockstar Games. Não utiliza código, mapas, personagens, músicas ou arquivos proprietários de GTA V. Os recursos do projeto são originais ou devem ser licenciados.

## Recursos implementados
- Cena 3D com distrito urbano procedural, ruas, prédios e colisão básica a pé
- Personagem em terceira pessoa com controles por toque e teclado
- Carro dirigível com aceleração, frenagem, direção e animação de rodas
- Entrar e sair do veículo por botão contextual
- Tráfego urbano e pedestres com movimento
- Sistema de patrulha que acompanha o jogador durante uma missão específica
- Menu principal animado, pausa, garagem, lojas e configurações
- Loja com compras que descontam o dinheiro do jogador
- Missões com destino no mundo, marcador 3D e recompensa
- Salvamento local de dinheiro, posição e missões concluídas
- Minimapa com posição e objetivo atual
- GitHub Actions para verificar o build de produção

## Executar localmente
Requer Node.js 20.19+ ou 22.12+.

```bash
npm install
npm run dev
```

Para validar o pacote de produção:

```bash
npm run build
npm run preview
```

## Controles
- Celular: direcional na tela, pular e botão contextual para entrar/sair do carro ou abrir a loja
- Computador: WASD ou setas; Escape pausa o jogo
- No carro: direcional ou WASD para acelerar, ré e virar

## Estrutura principal
- `src/game`: ciclo de jogo e integração dos sistemas
- `src/world`: geração do distrito e colisões
- `src/vehicles`: veículo dirigível
- `src/systems`: missões, pedestres, tráfego, patrulha e salvamento
- `src/input`: controles de toque
- `src/ui`: menus, HUD e minimapa

## Limitações atuais
Este é um desenvolvimento em andamento. O mapa ainda é pequeno e procedural; modelos 3D, animações humanas completas, física avançada, interiores, áudio, missões encadeadas e testes em aparelhos Android reais ainda precisam de trabalho.
