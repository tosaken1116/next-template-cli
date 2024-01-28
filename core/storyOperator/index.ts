import path from "path";
import { getTemplate } from "../../helper/getTemplate";
import { GenerateConfigType, OperationResult, StoryTool } from "../../types";
import { copyFilePaths, packages, scripts } from "./constant";

export const storyOperator = (
    storyTool: StoryTool,
    config: Pick<GenerateConfigType, "size" | "type" | "projectRoot">
): OperationResult => {
    if (!storyTool) {
        return {
            dependencies: [],
            devDependencies: [],
            packageJson: {},
            rewriteFiles: [],
            copyFiles: [],
            writeFiles: [],
            removeFiles: [],
        };
    }
    const devDependencies = packages[storyTool];
    const addScripts = scripts[storyTool][config.size];
    const copyFiles = [
        {
            from: getTemplate({ type: config.type, tool: storyTool }),
            to: path.resolve(config.projectRoot, copyFilePaths[storyTool]),
        },
    ];
    return {
        dependencies: [],
        devDependencies,
        packageJson: { scripts: addScripts },
        rewriteFiles: [],
        copyFiles,
        writeFiles: [],
        removeFiles: [],
    };
};
