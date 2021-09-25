export default ({ structs }) => {
    for (let name in structs) {
        const struct = structs[name];
        const ptrType = `struct ${name}*`;
        const members = Object.values(struct.members);
        const types = members.map(({ type }) => type).join('; ');
        if (types === `int; ${ptrType}; ${ptrType}`) {
            struct.viewFlag = 'binary_search_tree';
        } else if (types === `int; ${ptrType}`) {
            struct.viewFlag = 'linked_list';
        }
    }
};
