import path from "path";
import { getTemplate } from "../../helper/getTemplate";
import {
	GenerateConfigType,
	OperationResult,
	RewriteFiles,
	Workflows,
} from "../../types";
import {
	WORKFLOW_BASE,
	needActionsPaths,
	scripts,
	workflowContents,
} from "./constant";
import { actionsDir, resolveWorkflowDependencies } from "./utils";
import { getRunCommand } from "../../helper/packageManager";

export const workflowOperator = (
	workflows: Workflows[],
	config: Pick<
		GenerateConfigType,
		"size" | "type" | "projectRoot" | "packageManager"
	>,
): OperationResult => {
	if (!workflows.length) {
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
	const addScripts = workflows.map((workflow) => {
		return scripts[workflow][config.size];
	});
	const resolvedWorkflows = resolveWorkflowDependencies(workflows);
	const needActions = resolvedWorkflows.flatMap((workflow) => {
		return needActionsPaths[workflow];
	});
	const copyFiles = needActions.map((needAction) => {
		return {
			from: getTemplate({
				tool: actionsDir(needAction),
			}),
			to: path.join(config.projectRoot, ".github", "actions", needAction),
		};
	});
	const workflowContent = [
		WORKFLOW_BASE,
		...resolvedWorkflows.map((workflow) => {
			return workflowContents[workflow];
		}),
	].join("\n");
	const rewriteActionsFiles =
		config.packageManager !== "npm"
			? needActions.map((needAction) => {
					return {
						path: path.join(
							config.projectRoot,
							".github",
							"actions",
							needAction,
							"action.yml",
						),
						replaceStrings: [
							{
								target: "npm",
								replace: config.packageManager,
							},
						],
					};
			  })
			: [];
	const needEditWithPackageManager: RewriteFiles =
		config.packageManager !== "npm"
			? [
					{
						path: path.join(
							config.projectRoot,
							".github",
							"workflows",
							"ci.yml",
						),
						replaceStrings: [
							{
								target: "npm run",
								replace: getRunCommand(config.packageManager),
							},
						],
					},
			  ]
			: [];

	return {
		dependencies: [],
		devDependencies: [],
		packageJson: {
			scripts: addScripts.reduce((acc, cur) => {
				return { ...acc, ...cur };
			}),
			...(workflows.includes("bundle-size")
				? {
						nextBundleAnalysis: {
							budget: 358400,
							budgetPercentIncreaseRed: 20,
							minimumChangeThreshold: 0,
							showDetails: true,
						},
				  }
				: {}),
		},
		rewriteFiles: [...needEditWithPackageManager, ...rewriteActionsFiles],
		copyFiles,
		writeFiles: [
			{
				path: path.join(config.projectRoot, ".github/workflows/ci.yml"),
				content: workflowContent,
			},
		],
		removeFiles: [],
	};
};
