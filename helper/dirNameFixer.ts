import fs from "fs";
import { GenerateConfigType } from "../generator";
import path from "path";
export const dirNameFixer = ({
    type,
    projectRoot,
    genTool,
    size,
    isAppRouter,
    isSrcDir,
}: GenerateConfigType) => {
    if (!isSrcDir) {
        //  generateTool
        getAllFiles(
            path.resolve(
                projectRoot,
                genTool == "hygen" ? "_templates/generator" : ".scaffdog"
            )
        ).forEach((file) => {
            stringReplace(
                [
                    {
                        target: "src/",
                        replace: "",
                    },
                ],
                file
            );
        });
    }

    if (size == "large" && !isAppRouter) {
        stringReplace(
            [
                {
                    target: "app",
                    replace: "pages",
                },
                {
                    target: "page.tsx",
                    replace: "index.tsx",
                },
            ],
            path.resolve(
                projectRoot,
                genTool == "hygen"
                    ? "_templates/generator/page/page.ejs.t"
                    : ".scaffdog/page.md"
            )
        );
    }
};
export const stringReplace = (
    replaceStrings: { target: string; replace: string }[],
    targetFilePath: string
) => {
    try {
        let fileContent = fs.readFileSync(targetFilePath, "utf-8");

        for (const { target, replace } of replaceStrings) {
            fileContent = fileContent.replaceAll(target, replace);
        }

        fs.writeFileSync(targetFilePath, fileContent, "utf-8");
    } catch (error) {
        console.error("Error occurred while replacing string:", error);
    }
};

const getAllFiles = (dirPath: string): string[] => {
    let files: string[] = [];

    const getFilesRecursively = (dir: string) => {
        const fileNames = fs.readdirSync(dir);

        for (const fileName of fileNames) {
            const filePath = path.join(dir, fileName);
            const stat = fs.statSync(filePath);

            if (stat.isFile()) {
                files.push(filePath);
            } else if (stat.isDirectory()) {
                getFilesRecursively(filePath);
            }
        }
    };

    getFilesRecursively(dirPath);

    return files;
};
