import path from "path";
import { getTemplate } from "../../helper/getTemplate";
import { GenerateConfigType, LintTool, OperationResult } from "../../types";
import { copyFilePaths, packages, scripts } from "./constant";

export const lintOperator = (
	lintTool: LintTool,
	config: Pick<GenerateConfigType, "size" | "type" | "projectRoot">,
): OperationResult => {
	if (!lintTool) {
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
	const devDependencies = packages[lintTool];
	const addScripts = scripts[lintTool][config.size];
	const copyFiles = [
		{
			from: getTemplate({ tool: lintTool, size: config.size }),
			to: path.join(config.projectRoot, copyFilePaths[lintTool]),
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
