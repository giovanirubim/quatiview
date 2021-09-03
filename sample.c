#include <stdlib.h>
#include <stdio.h>

void puts(char* s) {
	if (*s == '\0') {
		putchar('\n');
	} else {
		putchar(*s);
		puts(s + 1);
	}
}

struct Node {
	int info;
	struct Node* l;
	struct Node* r;
};

struct Node* newNode(int info) {
	struct Node* node;
	node = (struct Node*) malloc(sizeof(struct Node));
	(*node).l = NULL;
	(*node).r = NULL;
	(*node).info = info;
	return node;
}

struct Node* add(struct Node* node, int info) {
	if (node == NULL) {
		return newNode(info);
	}
	if ((*node).info == info) {
		return node;
	}
	if (info > (*node).info) {
		(*node).r = add((*node).r, info);
	} else {
		(*node).l = add((*node).l, info);
	}
	return node;
}

int contains(struct Node* node, int info) {
	if (node == NULL) {
		return 0;
	}
	if (info < (*node).info) {
		return contains((*node).l, info);
	}
	if (info > (*node).info) {
		return contains((*node).r, info);
	}
	return (*node).info == info;
}

void printTree(struct Node* node) {
	if (!node) {
		printf("-");
		return;
	}
	printf("(");
	printTree((*node).l);
	printf(",");
	printf("%d", (*node).info);
	printf(",");
	printTree((*node).r);
	printf(")");
}

int main() {
	struct Node* tree = NULL;
	tree = add(tree, 5);
	tree = add(tree, 2);
	tree = add(tree, 9);
	puts("Imprimindo arvore:");
	printTree(tree);
}