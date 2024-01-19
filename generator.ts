import path from "path";
import { fileURLToPath } from "url";
import { getTemplate } from "./helper/getTemplate";
import { copyFiles } from "./helper/copy";
import { installPackages } from "./helper/installPackages";
import { addScripts } from "./helper/addScripts";
import { dirNameFixer } from "./helper/dirNameFixer";
import { genTemplateDirs } from "./helper/genTemplateDirs";
import { removeNonUse } from "./helper/removeNonUse";

export type GenerateConfigType = {
    projectRoot: string;
    type: "js" | "ts";
    needStorybook: boolean;
    lintTool: "eslint" | "biome";
    testTool: "jest" | "vitest";
    genTool?: "hygen" | "scaffdog";
    size: "small" | "medium" | "large";
    packageManager: "npm" | "yarn" | "pnpm" | "bun";
    isAppRouter: boolean;
    isSrcDir: boolean;
};
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
export const generator = async ({
    projectRoot,
    type,
    needStorybook,
    genTool,
    lintTool,
    testTool,
    size,
    packageManager,
    isAppRouter,
    isSrcDir,
}: GenerateConfigType) => {
    try {
        if (needStorybook) {
            await copyFiles(
                getTemplate({ type, tool: "storybook" }),
                `${projectRoot}/.storybook`
            );
        }
        if (genTool) {
            await copyFiles(
                getTemplate({ type, tool: genTool, size }),
                `${projectRoot}/${
                    genTool == "hygen" ? "_templates" : ".scaffdog"
                }`
            );
        }
        await copyFiles(
            getTemplate({ tool: lintTool, size }),
            `${projectRoot}`
        );
        await copyFiles(
            getTemplate({ tool: testTool, type }),
            `${projectRoot}`
        );

        installPackages({
            type,
            testTool,
            lintTool,
            size,
            genTool,
            needStorybook,
            packageManager,
            projectRoot,
        });

        addScripts({
            testTool,
            lintTool,
            size,
            genTool,
            needStorybook,
            projectRoot,
        });
        if (!isAppRouter || !isSrcDir) {
            dirNameFixer({
                size,
                genTool,
                projectRoot,
                isAppRouter,
                isSrcDir,
            });
        }
        genTemplateDirs({
            size,
            projectRoot,
            isSrcDir,
        });
        removeNonUse({
            genTool,
            needStorybook,
            projectRoot,
        });
    } catch (err) {
        console.log(err);
    }
};
