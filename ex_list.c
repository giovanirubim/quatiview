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

struct Node* push_front(struct Node* node, int info) {
	struct Node* head;
	head = newNode(info);
	head->next = node;
	return head;
}

struct Node* push_back(struct Node* node, int info) {
	if (!node) {
		return newNode(info);
	}
	node->next = push_back(node->next, info);
	return node;
}

void print_list(struct Node* node) {
	putchar('[');
	putchar(' ');
	for (; node; node = node->next) {
		print_int(node->info);
		putchar(' ');
	}
	putchar(']');
	putchar('\n');
}

int main() {
	struct Node* list;
	list = NULL;
	list = push_back(list, 2);
	list = push_back(list, 3);
	list = push_front(list, 1);
	print_list(list);
	putchar('\n');
}
