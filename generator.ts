import path from "path";
import { fileURLToPath } from "url";
import { getTemplate } from "./helper/getTemplate";
import { copyFiles } from "./helper/copy";
import { installPackages } from "./helper/installPackages";
import { addScripts } from "./helper/addScripts";
import { dirNameFixer } from "./helper/dirNameFixer";
import { genTemplateDirs } from "./helper/genTemplateDirs";
import { removeNonUse } from "./helper/removeNonUse";
import { addWorkflow } from "./helper/addWorkflow";
export type Workflows =
    | "lighthouse"
    | "lint"
    | "test"
    | "code-diff"
    | "bundle-size"
    | "install-dependencies"
    | "build"
    | "useless-modules";
export type GenerateConfigType = {
    projectRoot: string;
    type: "js" | "ts";
    needStorybook: boolean;
    lintTool: "eslint" | "biome" | null;
    testTool: "jest" | "vitest" | null;
    genTool: "hygen" | "scaffdog" | null;
    size: "small" | "medium" | "large";
    packageManager: "npm" | "yarn" | "pnpm" | "bun";
    isAppRouter: boolean;
    isSrcDir: boolean;
    workflows: Workflows[];
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
    workflows,
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
        if (lintTool != undefined) {
            await copyFiles(
                getTemplate({ tool: lintTool, size }),
                `${projectRoot}`
            );
        }
        if (testTool != undefined) {
            await copyFiles(
                getTemplate({ tool: testTool, type }),
                `${projectRoot}`
            );
        }

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
            testTool,
        });
        addWorkflow({ projectRoot, workflows, packageManager });
    } catch (err) {
        console.log(err);
    }
};
