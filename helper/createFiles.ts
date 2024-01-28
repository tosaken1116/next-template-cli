import { mkdir, writeFile } from "fs/promises";
import { WriteFiles } from "../types";
import path from "path";
import { existsSync } from "fs";

export const createFiles = async (files: WriteFiles) => {
    try {
        await Promise.all(
            files.map((file) => {
                return createFile(file);
            })
        );
    } catch (error) {
        throw error;
    }
};

const createFile = async ({ content, path: filePath }: WriteFiles[number]) => {
    try {
        if (!existsSync(filePath)) {
            const dir = path.dirname(filePath);
            await mkdir(dir, { recursive: true });
        }
        writeFile(filePath, content);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error("Error occurred while creating file:", error);
        }
        throw new Error("Error occurred while creating file");
    }
};
