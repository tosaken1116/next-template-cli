import path from "path";
import { GenerateConfigType } from "../generator";
import { Tools } from "./getTemplate";
import { readFileSync, writeFileSync } from "fs";

const scripts: Record<Tools, Record<string, string>> = {
    biome: {
        lint: "biome lint --apply --no-errors-on-unmatched",
    },
    eslint: {
        lint: "eslint 'src/**/*.{ts,tsx}' --report-unused-disable-directives --max-warnings 0",
    },
    hygen: {
        "new:ui": "hygen generator ui",
        "new:model": "hygen generator model",
        "new:page": "hygen generator page",
        "new:domain": "hygen generator domain",
    },
    jest: {
        test: "jest",
    },
    vitest: {
        test: "vitest",
    },
    scaffdog: {
        "new:ui": "scaffdog ui",
        "new:model": "scaffdog model",
        "new:page": "scaffdog page",
        "new:domain": "scaffdog domain",
    },
    storybook: {
        storybook: "start-storybook -p 6006",
        "build-storybook": "storybook build",
    },
};

export const addScripts = ({
    type,
    testTool,
    lintTool,
    size,
    genTool,
    needStorybook,
    packageManager,
    projectRoot,
}: GenerateConfigType) => {
    const tools: Tools[] = [testTool, lintTool, genTool];
    if (needStorybook) {
        tools.push("storybook");
    }
    const addScripts = tools
        .map((tool) => scripts[tool])
        .reduce((acc, cur) => ({ ...acc, ...cur }), {});

    const packageJsonPath = path.join(projectRoot, "package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

    packageJson.scripts = { ...packageJson.scripts, ...addScripts };
    writeFileSync(
        packageJsonPath,
        JSON.stringify(packageJson, null, 4),
        "utf8"
    );
};
