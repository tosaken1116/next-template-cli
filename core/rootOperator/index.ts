import { dir } from "console";
import { GenerateConfigType, OperationResult } from "../../types";
import { genOperator } from "../genOperator";
import { lintOperator } from "../lintOperator";
import { storyOperator } from "../storyOperator";
import { testOperator } from "../testOperator";
import { workflowOperator } from "../workflowOperator";
import { dirOperator } from "../dirOperator";
import { objectMergeDeep } from "../../helper/mergeObject";
import { uiLibraryOperator } from "../uiLibraryOperator";
import { sizeOperator } from "../sizeOperator";
import { otherToolOperator } from "../otherToolOperator";
import { defaultDevDependencies, defaultScripts } from "./constant";

export const getEditContents = (
	config: GenerateConfigType,
): OperationResult => {
	const editContents = [
		genOperator(config.genTool, config),
		lintOperator(config.lintTool, config),
		storyOperator(config.storyTool, config),
		testOperator(config.testTool, config),
		workflowOperator(config.workflows, config),
		dirOperator({
			isSrcDir: config.isSrcDir,
			projectSize: config.size,
			projectRoot: config.projectRoot,
		}),
		uiLibraryOperator(config.uiLibrary, config),
		sizeOperator(config.size),
		otherToolOperator(config.otherTools, config.lintTool, config),
	].reduce(
		(acc, cur) => {
			return {
				dependencies: [...acc.dependencies, ...cur.dependencies],
				devDependencies: [...acc.devDependencies, ...cur.devDependencies],
				packageJson: objectMergeDeep(acc.packageJson, cur.packageJson),

				rewriteFiles: [...acc.rewriteFiles, ...cur.rewriteFiles],
				copyFiles: [...acc.copyFiles, ...cur.copyFiles],
				writeFiles: [...acc.writeFiles, ...cur.writeFiles],
				removeFiles: [...acc.removeFiles, ...cur.removeFiles],
			};
		},
		{
			dependencies: [],
			devDependencies: defaultDevDependencies,
			packageJson: { scripts: defaultScripts },
			rewriteFiles: [],
			copyFiles: [],
			writeFiles: [],
			removeFiles: [],
		},
	);
	return editContents;
};
