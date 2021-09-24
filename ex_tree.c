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

int main() {
	struct Node* tree;
	tree = NULL;
	tree = add(tree, 5);
	tree = add(tree, 2);
	tree = add(tree, 10);
	tree = add(tree, 9);
	tree = add(tree, 12);
	print_tree(tree);
	putchar('\n');
}
