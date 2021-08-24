# QuatiView

## Linguagem

A ideia inicial da linguagem oferecida pela ferramenta para que usuário possa escrever programas é um subconjunto da Linguagem C.
O objetivo dessa decisão foi criar uma compatbilidade entre códigos que são aceitos pela ferramenta e compiladores de C terceiros. Apesar disso esta compatibilidade não é garantida. Um dos motivos desta possível incompatibilidade é devido ao fato de este subconjunto não possuir o recurso de casting, ao mesmo tempo permitindo atribuição de um valor do tipo ponteiro void para uma variável cujo tipo é um ponteiro de outro tipo que não void. O que não é permitido em alguns compiladores de C.
A ausência de alguns recursos como casting se vê necessária no escopo do desenvolvimento deste projeto para limitar a complexidade de implementação do interpretador.

## Componentes

A ferramenta é dividida em cinco principais módulos:
1. Interpretador - Módulo responsável por fazer as análises léxica, sinática e semântica do código. O resultado destas análises é um objeto que permite e controla a execução do programa;
2. Simulador de memória dinãmica - Implementa os métodos de alocação e liberação de memória, leitura e escrita de bytes de informação e produz as exceções de acesso indevido de memória;
3. Visualizador de memória;
4. Painel de controle;
5. Terminal.

### Interpretador

### Simulador de memória dinâmica

### Visualizador de memória

### Painel de controle

### Terminal
