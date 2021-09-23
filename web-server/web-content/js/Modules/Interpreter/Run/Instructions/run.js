import Run from '../';

export default async ({ ctx, lines }) => {
    for (let line of lines) {
        await Run(line);
        if (ctx.returned) {
            return;
        }
    }
};
