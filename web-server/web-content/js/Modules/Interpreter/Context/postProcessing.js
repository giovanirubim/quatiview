export default ({ structs }) => {
    for (let name in structs) {
        const struct = structs[name];
        const selfPtr = `struct ${name}*`;
        const members = Object.values(struct.members);
        const types = members.map(({ type }) => type).join('; ');
        if (types === `int; ${selfPtr}; ${selfPtr}`) {
            struct.viewFlag = 'binary_search_tree';
        } else if (types === `int; ${selfPtr}`) {
            struct.viewFlag = 'linked_list';
        } else if (types === `int; int; ${selfPtr}; ${selfPtr}`) {
            struct.viewFlag = 'avl';
		}
    }
};
