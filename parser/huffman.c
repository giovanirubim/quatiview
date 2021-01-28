#include <time.h>
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#define WORD_SIZE          (1 <<  6)
#define INPUT_BUFFER_SIZE  (1 << 10)
#define OUTPUT_BUFFER_SIZE (1 << 10)
#define MAX_WORDS          (1 << 25)
#define MAX_NODES          (1 << 19)
#define HASH_TABLE_HEIGHT  (1 << 20)
#define MAX_TREE_LEVELS    (1 <<  5)
#define BIN_BUFFER_SIZE    (1 << 10)

int fileSize;

typedef unsigned int UI;
typedef long unsigned int LLUI;
typedef unsigned char byte;

/* Estrutura utilizada para armazenar as palavras lidas e suas frequências, esta estrutura é
 * utilizada tanto nas colisões da tabela hash, quanto na geração da árvore */
typedef struct Node {
	char word[WORD_SIZE]; /* Palavra */
	byte word_len; /* Comprimento da palavra */
	UI code; /* Código binário */
	byte code_len; /* Número de bits do código */
	UI count; /* Contador de frequência */
	byte isLeaf; /* Flag que indica que o nó é uma folha (palavra) */
	struct Node* left; /* Filho a esquerda */
	struct Node* right; /* Filho a direita */
	struct Node* next; /* Próximo nó encadeado na tabela hash ou próxima folha na leitura da
	árvore */
	struct Node* sibling; /* Nó à direita no mesmo nível da árvore */
} Node;

Node allNodes[MAX_NODES + 1] = {}; /* Memória pré alocada de nós */
Node* lastNode = allNodes - 1; /* Ponteiro do último nó utilizado */
#define endNodes (allNodes + MAX_NODES) /* Endereço do fim dos nós */
#define lastUsableNode (allNodes + MAX_NODES - 1) /* Último endereço utilizável para os nós */

Node* wordSequence[MAX_WORDS]; /* Sequência de palavras no arqivo original */
int wordSequenceLength = 0;

int nWords = 0; /* Número de palavras únicas */

int current_hash; /* Hash atual */
Node* hashTable[HASH_TABLE_HEIGHT] = {};
#define NEXTHASH(h, c)((h<<5)-h+c) /* Função hash */

byte* bufferIt; /* Iterador de buffers */

char inputBuffer[INPUT_BUFFER_SIZE]; /* Buffer de leitura */
#define inputBufferEnd (inputBuffer + INPUT_BUFFER_SIZE)

char last_char = 0; /* Último caractere lido */
char* word_begin; /* Endereço inicial da palavra */
char* word_end; /* Endereço final da palavra */

/* Mapa que indica se a transição de um caractere para outro representa o fim de uma palavra */
byte addWordMap[256][256];

/* Heap para a criação da árvore */
Node* minHeap[MAX_NODES];
int minHeapLength;

/* Lista de nós, utilizada para separar os níveis da tabela e para a fila de nós da leitura da
 * árvore */
typedef struct NodeList {
	Node* head;
	Node* foot;
} NodeList;

/* Níveis da árvore */
NodeList treeLevels[MAX_TREE_LEVELS] = {};
int nLevels = 0;

/* Buffer de bits */
byte binBuffer[BIN_BUFFER_SIZE + 8];
byte current_bin;
byte current_bin_len;

/* Adiciona um bit ao buffer de bits */
static inline void pushToBinBuffer(UI bin, byte len) {
	LLUI temp = current_bin | (((LLUI)bin) << current_bin_len);
	current_bin_len += len;
	while (current_bin_len >= 8) {
		*bufferIt++ = 0xff & temp;
		temp >>= 8;
		current_bin_len -= 8;
	}
	current_bin = (byte) temp;
}

/* Aloca um novo nó */
static inline Node* newNode() {
	if (lastNode == lastUsableNode) {
		puts("Error: allNodes overflow");
		exit(0);
	}
	return ++lastNode;
}

/* Adiciona um nó no heap */
static inline void minHeapPush(Node* node) {
	int pos = minHeapLength++;
	int count = node->count;
	int parent_pos;
	Node* parent;
	while (pos) {
		parent_pos = (pos - 1) >> 1;
		parent = minHeap[parent_pos];
		if (parent->count <= count) {
			break;
		}
		minHeap[pos] = parent;
		pos = parent_pos;
	}
	minHeap[pos] = node;
}

byte ptFlag; /* Usado para considerar ou não caracteres fora da ASCII como letras */

/* Converte um caractere para código do mapa temporário */
byte charToStateCode(char chr) {
	if (!chr) return 1;
	if (chr >= 'a' && chr <= 'z' || chr >= 'A' && chr <= 'Z' || chr & ptFlag) return 2;
	if (chr >= '0' && chr <= '9') return 3;
	if (chr == 10 || chr == 13 || chr == '\t' || chr == ' ') return 4;
	return 5;
}

/* Preenche o mapa indicando as transições de caracteres que resultam no fim de uma palavra */
void initAddWordMap(byte map[][256]) {
	byte tempMap[6][6] = {};
	int i, j;
	for (i=2; i<=5; ++i) {
		tempMap[i][1] = 1;
		for (j=2; j<=5; ++j) {
			if (i != j || i == 5 || i == 4) {
				tempMap[i][j] = 1;
			}
		}
	}
	for (i=0; i<256; ++i) {
		for (j=0; j<256; ++j) {
			byte last = charToStateCode(i);
			byte next = charToStateCode(j);
			map[i][j] = tempMap[last][next];
		}
	}
}

/* Retorna a diferença lexicográfica de 2 strings */
static inline int compareStr(char const *a, char const *b) {
	while (*a == *b && *a) ++a, ++b;
	return *a - *b;
}

/* Copia uma string */
static inline void copyStr(char *dst, char const *src) {
	char copied;
	do {
		copied = *dst++ = *src++;
	} while (copied);
}

/* Conta uma palavra na tabela hash */
static inline void countWord() {
	*word_end = 0;
	if (word_end - word_begin >= WORD_SIZE) {
		puts("Error: Word Overflow");
		exit(0);		
	}
	int index = ((unsigned int) current_hash) % HASH_TABLE_HEIGHT;
	Node* node = hashTable[index];
	while (node && compareStr(node->word, word_begin)) {
		node = node->next;
	}
	if (node) {
		/* Palavra encontrada */
		++ node->count;
	} else {
		/* Palavra nova */
		++ nWords;
		node = newNode();
		node->count = 1;
		node->next = hashTable[index];
		node->word_len = word_end - word_begin;
		hashTable[index] = node;
	}
	if (wordSequenceLength == MAX_WORDS) {
		puts("Error: countWord: wordSequence overflow");
		exit(0);
	}
	wordSequence[wordSequenceLength++] = node; /* Palavra é registrada na sequência original */
	current_hash = 0;
	word_begin = word_end = lastNode[1].word;
}

/* Iteração de um byte na leitura do arquivo original */
static inline void iterateInputByte(char chr) {
	if (addWordMap[last_char][chr]) {
		countWord();
	}
	current_hash = NEXTHASH(current_hash, chr);
	*word_end++ = last_char = chr;
}

/* Remove o menor elemento do heap */
static inline Node* removeMinHeapRoot() {
	int pos = 0;
	Node* root = minHeap[0];
	Node* node = minHeap[--minHeapLength];
	int count = node->count;
	for (;;) {
		int pos_a = (pos << 1) | 1;
		int pos_b = (pos + 1) << 1;
		int count_a = 0x7fffffff;
		int count_b = 0x7fffffff;
		if (pos_a < minHeapLength) {
			count_a = minHeap[pos_a]->count;
		}
		if (pos_b < minHeapLength) {
			count_b = minHeap[pos_b]->count;
		}
		int child_pos;
		int child_count;
		if (count_a <= count_b) {
			child_pos = pos_a;
			child_count = count_a;
		} else {
			child_pos = pos_b;
			child_count = count_b;
		}
		if (child_count >= count) {
			break;
		}
		minHeap[pos] = minHeap[child_pos];
		pos = child_pos;
	}
	minHeap[pos] = node;
	return root;
}

/* Preenche o heap com os nós */
static inline void fillMinHeap() {
	minHeapLength = 0;
	Node* node = allNodes;
	while (node <= lastNode) {
		minHeapPush(node++);
	}
}

/* Gera a árvore de huffman */
void generateHuffmanTree() {
	while (minHeapLength > 1) {
		Node* a = removeMinHeapRoot();
		Node* b = removeMinHeapRoot();
		Node* node = newNode();
		node->left  = a;
		node->right = b;
		node->count = a->count + b->count;
		minHeapPush(node);
	}
}

/* Define os códigos dos nós e encadeia cada nó em seu nível */
void prepareHuffmanTree(Node* node, int level, UI code, byte code_len) {
	if (level == nLevels) {
		++nLevels;
	}
	NodeList* list = treeLevels + level;
	Node* foot = list->foot;
	if (!foot) {
		list->head = node;
	} else {
		foot->sibling = node;
	}
	list->foot = node;
	node->code = code;
	node->code_len = code_len;
	Node* left = node->left;
	if (left) {
		node->isLeaf = 0;
		prepareHuffmanTree(left, level + 1, code, code_len + 1);
		prepareHuffmanTree(node->right, level + 1, code | (1 << code_len), code_len + 1);
	} else {
		node->isLeaf = 1;
	}
}

/* Reinicia o buffer de bits */
void resetBinBuffer() {
	bufferIt = binBuffer;
	current_bin = 0;
	current_bin_len = 0;
}

/* Grava a estrutura da árvore no arquivo */
void writeHuffmanTreeStructure(FILE* fout) {
	int i;
	resetBinBuffer();
	for (i=0; i<nLevels; ++i) {
		Node* node = treeLevels[i].head;
		while (node) {
			pushToBinBuffer(node->isLeaf, 1);
			int length = bufferIt - binBuffer;
			if (length >= BIN_BUFFER_SIZE) {
				fwrite(binBuffer, length, 1, fout);
				bufferIt = binBuffer;
			}
			node = node->sibling;
		}
	}
	if (current_bin_len) {
		*bufferIt++ = current_bin;
	}
	int length = bufferIt - binBuffer;
	if (length) {
		fwrite(binBuffer, length, 1, fout);
	}
}

/* Grava as palavras únicas no arquivo */
void writeUniqueWords(FILE* fout) {
	int i;
	for (i=0; i<nLevels; ++i) {
		Node* node = treeLevels[i].head;
		while (node) {
			if (node->isLeaf) {
				fwrite(node->word, node->word_len + 1, 1, fout);
			}
			node = node->sibling;
		}
	}
}

/* Fila de nós a serem lidos  */
byte current_byte;
byte current_shift;
NodeList nodeQueue = {};

/* Adiciona um nó à fila */
static inline void addNodeToQueue() {
	Node* node = newNode();
	Node* foot = nodeQueue.foot;
	if (!foot) {
		nodeQueue.head = node;
	} else {
		foot->next = node;
	}
	nodeQueue.foot = node;
}

/* Remove da fila e retorna o próxim nó */
static inline Node* popNodeFromQueue() {
	Node* node = nodeQueue.head;
	if (node) {
		nodeQueue.head = node->next;
		if (!nodeQueue.head) {
			nodeQueue.foot = NULL;
		}
	}
	return node;
}

/* Iteração de um bit da leitura da estrutura da árvore */
static inline void iterateBitReadingHuffmanTreeStructure() {
	Node* node = popNodeFromQueue();
	node->isLeaf = (current_byte >> current_shift) & 1;
	if (!node->isLeaf) {
		addNodeToQueue();
		node->left = lastNode;
		addNodeToQueue();
		node->right = lastNode;
	}
	++ current_shift;
}

/* Leitura da estrutura da árvore do arquivo comprimido */
void readHuffmanTreeStructure(FILE* fin) {
	lastNode = allNodes - 1;
	fseek(fin, 0L, SEEK_END);
	fileSize = ftell(fin);
	int bytesLeft = fileSize;
	int bufferSize;
	if (fileSize < BIN_BUFFER_SIZE) {
		bufferSize = fileSize;
	} else {
		bufferSize = BIN_BUFFER_SIZE;
	}
	byte* bufferEnd = binBuffer + bufferSize;
	fseek(fin, 0L, SEEK_SET);
	fread(binBuffer, bufferSize, 1, fin);
	bytesLeft -= bufferSize;
	current_shift = 0;
	addNodeToQueue();
	Node* node;
	bufferIt = binBuffer;
	current_byte = *bufferIt;
	while (nodeQueue.head) {
		iterateBitReadingHuffmanTreeStructure();
		if (current_shift == 8) {
			if (++bufferIt == bufferEnd) {
				bufferIt = binBuffer;
				if (bytesLeft) {
					if (bytesLeft < BIN_BUFFER_SIZE) {
						bufferSize = bytesLeft;
					} else {
						bufferSize = BIN_BUFFER_SIZE;
					}
					bytesLeft -= bufferSize;
					fread(binBuffer, BIN_BUFFER_SIZE, 1, fin);
				}
			}
			current_shift = 0;
			current_byte = *bufferIt;
		}
	}
	prepareHuffmanTree(allNodes, 0, 0, 0);
}

/* Lê as palavras únicas do arquivo comprimido para a árvore */
void readWords(FILE* fin) {
	int nNodes = lastNode - allNodes + 1;
	int startPos = (nNodes + 7)/8;
	fseek(fin, startPos, SEEK_SET);
	int bytesLeft = fileSize - startPos;
	int bufferSize;
	Node* node;
	for (node = allNodes; node <= lastNode; ++node) {
		if (!node->isLeaf) {
			continue;
		}
		char* str = node->word;
		while (*str++ = fgetc(fin));
		node->word_len = str - node->word - 1;
	}
}

/* Lê o arquivo a ser comprimido e gera a árvore */
void readFile(FILE* fin) {
	fseek(fin, 0L, SEEK_END);
	fileSize = ftell(fin);
	fseek(fin, 0L, SEEK_SET);
	int i;
	initAddWordMap(addWordMap);
	word_begin = word_end = lastNode[1].word;
	for (i=fileSize / INPUT_BUFFER_SIZE; i--;) {
		fread(inputBuffer, sizeof(inputBuffer), 1, fin);
		char* ptr = inputBuffer;
		while (ptr < inputBufferEnd) {
			iterateInputByte(*ptr++);
		}
	}
	i = fileSize % INPUT_BUFFER_SIZE;
	if (i) {
		fread(inputBuffer, i, 1, fin);
		char* ptr = inputBuffer;
		for (;i--;) {
			iterateInputByte(*ptr++);
		}
	}
	iterateInputByte(0);
	fillMinHeap();
	generateHuffmanTree();
	prepareHuffmanTree(minHeap[0], 0, 0, 0);
}

/* Gravar códigos no arquivo de saída */
void writeCompressedWords(FILE* fout) {
	int i;
	resetBinBuffer();
	Node** ptr = wordSequence;
	Node** end = wordSequence + wordSequenceLength;
	Node* node;
	fwrite(&wordSequenceLength, sizeof(int), 1, fout);
	for (;ptr < end; ++ptr) {
		node = *ptr;
		pushToBinBuffer(node->code, node->code_len);
		int length = bufferIt - binBuffer;
		if (length >= BIN_BUFFER_SIZE) {
			fwrite(binBuffer, length, 1, fout);
			bufferIt = binBuffer;
		}
	}
	if (current_bin_len) {
		*bufferIt++ = current_bin;
	}
	int length = bufferIt - binBuffer;
	if (length) {
		fwrite(binBuffer, length, 1, fout);
	}
}

int wordsLeft; /* Palavras restantes em código */
Node* compass; /* Ponteiro para o nó atual da árvore */

/* Iteração a cada bit de código da descompressão */
static inline void decompressWordBitIteration(FILE* fout) {
	if (compass->isLeaf) {
		fwrite(compass->word, compass->word_len, 1, fout);
		compass = allNodes;
		-- wordsLeft;
		return;
	}
	if ((current_byte >> current_shift) & 1) {
		compass = compass->right;
	} else {
		compass = compass->left;
	}
	++ current_shift;
}

/* Leitura dos códigos do arquivo comprimido e escrita no arquivo de saída */
void decompressWords(FILE* fin, FILE* fout) {
	fread(&wordsLeft, sizeof(int), 1, fin);
	compass = allNodes;
	int bytesLeft = fileSize - ftell(fin);
	int bufferSize;
	if (fileSize < BIN_BUFFER_SIZE) {
		bufferSize = fileSize;
	} else {
		bufferSize = BIN_BUFFER_SIZE;
	}
	byte* bufferEnd = binBuffer + bufferSize;
	fread(binBuffer, bufferSize, 1, fin);
	bytesLeft -= bufferSize;
	current_shift = 0;
	bufferIt = binBuffer;
	current_byte = *bufferIt;
	while (wordsLeft) {
		decompressWordBitIteration(fout);
		if (current_shift == 8) {
			if (++bufferIt == bufferEnd) {
				bufferIt = binBuffer;
				if (bytesLeft) {
					if (bytesLeft < BIN_BUFFER_SIZE) {
						bufferSize = bytesLeft;
					} else {
						bufferSize = BIN_BUFFER_SIZE;
					}
					bytesLeft -= bufferSize;
					fread(binBuffer, BIN_BUFFER_SIZE, 1, fin);
				}
			}
			current_shift = 0;
			current_byte = *bufferIt;
		}
	}
}

int sizeBefore = 0;
int sizeAfter = 0;

/* Comprime um arquivo */
void compress(FILE* fin, FILE* fout) {
	clock_t t1 = clock();
	readFile(fin);
	writeHuffmanTreeStructure(fout);
	writeUniqueWords(fout);
	writeCompressedWords(fout);
	clock_t t2 = clock();
	int sizeBefore = ftell(fin);
	int sizeAfter = ftell(fout);
	fclose(fin);
	fclose(fout);
	float t = (t2 - t1) / (float) CLOCKS_PER_SEC;
	printf("Tempo de execucao: %.4fs\n", t);
	printf("Espaco liberado: %.2f%%\n", 100 - sizeAfter * 100.0f / sizeBefore);
}

/* Descomprime um arquivo */
void decompress(FILE* fin, FILE* fout) {
	clock_t t1 = clock();
	readHuffmanTreeStructure(fin);
	readWords(fin);
	decompressWords(fin, fout);
	clock_t t2 = clock();
	fclose(fin);
	fclose(fout);
	float t = (t2 - t1) / (float) CLOCKS_PER_SEC;
	printf("Tempo de execucao: %.4fs\n", t);
}

/* Funções de interface */
void clearBufferStdin() {
	while (getchar()!='\n');
}
void pause() {
	puts("Pressione enter para prosseguir");
	clearBufferStdin();
}
void readStr(char s[], int max) {
	fgets(s, max, stdin);
	char* p = strchr(s, '\n');
	if (p) {
		*p = '\0';
	} else {
		clearBufferStdin();
	}
}
int lerOpcao(char const s[], int min, int max) {
	int op;
	for (;;) {
		puts(s);
		printf("> ");
		scanf("%d", &op);
		clearBufferStdin();
		if (op >= min && op <= max) {
			break;
		}
		puts("Codigo de operacao invalido");
		pause();
	}
}

int main(int argc, char const *argv[]) {
	int op = lerOpcao("Operacao [1 = Compressao, 2 = Descompressao]", 1, 2);
	if (op == 1) {
		if (lerOpcao("Considerar caracteres fora da tabela ASCII como letras? [1 = Sim, 2 = Nao])", 1, 2) == 1) {
			ptFlag = 0x80;
		} else {
			ptFlag = 0;
		}
	}
	FILE* fin;
	FILE* fout;
	char fname1[1024] = "";
	char fname2[1024] = "";
	for (;;) {
		printf("Arquivo de entrada: ");
		readStr(fname1, 1024);
		if (*fname1) {
			fin = fopen(fname1, "rb");
			if (!fin) {
				printf("Falha ao abrir %s\n", fname1);
				pause();
			} else {
				break;
			}
		}
	}
	for (;;) {
		printf("Arquivo de saida: ");
		readStr(fname2, 1024);
		if (*fname2) {
			fout = fopen(fname2, "wb");
			if (!fout) {
				printf("Falha ao abrir %s\n", fname2);
				pause();
			} else {
				break;
			}
		}
	}
	if (op == 1) {
		compress(fin, fout);
	} else {
		decompress(fin, fout);
	}
	if (argc > 1) {
		printf("%s, %s\n", fname2);
		if (sizeBefore) {
			printf("%d -> %d\n", sizeBefore, sizeAfter);
		}
	}
}
