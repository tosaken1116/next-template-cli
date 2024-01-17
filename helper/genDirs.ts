import { existsSync, mkdirSync, writeFileSync } from "fs";
import path from "path";

export const generateDirs = (dirPaths: string[]): void => {
    dirPaths.forEach((dirPath) => {
        mkdirSync(dirPath, { recursive: true });
    });
};

export const generateFiles = (
    filePaths: { path: string; content: string }[]
): void => {
    filePaths.forEach((file) => {
        if (!existsSync(file.path)) {
            const dir = path.dirname(file.path);
            mkdirSync(dir, { recursive: true });
        }
        writeFileSync(file.path, file.content);
    });
};
