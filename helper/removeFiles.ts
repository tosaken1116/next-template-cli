import { rmSync } from "fs";

export const removeFiles = (filePaths: string[]): void => {
    filePaths.forEach((filePath) => {
        rmSync(filePath, { recursive: true, force: true });
    });
};
