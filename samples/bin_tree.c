int read_int() {
	int c, x;
	x = 0;
	while((c = getchar()) != '\n' && c != ' ') {
		x = x*10;
		x = x + c - '0';
	}
	return x;
}

void print_int(int x) {
	if (x >= 10) {
		print_int(x/10);
	}
	putchar(x%10 + '0');
}

void print_str(char* str) {
	while (*str) {
		putchar(*str);
		str = str + 1;
	}
}

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
	if (!node) {
		return newNode(info);
	}
	if (info < node->info) {
		node->l = add(node->l, info);
	} else {
		node->r = add(node->r, info);
	}
	return node;
}

struct Node* clear(struct Node* node) {
	if (node) {
		clear(node->l);
		clear(node->r);
		free(node);
	}
	return NULL;
}

struct Node* remove_min(struct Node* node, struct Node* dst) {
	if (!node->l) {
		dst->info = node->info;
		free(node);
		return NULL;
	}
	node->l = remove_min(node->l, dst);
	return node;
}

struct Node* remove(struct Node* node, int info) {
	struct Node* aux;
	if (!node) { return NULL; }
	if (info < node->info) {
		node->l = remove(node->l, info);
		return node;
	}
	if (info > node->info) {
		node->r = remove(node->r, info);
		return node;
	}
	if (!node->l) {
		aux = node->r;
		free(node);
		return aux;
	}
	if (!node->r) {
		aux = node->l;
		free(node);
		return aux;
	}
	if (!node->r->l) {
		aux = node->r;
		aux->l = node->l;
		free(node);
		return aux;
	}
	remove_min(node->r, node);
	return node;
}

void print_rec(struct Node* node) {
	if (!node) {
		putchar('-');
	} else {
		putchar('(');
		print_rec(node->l);
		putchar(',');
		print_int(node->info);
		putchar(',');
		print_rec(node->r);
		putchar(')');
	}
}

void print_tree(struct Node* node) {
	print_str("Tree: ");
	print_rec(node);
	putchar('\n');
}

int menu(struct Node* tree) {
	char c;
	for (;;) {
		c = getchar();
		if (c == '+') { tree = add(tree, read_int()); }
		if (c == '-') { tree = remove(tree, read_int()); }
		if (c == 'c') { tree = clear(tree); }
		if (c == 'p') { print_tree(tree); }
		if (c == '*') { break; }
	}
}

int main() {
	struct Node* tree;
	tree = NULL;
	tree = add(tree, 4);
	tree = add(tree, 2);
	tree = add(tree, 6);
	menu(tree);
}
