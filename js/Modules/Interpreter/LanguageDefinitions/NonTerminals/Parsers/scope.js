import NonTerminal from '../../../Model/NonTerminal.js';
import ret from '../../../Run/Instructions/ret.js';

new NonTerminal({
    name: 'scope',
    parse: (ctx) => {
        const { token } = ctx;
        token.pop('left-brackets');
        const lines = [];
        while (!token.popIfIs('right-brackets')) {
            lines.push(ctx.parse('local-line'));
        }
        return lines;
    },
    compile: (ctx, { content: lines }) => {
        ctx.stackScope();
        const result = lines.map((node) => {
            const line = ctx.compile(node);
            if (line?.instruction == null) {
                return null;
            }
            const { startsAt, endsAt } = node;
            return { line, startsAt, endsAt };
        });
        ctx.popScope();
        return {
            instruction: 'run',
            lines: result.filter((line) => line != null),
        };
    },
});
