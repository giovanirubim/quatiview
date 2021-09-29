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

struct Node* remove(struct Node* node, int info) {
    return NULL;
}

int menu() {
	struct Node* tree;
	tree = NULL;
	char c;
	for (;;) {
        tree = add(tree, read_int());
	}
}

int main() {
	menu();
}
