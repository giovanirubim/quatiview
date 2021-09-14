#include <stdlib.h>
#include <stdio.h>

void printStrLn(char* s) {
	if (*s == '\0') {
		putchar('\n');
	} else {
		putchar(*s);
		printStrLn(s + 1);
	}
}

void printInt(int x) {
	if (x >= 10) {
		printInt(x/10);
	}
	putchar(x%10 + '0');
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
		putchar('-');
		return;
	}
	putchar('(');
	printTree((*node).l);
	putchar(',');
	printInt((*node).info);
	putchar(',');
	printTree((*node).r);
	putchar(')');
}

void printTreeLn(struct Node* node) {
	printTree(node);
	putchar('\n');
}

int main() {
	struct Node* tree = NULL;
	tree = add(tree, 5);
	tree = add(tree, 2);
	tree = add(tree, 10);
	tree = add(tree, 9);
	tree = add(tree, 12);
	printStrLn("Imprimindo arvore:");
	printTreeLn(tree);
}
