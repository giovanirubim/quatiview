# QuatiView

## Linguagem

A ideia inicial da linguagem oferecida pela ferramenta para que usuário possa escrever programas é um subconjunto da Linguagem C.
O objetivo dessa decisão foi criar uma compatbilidade entre códigos que são aceitos pela ferramenta e compiladores de C terceiros. Apesar disso esta compatibilidade não é garantida. Um dos motivos desta possível incompatibilidade é devido ao fato de este subconjunto não possuir o recurso de casting, ao mesmo tempo permitindo atribuição de um valor do tipo ponteiro void para uma variável cujo tipo é um ponteiro de outro tipo que não void. O que não é permitido em alguns compiladores de C.
A ausência de alguns recursos como casting se vê necessária no escopo do desenvolvimento deste projeto para limitar a complexidade de implementação do interpretador.

## Componentes

A ferramenta é dividida em cinco principais módulos:
1. Interpretador - Módulo responsável por fazer as análises léxica, sinática e semântica do código. O resultado destas análises é um objeto que permite e controla a execução do programa;
2. Simulador de memória dinâmica - Implementa os métodos de alocação e liberação de memória, leitura e escrita de _bytes_ de informação e produz as exceções de acesso indevido de memória;
3. Visualizador de memória - Responsável por gerar uma visualização gráfica para cada bloco de memória alocado para as estruturas pré-definidas;
4. Painel de controle - Faz a conexão entre os demais módulos e os botões de controle exibidos no painel de controle gráfico;
5. Terminal - Usado para exibir o resultado das análises realizadas sobre o código fonte e como interface textual de entrada e saída do programa.

### Interpretador

### Simulador de memória dinâmica

O módulo responsável por simular a memória dinâmica é representado por uma classe chamada _Memory_ e também especifica a classe _Chunk_ e a constante _UNINITIALIZED_BYTE_.

#### Classe _Chunk_

Esta classe descreve um nó de uma lista duplamente encadeada. Cada nó representa uma sequência de _bytes_ consecutivos, ou um _chunk_. Cada possível endereço da memória estará no intervalo de algum _chunk_ da lista. A lista também mantém os _chunks_ na ordem correspondente aos respectiveos endereços.
A classe _Chunk_ contém os seguintes atributos:
- _next_: Próximo nó na lista;
- _prev_: Nó anterior na lista;
- _allocated_: Atributo booleano que indica se este _chunk_ representa um bloco de alocação ou uma região livre de memória;
- _address_: Endereço do primeiro byte deste _chunk_;
- _size_: Quantidade de _bytes_ contida no _chunk_.
E os seguintes métodos:
- _allocate_: Este método recebe como parâmetro o endereço sendo alocado e a quantidade de _bytes_ que devem ser alocados. Se o endereço sendo alocado é o endereço do _chunk_ e a quantidade de _bytes_ sendo alocados é o tamanho do _chunk_ então a única mudança será a alteração do valor do campo _allocated_ para true. Caso o endereço seja maior que o endereço do _chunk_, sobrará um espaço alocado à esquerda. Neste caso será criado um novo _chunk_ à direita representando o bloco alocado, e no _chunk_ em questão restarão os _bytes_ livres à esquerda da alocação. Caso sobrem _bytes_ à direita, um novo nó a direita do _chunk_ que contém o bloco alocado será criado, este terá como tamanho os _bytes_ não alocados à direita.
- _free_: Este método altera o valor do campo _allocated_ para falso. Caso haja um nó seguinte na lista representando _bytes_ também não alocados, o tamanho deste nó seguinte será incrementado ao tamanho do nó atual, e o nó seguinte será removido da fila. Caso haja um nó anterior também reprensetnando _bytes_ não alocados, seu tamanho incrementará o tamanho do nó atual e o nó atual será removido da fila.
- _split_: Este método é apenas auxiliar para o processo de alocação, divide o nó atual em dois, criando um novo nó a direita na lista transferindo para este novo nó uma quantidade determinada de últimos _bytes_ do nó atual.
- merge: Este método é apenas auxiliar para o processo de liberação, une o nó atual e o nó seguinte da fila num único nó.

#### Classe _Memory_

Esta classe responsável por realizar alocações, fazer escrita e leitura de _bytes_ e liberar endereços alocados. A classe e possui os seguintes attributos:
- _firstAddress_: Um valor inteiro que determina o endereço do primeiro byte da memória;
- _lastAddress_: Um valor inteiro que determina o endereço do último byte da memória;
- _bytes_: Um objeto utilizado como dicionário de pares de chave e valor, onde a chave é o endereço de memória do byte e o valor é o conteúdo atual daquele byte. Cada byte pode conter um valor inteiro de 0 a 255 ou o valor definido pela constante UNINITIALIZED_BYTE. O valor desta constante é atribuído a todos os _bytes_ de um bloco de memória no instante de sua alocação, criando uma distinção de _bytes_ cujos valores foram escritos pelo programa e _bytes_ cujos valores ainda não foram inicializados;
- _chunks_: Uma lista dupla encadeada onde cada nó representa um conjunto de _bytes_ consecutivos, ou um _chunk_.

A classe _Memory_ também possui os seguintes métodos:
- _allocate_: Aloca uma determinada quantidade de _bytes_ e retorna o endereço do bloco alocado;
- _read_: Retorna o valor de um byte de determinado endereço;
- _write_: Atribui um valor a um byte em determinado endereço;
- _free_: Libera o bloco de memória alocado no endereço determinado.

### Visualizador de memória

### Painel de controle

### Terminal

O terminal é composto por dois elementos HTML principais: Um elemento _textarea_ e um elemento _input_ do tipo _text_. Elementos _textarea_ são caixas de texto que costumam ser utilizados como entrada de texto livre, porém aqui, utilizando a propriedade _disabled_ a edição do conteúdo de texto deste elemento fica desabilitada.
O elemento _input_ é utilizado
