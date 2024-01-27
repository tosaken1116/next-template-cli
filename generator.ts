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
import { log } from "./helper/log";
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
        await Promise.all([
            log(
                () =>
                    copyFiles(
                        getTemplate({ type, tool: "storybook" }),
                        `${projectRoot}/.storybook`
                    ),
                "copying storybook files..."
            ),
            (() => {
                if (!genTool) {
                    return;
                }
                return log(
                    () =>
                        copyFiles(
                            getTemplate({ type, tool: genTool, size }),
                            `${projectRoot}/${
                                genTool == "hygen" ? "_templates" : ".scaffdog"
                            }`
                        ),
                    "copying gen files..."
                );
            })(),
            (() => {
                if (!lintTool) {
                    return;
                }
                return log(
                    () =>
                        copyFiles(
                            getTemplate({ tool: lintTool, size }),
                            `${projectRoot}`
                        ),
                    "copying lint files..."
                );
            })(),
            (() => {
                if (!testTool) {
                    return;
                }
                return log(
                    () =>
                        copyFiles(
                            getTemplate({ tool: testTool, type }),
                            `${projectRoot}`
                        ),
                    "copying test files..."
                );
            })(),
            installPackages({
                type,
                testTool,
                lintTool,
                size,
                genTool,
                needStorybook,
                packageManager,
                projectRoot,
            }),
            addScripts({
                testTool,
                lintTool,
                size,
                genTool,
                needStorybook,
                projectRoot,
            }),
            () => {
                if (!isAppRouter || !isSrcDir) {
                    return dirNameFixer({
                        size,
                        genTool,
                        projectRoot,
                        isAppRouter,
                        isSrcDir,
                    });
                }
                return () => {};
            },
            log(
                () =>
                    genTemplateDirs({
                        size,
                        projectRoot,
                        isSrcDir,
                    }),
                "generating template dirs..."
            ),
            () => {
                removeNonUse({
                    genTool,
                    needStorybook,
                    projectRoot,
                    testTool,
                });
            },
            log(
                () => addWorkflow({ projectRoot, workflows, packageManager }),
                "adding workflow..."
            ),
        ]).catch((err) => {
            throw err;
        });
    } catch (err) {
        console.log(err);
    }
};
