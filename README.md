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

O módulo responsável por simular a memória dinâmica é representado por uma classe chamada _Memory_ e também especifica a classe _Chunk_ e a constante _UNINITIALIZED_BYTE_.

#### Classe _Memory_

Esta classe responsável por realizar alocações, fazer escrita e leitura de _bytes_ e liberar endereços alocados. A classe e possui os seguintes attributos:
- _firstAddress_: Um valor inteiro que determina o endereço do primeiro byte da memória;
- _lastAddress_: Um valor inteiro que determina o endereço do último byte da memória;
- _bytes_: Um objeto utilizado como dicionário de pares de chave e valor, onde a chave é o endereço de memória do byte e o valor é o conteúdo atual daquele byte. Cada byte pode conter um valor inteiro de 0 a 255 ou o valor definido pela constante UNINITIALIZED_BYTE. O valor desta constante é atribuído a todos os bytes de um bloco de memória no instante de sua alocação, criando uma distinção de bytes cujos valores foram escritos pelo programa e bytes cujos valores ainda não foram inicializados;
- _chunks_: Uma lista dupla encadeada onde cada nó representa um conjunto de bytes consecutivos, ou um _chunk_.

A classe _Memory_ também possui os seguintes métodos:
- _allocate_: Aloca uma determinada quantidade de bytes e retorna o endereço do bloco alocado;
- _read_: Retorna o valor de um byte de determinado endereço;
- _write_: Atribui um valor a um byte em determinado endereço;
- _free_: Libera o bloco de memória alocado no endereço determinado.

#### Classe _Chunk_

Cada _chunk_ possui os seguintes atributos:
  - _next_: Próximo nó na lista;
  - _prev_: Nó anterior na lista;
  - _allocated_: Atributo booleano que indica se este _chunk_ representa um bloco de alocação ou uma região livre de memória;
  - _address_: Endereço do primeiro byte deste _chunk_;
  - _size_: Quantidade de bytes contida no _chunk_.

#### Alocação de memória

A alocação de memória 

### Visualizador de memória

### Painel de controle

### Terminal

O é composto por dois elementos HTML principais: Um elemento _textarea_ e um elemento _input_ do tipo _text_. Elementos _textarea_ são caixas de texto que costumam ser utilizados como entrada de texto livre, porém aqui, utilizando a propriedade _disabled_ a edição do conteúdo de texto deste elemento fica desabilitada.
O elemento _input_ é utilizado
