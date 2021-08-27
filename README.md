# QuatiView

## Linguagem

A ideia inicial da linguagem oferecida pela ferramenta para que usuário possa escrever programas é um subconjunto da Linguagem C.
O objetivo dessa decisão foi criar uma compatbilidade entre códigos que são aceitos pela ferramenta e compiladores de C terceiros. Apesar disso esta compatibilidade não é garantida. Um dos motivos desta possível incompatibilidade é devido ao fato de este subconjunto não possuir o recurso de casting, ao mesmo tempo permitindo atribuição de um valor do tipo ponteiro void para uma variável cujo tipo é um ponteiro de outro tipo que não void. O que não é permitido em alguns compiladores de C.
A ausência de alguns recursos como casting se vê necessária no escopo do desenvolvimento deste projeto para limitar a complexidade de implementação do interpretador.

## Componentes

A ferramenta é dividida em cinco principais módulos:
1. Interpretador - Módulo responsável por fazer as análises léxica, sinática e semântica do código. O resultado destas análises é um objeto que permite e controla a execução do programa;
2. Simulador de memória dinâmica - Implementa os métodos de alocação e liberação de memória, leitura e escrita de bytes de informação e produz as exceções de acesso indevido de memória;
3. Visualizador de memória - Responsável por gerar uma visualização gráfica para cada bloco de memória alocado para as estruturas pré-definidas;
4. Painel de controle - Faz a conexão entre os demais módulos e os botões de controle exibidos no painel de controle gráfico;
5. Terminal - Usado para exibir o resultado das análises realizadas sobre o código fonte e como interface textual de entrada e saída do programa.

### Interpretador

### Simulador de memória dinâmica

### Visualizador de memória

### Painel de controle

### Terminal

O é composto por dois elementos HTML principais: Um elemento _textarea_ e um elemento _input_ do tipo _text_. Elementos _textarea_ são caixas de texto que costumam ser utilizados como entrada de texto livre, porém aqui, utilizando a propriedade _disabled_ a edição do conteúdo de texto deste elemento fica desabilitada.
O elemento _input_ é utilizado
