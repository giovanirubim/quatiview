struct Node {
	int info;
	struct Node* l;
	struct Node* r;
};

struct Node* newNode(int info) {
	struct Node* node;
	node = malloc(sizeof(struct Node));
	node->l = NULL;
	node->r = NULL;
	node->info = info;
	return node;
}

struct Node* add(struct Node* node, int info) {
	if (node == NULL) {
		return newNode(info);
	}
	if (node->info == info) {
		return node;
	}
	if (info > node->info) {
		node->r = add(node->r, info);
	} else {
		node->l = add(node->l, info);
	}
	return node;
}

struct Node* clear(struct Node* node) {
	if (!node) { return NULL; }
	clear(node->l);
	clear(node->r);
	free(node);
	return NULL;
}

void print_int(int x) {
	if (x >= 10) {
		print_int(x/10);
	}
	putchar(x%10 + '0');
}

void print_tree(struct Node* node) {
	if (node == NULL) {
		putchar('-');
		return;
	}
	putchar('(');
	print_tree(node->l);
	
	putchar(',');
	print_int(node->info);
	putchar(',');
	print_tree(node->r);
	putchar(')');
}

struct Node* remove_min(struct Node* node, int* info) {
	struct Node* aux;
	if (!node->l) {
		aux = node->r;
		*info = node->info;
		free(node);
		return aux;
	}
	node->l = remove_min(node->l, info);
	return node;
}

struct Node* remove(struct Node* node, int info) {
	if (!node) { return NULL; }
	if (info > node->r) {
		node->r = remove(node->r, info);
		return node;
	}
	if (info < node->l) {
		node->l = remove(node->l, info);
		return node;
	}
	if (!node->l && !node->r) {
		free(node);
		return NULL;
	}
}

int read_int() {
	int val;
	val = 0;
	char c;
	while ((c = getchar()) != '\n') {
		val = val*10;
		val = val + (c - '0');
	}
	return val;
}

int main() {
	int x;
	struct Node* tree;
	tree = NULL;
	tree = add(tree, 4);
	tree = add(tree, 2);
	tree = add(tree, 3);
	tree = add(tree, 6);
	tree = add(tree, 5);
	tree = add(tree, 7);
}
