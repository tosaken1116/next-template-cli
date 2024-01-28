import path from "path";
import { getTemplate } from "../../helper/getTemplate";
import { GenerateConfigType, OperationResult, TestTool } from "../../types";
import { packages, scripts } from "./constant";
import { type } from "os";

export const testOperator = (
    testTool: TestTool,
    config: Pick<GenerateConfigType, "size" | "projectRoot" | "type">
): OperationResult => {
    if (!testTool) {
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
    const devDependencies = packages[testTool];
    const addScripts = scripts[testTool][config.size];
    const copyFiles = [
        {
            from: getTemplate({ type: config.type, tool: testTool }),
            to: config.projectRoot,
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
