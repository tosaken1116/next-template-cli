import path from "path";
import { GenerateConfigType } from "../generator";
import { Tools } from "./getTemplate";
import { readFileSync, writeFileSync } from "fs";
type Scripts = Record<string, string>;
const scripts: Record<Tools, Record<GenerateConfigType["size"], Scripts>> = {
    biome: {
        small: {
            lint: "biome lint --apply --no-errors-on-unmatched",
        },
        medium: {
            lint: "biome lint --apply --no-errors-on-unmatched",
        },
        large: {
            lint: "biome lint --apply --no-errors-on-unmatched",
        },
    },
    eslint: {
        small: {
            lint: "eslint 'src/**/*.{ts,tsx}' --report-unused-disable-directives --max-warnings 0",
        },
        medium: {
            lint: "eslint 'src/**/*.{ts,tsx}' --report-unused-disable-directives --max-warnings 0",
        },
        large: {
            lint: "eslint 'src/**/*.{ts,tsx}' --report-unused-disable-directives --max-warnings 0",
        },
    },
    hygen: {
        small: {
            new: "hygen generator component",
        },
        medium: {
            "new:ui": "hygen generator ui",
            "new:model": "hygen generator model",
        },
        large: {
            "new:ui": "hygen generator ui",
            "new:model": "hygen generator model",
            "new:page": "hygen generator page",
            "new:domain": "hygen generator domain",
        },
    },
    jest: {
        small: {
            test: "jest",
        },
        medium: {
            test: "jest",
        },
        large: {
            test: "jest",
        },
    },
    vitest: {
        small: {
            test: "vitest",
        },
        medium: {
            test: "vitest",
        },
        large: {
            test: "vitest",
        },
    },
    scaffdog: {
        small: {},
        medium: {
            "new:ui": "scaffdog ui",
            "new:model": "scaffdog model",
            "new:page": "scaffdog page",
            "new:domain": "scaffdog domain",
        },
        large: {
            "new:ui": "scaffdog ui",
            "new:model": "scaffdog model",
            "new:page": "scaffdog page",
            "new:domain": "scaffdog domain",
        },
    },
    storybook: {
        small: {
            storybook: "start-storybook -p 6006",
            "build-storybook": "storybook build",
        },
        medium: {
            storybook: "start-storybook -p 6006",
            "build-storybook": "storybook build",
        },
        large: {
            storybook: "start-storybook -p 6006",
            "build-storybook": "storybook build",
        },
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
    const addScripts = tools.map((tool) => scripts[tool][size]);

    const packageJsonPath = path.join(projectRoot, "package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

    packageJson.scripts = { ...packageJson.scripts, ...addScripts };
    writeFileSync(
        packageJsonPath,
        JSON.stringify(packageJson, null, 4),
        "utf8"
    );
};
