import path from "path";
import { GenerateConfigType, OperationResult } from "../../types";
import { dirs } from "./constant";

type Args = {
    isSrcDir: boolean;
    projectSize: GenerateConfigType["size"];
    projectRoot: GenerateConfigType["projectRoot"];
};
export const dirOperator = ({
    isSrcDir,
    projectSize,
    projectRoot,
}: Args): OperationResult => {
    const writeFiles = dirs[projectSize].map(({ dir, content }) => {
        return {
            path: path.join(projectRoot, isSrcDir ? "src" : "", dir),
            content,
        };
    });
    return {
        dependencies: [],
        devDependencies: [],
        packageJson: {},
        rewriteFiles: [],
        copyFiles: [],
        writeFiles,
        removeFiles: [],
    };
};
