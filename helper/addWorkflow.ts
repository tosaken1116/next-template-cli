import path from "path";
import { GenerateConfigType, Workflows } from "../generator";
import { copyFiles } from "./copy";
import {
    BUILD,
    BUNDLE_ANALYZE,
    CODE_DIFF,
    INSTALL_DEPENDENCIES,
    LIGHT_HOUSE,
    LINT,
    TEST,
    WORKFLOW_BASE,
} from "./workflow";
import { mkdirSync, writeFileSync } from "fs";
type Actions = "cache-build" | "cache-module" | "pull-request-comment";
const dependWorkflows: Record<Workflows, Workflows[]> = {
    lighthouse: ["build"],
    lint: ["install-dependencies"],
    test: ["install-dependencies"],
    "code-diff": [],
    "bundle-size": ["build"],
    "install-dependencies": [],
    build: ["install-dependencies"],
};
const workflowFile: Record<Workflows, { main: string; actions: Actions[] }> = {
    lighthouse: {
        main: LIGHT_HOUSE,
        actions: ["cache-build", "pull-request-comment"],
    },
    lint: {
        main: LINT,
        actions: [],
    },
    test: {
        main: TEST,
        actions: [],
    },
    "code-diff": {
        main: CODE_DIFF,
        actions: ["pull-request-comment"],
    },
    "bundle-size": {
        main: BUNDLE_ANALYZE,
        actions: ["cache-build", "pull-request-comment"],
    },
    "install-dependencies": {
        main: INSTALL_DEPENDENCIES,
        actions: ["cache-module"],
    },
    build: {
        main: BUILD,
        actions: ["cache-build"],
    },
};
export const addWorkflow = ({
    projectRoot,
    workflows,
}: Pick<GenerateConfigType, "projectRoot" | "workflows">) => {
    const { workflows: installWorkflow, actions } = Array.from(
        new Set(
            workflows
                .map((workflow) => {
                    return [workflow, ...dependWorkflows[workflow]];
                })
                .flat()
        )
    )
        .map((workflow) => {
            return {
                workflows: [workflowFile[workflow].main],
                actions: workflowFile[workflow].actions,
            };
        })
        .reduce(
            (acc, cur) => {
                return {
                    workflows: [...acc.workflows, ...cur.workflows],
                    actions: [...acc.actions, ...cur.actions],
                };
            },
            { workflows: [], actions: [] }
        );
    const workflowBody = `${WORKFLOW_BASE}\n${installWorkflow.join("\n")}`;
    actions.forEach((action) => {
        const srcDir = path.join(
            __dirname,
            "../template/github/actions",
            action
        );
        const dstDir = path.join(projectRoot, ".github/actions", action);
        copyFiles(srcDir, dstDir);
    });
    const workflowPath = path.join(projectRoot, ".github/workflows", "ci.yml");
    mkdirSync(path.dirname(workflowPath), { recursive: true });
    writeFileSync(workflowPath, workflowBody);
};
