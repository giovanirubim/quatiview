import Run from '../index.js';

export default async ({ src, dst }) => {
    if (src.instruction != null) {
        src = await Run(src);
    }
    if (dst.instruction != null) {
        dst = await Run(dst);
    }
    if (src.value == null) {
        src = await Run({ instruction: 'load', src });
    }
    return await Run({ instruction: 'store', src, dst });
};
