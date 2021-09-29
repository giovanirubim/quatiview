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
	if (x < 0) {
		x = -x;
		putchar('-');
	}
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
    int height;
	struct Node* l;
	struct Node* r;
};

struct Node* newNode(int info) {
	struct Node* node;
	node = malloc(sizeof(struct Node));
	node->l = NULL;
	node->r = NULL;
    node->height = 0;
	node->info = info;
	return node;
}

void update(struct Node* node) {
	if (!node->l && !node->r) {
		node->height = 0;
		return;
	}
	if (!node->l) {
		node->height = node->r->height + 1;
		return;
	}
	if (!node->r) {
		node->height = node->l->height + 1;
		return;
	}
	if (node->l->height > node->r->height) {
		node->height = node->l->height + 1;
	} else {
		node->height = node->r->height + 1;
	}
}

int calcBalance(struct Node* node) {
	if (!node->l && !node->r) { return 0; }
	if (!node->l) {
		return - node->r->height - 1;
	}
	if (!node->r) {
		return node->l->height + 1;
	}
	return node->l->height - node->r->height;
}

struct Node* rotate_l(struct Node* node) {
	struct Node* root;
	root = node->r;
	node->r = root->l;
	root->l = node;
	update(node);
	update(root);
	return root;
}

struct Node* rotate_r(struct Node* node) {
	struct Node* root;
	root = node->l;
	node->l = root->r;
	root->r = node;
	update(node);
	update(root);
	return root;
}

struct Node* balance(struct Node* node) {
	if (!node) { return NULL; }
	int dif;
	dif = calcBalance(node);
	if (dif >= -1 && dif <= 1) { return node; }
	if (dif < 0) {
		if (calcBalance(node->r) > 0) {
			node->r = rotate_r(node->r);
		}
		node = rotate_l(node);
	} else {
		if (calcBalance(node->l) < 0) {
			node->l = rotate_l(node->l);
		}
		node = rotate_r(node);
	}
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
	update(node);
	return balance(node);
}

struct Node* remove(struct Node* node, int info) {
    return NULL;
}

int menu() {
	struct Node* tree;
	tree = NULL;
	for (;;) {
		tree = add(tree, read_int());
		putchar('\n');
	}
}

int main() {
	menu();
}
