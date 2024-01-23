import pkg from "picocolors";
const { blue } = pkg;
const chars = [
    `
⠴⠀⠀
⠀⠀⠀
`,
    `
⠴⠋⠀
⠀⠀⠀
`,
    `
⠀⠛⠀
⠀⠀⠀
`,

    `
⠀⠘⠦
⠀⠀⠀
`,
    `
⠀⠀⠦
⠀⠀⠉
`,
    `
⠀⠀⠀
⠀⠀⠛
`,
    `
⠀⠀⠀
⠀⠴⠋
`,
    `
⠀⠀⠀
⠀⠶⠀
`,
    `
⠀⠀⠀
⠙⠦⠀
`,
    `
⠤⠀⠀
⠉⠀⠀
`,
];
export const log = (message: string, delay = 100) => {
    let x = 0;

    const interval = setInterval(function () {
        // process.stdout.write("\x1Bc" + blue(chars[x++]));
        // process.stdout.write(`\x1b[3;4H`);
        process.stdout.write(message);

        x = x % chars.length;
    }, delay);
    return () => clearInterval(interval);
};
