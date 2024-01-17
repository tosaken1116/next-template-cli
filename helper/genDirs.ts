import fs from "fs";

export const generateDirs = (dirPaths: string[]): void => {
    dirPaths.forEach((dirPath) => {
        fs.mkdirSync(dirPath, { recursive: true });
    });
};

export const generateFiles = (
    filePaths: { path: string; content: string }[]
): void => {
    filePaths.forEach((file) => {
        fs.writeFileSync(file.path, file.content);
    });
};
