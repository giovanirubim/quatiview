import Run from '../';

export default async ({ lines }) => {
    for (let line of lines) {
        await Run(line);
    }
};
