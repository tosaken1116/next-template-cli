import { readFileSync } from "fs";
import { writeFile } from "fs/promises";
import { RewriteFiles } from "../types";

export const replaceStrings = async (rewriteFiles: RewriteFiles) => {
    try {
        Promise.all(
            rewriteFiles.map((file) => {
                return replaceString(file);
            })
        );
    } catch (error) {
        throw error;
    }
};

const replaceString = async (file: RewriteFiles[number]) => {
    try {
        let fileContent = readFileSync(file.path, "utf-8");

        for (const { target, replace } of file.replaceStrings) {
            fileContent = fileContent.replaceAll(target, replace);
        }

        writeFile(file.path, fileContent, "utf-8");
    } catch (error) {
        if (error instanceof Error) {
            throw new Error("Error occurred while replacing string:", error);
        }
        throw new Error("Error occurred while replacing string");
    }
};
