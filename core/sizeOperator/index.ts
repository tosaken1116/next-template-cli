import { OperationResult, ProjectSize } from "../../types";

export const sizeOperator = (projectSize: ProjectSize): OperationResult => {
    if (projectSize === "small") {
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
    return {
        dependencies: ["react-error-boundary"],
        devDependencies: [],
        packageJson: {},
        rewriteFiles: [],
        copyFiles: [],
        writeFiles: [],
        removeFiles: [],
    };
};
