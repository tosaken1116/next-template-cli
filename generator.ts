import path from "path";
import { fileURLToPath } from "url";
import { getTemplate } from "./helper/getTemplate";
import { copyFiles } from "./helper/copy";
import { installPackages } from "./helper/installPackages";
import { addScripts } from "./helper/addScripts";

export type GenerateConfigType = {
    projectRoot: string;
    type: "js" | "ts";
    needStorybook: boolean;
    lintTool: "eslint" | "biome";
    testTool: "jest" | "vitest";
    genTool: "hygen" | "scaffdog";
    size: "small" | "medium" | "large";
    packageManager: "npm" | "yarn" | "pnpm" | "bun";
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
}: GenerateConfigType) => {
    try {
        if (needStorybook) {
            await copyFiles(
                getTemplate({ type, tool: "storybook" }),
                `${projectRoot}/.storybook`
            );
        }
        await copyFiles(
            getTemplate({ type, tool: genTool, size }),
            `${projectRoot}/_templates`
        );
        await copyFiles(
            getTemplate({ tool: lintTool, size }),
            `${projectRoot}`
        );
        await copyFiles(
            getTemplate({ tool: testTool, type }),
            `${projectRoot}`
        );

        await installPackages({
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
            type,
            testTool,
            lintTool,
            size,
            genTool,
            needStorybook,
            packageManager,
            projectRoot,
        });
    } catch (err) {
        console.log(err);
    }
};
