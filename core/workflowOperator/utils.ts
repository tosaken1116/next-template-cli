import {
	Actions,
	ActionsTemplates,
	WorkflowTemplates,
	Workflows,
} from "../../types";
import { workflowDependencies } from "./constant";

export const actionsDir = (action: Actions): ActionsTemplates => {
	return `actions/${action}`;
};

export const resolveWorkflowDependencies = (
	workflow: Workflows[],
): Workflows[] => {
	const dfs = (workflow: Workflows): Workflows[] => {
		const depend = workflowDependencies[workflow];
		if (!depend) {
			return [workflow];
		}
		return [workflow, ...depend.flatMap((depend) => dfs(depend))];
	};
	return Array.from(new Set(workflow.flatMap((workflow) => dfs(workflow))));
};
