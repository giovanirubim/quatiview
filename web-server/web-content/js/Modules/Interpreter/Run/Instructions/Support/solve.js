import Run from '../../index.js';

export default async (item) => {
    if (item.instruction != null) {
        item = await Run(item);
    }
    if (item.value == null) {
        item = await Run({
            instruction: 'load',
            src: item
        });
    }
    return item;
};
