import path from "path";
import {
	GenerateConfigType,
	LintTool,
	OperationResult,
	OtherTool,
	WriteFiles,
} from "../../types";
import { LINT_STAGED_CONFIG, packages, scripts } from "./constant";

export const otherToolOperator = (
	otherTools: OtherTool[],
	lintTool: LintTool,
	config: Pick<GenerateConfigType, "type" | "packageManager" | "projectRoot">,
): OperationResult => {
	if (otherTools.length === 0) {
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
	const devDependencies = otherTools
		.map((tool) => {
			return packages[tool];
		})
		.flat();
	const writeFiles: WriteFiles = [
		...(otherTools.includes("lint-staged")
			? [
					{
						path: path.join(config.projectRoot, ".lintstagedrc.js"),
						content: LINT_STAGED_CONFIG({
							...config,
							lintTool,
						}),
					},
			  ]
			: []),
		...(otherTools.includes("markuplint")
			? [
					{
						path: path.join(config.projectRoot, ".markuplintrc.json"),
						content: JSON.stringify(
							{
								specs: {
									"\\.[jt]sx?$": "@markuplint/react-spec",
								},
								parser: {
									"\\.[jt]sx?$": "@markuplint/jsx-parser",
								},
								extends: ["markuplint:recommended"],
							},
							null,
							4,
						),
					},
			  ]
			: []),
		...(otherTools.includes("stylelint")
			? [
					{
						path: path.join(config.projectRoot, ".stylelintrc.json"),
						content: JSON.stringify(
							{
								extends: ["stylelint-config-standard"],
							},
							null,
							4,
						),
					},
			  ]
			: []),
	];
	const addScript = otherTools
		.map((tool) => scripts[tool])
		.reduce((acc, cur) => {
			return { ...acc, ...cur };
		});

	return {
		dependencies: [],
		devDependencies,
		packageJson: { scripts: addScript },
		rewriteFiles: [],
		copyFiles: [],
		writeFiles,
		removeFiles: [],
	};
};
