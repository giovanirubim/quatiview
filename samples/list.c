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
	struct Node* next;
};

struct Node* newNode(int info) {
	struct Node* node;
	node = malloc(sizeof(struct Node));
	node->next = NULL;
	node->info = info;
	return node;
}

struct Node* stack(struct Node* node, int info) {
	struct Node* head;
	head = newNode(info);
	head->next = node;
	return head;
}

struct Node* append(struct Node* node, int info) {
	if (!node) { return newNode(info); }
	node->next = append(node->next, info);
	return node;
}

struct Node* clear(struct Node* node) {
	struct Node* tail;
	if (node) {
		tail = node->next;
		free(node);
		clear(tail);
	}
	return NULL;
}

struct Node* remove(struct Node* node, int info) {
	if (!node) { return NULL; }
	if (node->info == info) {
		struct Node* aux;
		aux = node->next;
		free(node);
		return aux;
	}
	node->next = remove(node->next, info);
	return node;
}

void print(struct Node* node) {
	print_str("[ ");
	while (node) {
		print_int(node->info);
		putchar(" ");
		node = node->next;
	}
	print_str("]\n");
}

int menu() {
	struct Node* list;
	list = NULL;
	char c;
	for (;;) {
		c = getchar();
		if (c == '-') { list = remove(list, read_int()); }
		if (c == '<') { list = stack(list, read_int()); }
		if (c == '>') { list = append(list, read_int()); }
		if (c == 'c') { list = clear(list); }
		if (c == 'p') { print(list); }
		if (c == '*') { break; }
	}
}

int main() {
	menu();
}
