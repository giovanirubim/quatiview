void print_int(int x) {
	if (x >= 10) {
		print_int(x/10);
	}
	putchar(x%10 + '0');
}

struct Node {
	int info;
	struct Node* next;
};

struct Node* newNode(int info) {
	struct Node* node;
	node = malloc(sizeof(struct Node));
	node->next = NULL;
	node->info = info;
	return node;
}

struct Node* add(struct Node* node, int info) {
	if (node == NULL) {
		return newNode(info);
	}
	node->next = add(node->next, info);
	return node;
}

void print_list(struct Node* node) {
	if (node == NULL) {
		putchar('-');
		return;
	}
	putchar('(');
	print_int(node->info);
	putchar(',');
	print_list(node->next);
	putchar(')');
}

int main() {
	struct Node* list;
	list = NULL;
	list = add(list, 5);
	list = add(list, 2);
	list = add(list, 10);
	print_list(list);
	putchar('\n');
}
