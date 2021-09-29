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

int main() {
	int x;
	struct Node* tree;
	tree = NULL;
	tree = add(tree, 4);
	tree = add(tree, 2);
	tree = add(tree, 6);
	tree = add(tree, 5);
	tree = add(tree, 3);
	tree = add(tree, 1);
}
