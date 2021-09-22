import Run from '../';
import Net from '../../../Net.js';

export default async ({ byte }) => {
    const { value } = await Run(byte);
    Net.terminal.putchar(value);
};
