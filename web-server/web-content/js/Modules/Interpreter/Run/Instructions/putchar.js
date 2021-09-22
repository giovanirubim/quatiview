import Net from '../../../Net.js';
import Run from '../';

export default async ({ byte }) => {
    const { value } = await Run(byte);
    Net.terminal.putchar(value);
};
