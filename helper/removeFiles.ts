import { rmSync } from "fs";
import { rm } from "fs/promises";

export const removeFiles = async (filePaths: string[]): Promise<void> => {
    Promise.all(
        filePaths.map((filePath) => {
            return rm(filePath, { recursive: true, force: true });
        })
    );
};
