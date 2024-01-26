import { existsSync, mkdirSync, writeFileSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export const generateDirs = (dirPaths: string[]): void => {
    dirPaths.forEach((dirPath) => {
        mkdir(dirPath, { recursive: true });
    });
};

export const generateFiles = async (
    filePaths: { path: string; content: string }[]
): Promise<void> => {
    filePaths.forEach((file) => {
        if (!existsSync(file.path)) {
            const dir = path.dirname(file.path);
            mkdirSync(dir, { recursive: true });
        }
        writeFile(file.path, file.content);
    });
};
