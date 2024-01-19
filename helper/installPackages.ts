import { GenerateConfigType } from "../generator";
import path from "path";
import { Tools } from "./getTemplate";
import { log } from "./log";
import { execSync } from "child_process";

export const packages: Record<Tools, string[]> = {
    biome: ["@biomejs/biome"],
    eslint: [
        "eslint",
        "eslint-config-next",
        "eslint-config-prettier",
        "eslint-plugin-import",
        "eslint-plugin-jsx-a11y",
        "eslint-plugin-react",
        "eslint-plugin-unused-imports",
        "eslint-plugin-storybook",
    ],
    hygen: ["hygen"],
    jest: ["@testing-library/jest-dom", "jest", "jest-environment-jsdom"],
    vitest: ["@testing-library/jest-dom", "vitest", "@vitejs/plugin-react"],
    scaffdog: ["scaffdog"],
    storybook: [
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
        "@storybook/addon-links",
        "@storybook/addon-onboarding",
        "@storybook/blocks",
        "@storybook/nextjs",
        "@storybook/react",
        "@storybook/testing-library",
    ],
} as const;

export const tsPackages = {
    biome: [],
    eslint: ["@typescript-eslint/eslint-plugin", "@typescript-eslint/parser"],
    hygen: [],
    jest: ["@types/jest", "ts-jest", "ts-node"],
    vitest: [],
    scaffdog: [],
    storybook: [],
} as const;

export const installPackages = ({
    type,
    testTool,
    lintTool,
    size,
    genTool,
    needStorybook,
    packageManager,
    projectRoot,
}: Pick<
    GenerateConfigType,
    | "type"
    | "testTool"
    | "lintTool"
    | "size"
    | "genTool"
    | "needStorybook"
    | "packageManager"
    | "projectRoot"
>) => {
    const tools: Tools[] = [testTool, lintTool, ...(genTool ? [genTool] : [])];
    if (needStorybook) {
        tools.push("storybook");
    }
    const addPackages = tools
        .map((tool) => [
            ...packages[tool],
            ...(type == "ts" ? tsPackages[tool] : []),
        ])
        .flat();
    const stop = log(`installing packages...`);

    const command = `${packageManager} i -D ${addPackages.join(" ")}${
        size !== "small" &&
        [" &&", packageManager, "i", "react-error-boundary"].join(" ")
    }`;
    stop();
    execSync(command, {
        cwd: path.resolve(projectRoot),
    });
};
