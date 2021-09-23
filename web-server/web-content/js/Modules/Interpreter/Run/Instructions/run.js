import Net from '../../../Net.js';
import Run from '../';

export default async ({ ctx, lines }) => {
    for (let { line, startsAt, endsAt } of lines) {
        Net.editor.highlight(startsAt, endsAt);
        await Net.eventManager.waitStep();
        await Run(line);
        if (ctx.returned) {
            return;
        }
    }
};
