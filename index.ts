#!/usr/bin/env node
import { spawn } from "child_process";
import prompts, { InitialReturnValue } from "prompts";
import pkg from "picocolors";
import { generator } from "./generator";
import path from "path";
import { log } from "./helper/log";
import { exit } from "process";
const handleSigTerm = () => process.exit(0);

process.on("SIGINT", handleSigTerm);
process.on("SIGTERM", handleSigTerm);
const { blue, green } = pkg;
const onPromptState = (state: {
    value: InitialReturnValue;
    aborted: boolean;
    exited: boolean;
}) => {
    if (state.aborted) {
        process.stdout.write("\x1B[?25h");
        process.stdout.write("\n");
        process.exit(1);
    }
};
async function main() {
    const { projectName } = await prompts({
        onState: onPromptState,
        type: "text",
        name: "projectName",
        message: `What is your project ${blue("name")}?`,
        validate: (value) =>
            value === "" ? `Please enter a ${blue("name")}.` : true,
    });
    const { typescript } = await prompts({
        onState: onPromptState,
        type: "toggle",
        name: "typescript",
        message: `Would you like to use ${blue("Typescript")}?`,
        active: "Yes",
        inactive: "No",
    });

    const { tailwind } = await prompts({
        onState: onPromptState,
        type: "toggle",
        name: "tailwind",
        message: `Would you like to use ${blue("Tailwind CSS")}?`,
        active: "Yes",
        inactive: "No",
    });
    const { srcDir } = await prompts({
        onState: onPromptState,
        type: "toggle",
        name: "srcDir",
        message: `Would you like to use ${blue("`src/` directory")}?`,
        active: "Yes",
        inactive: "No",
    });

    const { appRouter } = await prompts({
        onState: onPromptState,
        type: "toggle",
        name: "appRouter",
        message: `Would you like to use ${blue("AppRouter")}?`,
        active: "Yes",
        inactive: "No",
    });
    const { needImportAlias } = await prompts({
        onState: onPromptState,
        type: "toggle",
        name: "needImportAlias",
        message: `Would you like to customize the default ${blue(
            "import alias"
        )}?`,
        active: "Yes",
        inactive: "No",
    });
    const { importAlias } = needImportAlias
        ? await prompts({
              onState: onPromptState,
              type: "text",
              name: "importAlias",
              message: `What ${blue(
                  "import alias"
              )} would you like configured?`,
          })
        : { importAlias: "@/*" };
    const { lintTool } = await prompts({
        onState: onPromptState,
        type: "select",
        name: "lintTool",
        message: `Which ${blue("lint tool")} would you like to use?`,
        choices: [
            { title: "ESLint + Prettier", value: "eslint" },
            { title: "Biome", value: "biome" },
            { title: "None", value: "none" },
        ],
    });
    const { needStorybook } = await prompts({
        onState: onPromptState,
        type: "toggle",
        name: "needStorybook",
        message: `Would you like to use ${blue("Storybook")}?`,
        active: "Yes",
        inactive: "No",
    });
    const { testTool } = await prompts({
        onState: onPromptState,
        type: "select",
        name: "testTool",
        message: `Which ${blue("test tool")} would you like to use?`,
        choices: [
            { title: "Jest", value: "jest" },
            { title: "Vitest", value: "vitest" },
            { title: "None", value: "none" },
        ],
    });
    const { genTool } = await prompts({
        onState: onPromptState,
        type: "select",
        name: "genTool",
        message: `Which ${blue("code generator")} would you like to use?`,
        choices: [
            { title: "Hygen", value: "hygen" },
            { title: "scaffdog", value: "scaffdog" },
            { title: "None", value: "none" },
        ],
    });
    const { projectSize } = await prompts({
        onState: onPromptState,
        type: "select",
        name: "projectSize",
        message: `Which ${blue("project size")} would you like to use?`,
        choices: [
            { title: "Small", value: "small" },
            { title: "Medium", value: "medium" },
            { title: "Large", value: "large" },
        ],
    });
    const { packageTool } = await prompts({
        onState: onPromptState,
        type: "select",
        name: "packageTool",
        message: `Which ${blue("package tool")} would you like to use?`,
        choices: [
            { title: "npm", value: "npm" },
            { title: "Yarn", value: "yarn" },
            { title: "pnpm", value: "pnpm" },
            { title: "bun", value: "bun" },
        ],
    });
    const commandOptions = ["create-next-app", projectName];
    if (typescript) {
        commandOptions.push("--typescript");
    } else {
        commandOptions.push("--javascript");
    }
    if (lintTool == "eslint-prettier") {
        commandOptions.push("--eslint");
    } else {
        commandOptions.push("--no-eslint");
    }
    if (tailwind) {
        commandOptions.push("--tailwind");
    } else {
        commandOptions.push("--no-tailwind");
    }
    if (srcDir) {
        commandOptions.push("--src-dir");
    } else {
        commandOptions.push("--no-src-dir");
    }
    if (appRouter) {
        commandOptions.push("--app");
    } else {
        commandOptions.push("--no-app");
    }
    commandOptions.push(`--import-alias`, `"${importAlias}"`);
    commandOptions.push(`--use-${packageTool}`);

    // create-next-app コマンドを実行
    const { exec } = await import("child_process");
    const command = `npx ${commandOptions.join(" ")}`;

    const child = exec(command);
    const stop = log("Creating your project...");
    await new Promise((resolve) => {
        child.on("close", resolve);
    });
    stop();

    await generator({
        projectRoot: path.resolve(`${projectName}`),
        needStorybook,
        type: typescript ? "ts" : "js",
        lintTool,
        testTool,
        genTool,
        size: projectSize,
        packageManager: packageTool,
        isAppRouter: appRouter,
        isSrcDir: srcDir,
    });
    process.stdout.write("\x1Bc");
    console.log(green("Done!"));
    console.log(`create Next.js app ${blue(projectName)}`);
    console.log(`cd ${blue(projectName)}`);
    console.log(
        `${packageTool}${packageTool == "npm" || "bun" ? " run" : ""} dev`
    );
    exit(0);
}

main();
