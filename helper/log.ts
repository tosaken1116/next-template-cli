import pkg from "picocolors";
const { blue, green } = pkg;
const chars = ["⠴", "⠦", "⠇", "⠋", "⠙", "⠸"];

export const log = async (
    command: () => Promise<any>,
    message: string,
    delay = 100
) => {
    let x = 0;

    const interval = setInterval(function () {
        process.stdout.write("\r" + blue(chars[x++]) + " " + message);
        x = x % chars.length;
    }, delay);

    await command();
    clearInterval(interval);
    process.stdout.write("\r" + green("✔") + " " + message + "\n");
};
