# Jogo da Oncinha - Demo Educativo

Este é um simulador educativo do famoso "Jogo da Oncinha", um caça-níquel que demonstra como funciona a matemática e as táticas psicológicas por trás dos jogos de azar.

## Índice

- [Visão Geral](#visão-geral)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Jogar](#como-jogar)
- [Regras do Jogo](#regras-do-jogo)
- [Configurações](#configurações)
- [Táticas Psicológicas](#táticas-psicológicas)
- [Responsividade](#responsividade)
- [Instalação](#instalação)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)

## Visão Geral

O Jogo da Oncinha é uma demonstração educativa que simula um caça-níquel com animais da fauna brasileira. O objetivo principal é mostrar como funcionam os mecanismos matemáticos e psicológicos utilizados em jogos de azar para manter os jogadores apostando.

## Estrutura do Projeto

O projeto está dividido em três arquivos principais:

- **index.html**: Contém a estrutura da página, incluindo a máquina caça-níquel, painéis de controle, estatísticas e modais.
- **style.css**: Contém todos os estilos do jogo, incluindo layout, animações e responsividade.
- **script.js**: Contém toda a lógica do jogo, incluindo configurações de probabilidade, animações e táticas psicológicas.

## Como Jogar

1. Abra o arquivo `index.html` em um navegador web
2. Você começa com um saldo de R$100,00
3. Escolha entre apostar R$5 ou R$10 clicando nos botões correspondentes
4. Os três slots irão girar e mostrar animais aleatórios
5. Se os três slots mostrarem o mesmo animal, você ganha!
6. O valor do prêmio depende do animal e do multiplicador configurado

## Regras do Jogo

- Cada animal tem uma probabilidade diferente de aparecer e um multiplicador diferente
- Quanto mais raro o animal, maior o multiplicador (prêmio)
- Você só ganha se os três slots mostrarem o mesmo animal
- O jogo mantém estatísticas de jogadas, vitórias, lucro do jogador e lucro da casa

### Animais e Multiplicadores (padrão)

| Animal | Emoji | Chance (%) | Multiplicador |
|--------|-------|------------|---------------|
| Zebra | 🦓 | 50 | 1.2x |
| Elefante | 🐘 | 10 | 1.5x |
| Arara | 🦜 | 6 | 3.0x |
| Castor | 🦫 | 4 | 5.0x |
| Onça | 🐆 | 2 | 9.0x |

## Configurações

O jogo possui um painel de configurações acessível pelo botão "Configurações", onde você pode:

- Ajustar as probabilidades de cada animal
- Modificar os multiplicadores de prêmios
- Definir uma margem de lucro garantida para o cassino
- Ativar ou desativar as táticas psicológicas
- Configurar parâmetros das táticas psicológicas

## Táticas Psicológicas

O jogo implementa várias táticas psicológicas reais usadas por cassinos e jogos de azar:

### 1. Fase de "Fisgar" o Jogador
Nas primeiras jogadas, o jogo aumenta artificialmente suas chances de ganhar para criar uma falsa sensação de que é fácil vencer.

### 2. Fase de "Perda Progressiva"
Após as jogadas iniciais, o jogo reduz suas chances de ganhar para recuperar o dinheiro pago e gerar lucro.

### 3. "Quase Vitórias"
O jogo frequentemente mostra resultados onde você "quase" ganhou (dois símbolos iguais) para criar a ilusão de que está perto de vencer.

### 4. Reforço Positivo
Sons, animações e mensagens de vitória são exagerados para criar uma resposta emocional positiva, enquanto as perdas são minimizadas.

## Responsividade

O jogo foi projetado para funcionar bem em dispositivos móveis e desktops:

- Layout adaptável para diferentes tamanhos de tela
- Botões otimizados para toque em dispositivos móveis
- Ajustes automáticos para orientação retrato/paisagem

## Instalação

Não é necessária instalação. Basta baixar os três arquivos (index.html, style.css e script.js) e abrir o arquivo index.html em qualquer navegador web moderno.

## Tecnologias Utilizadas

- HTML5
- CSS3 (com animações e media queries)
- JavaScript (ES6+)
- Bootstrap 5 (para componentes de UI)
- Emojis para representação visual dos animais

---

**Nota Educativa**: Este jogo foi criado com propósito puramente educativo para demonstrar como funcionam os mecanismos de jogos de azar. Não envolve dinheiro real e não incentiva a prática de jogos de azar.
