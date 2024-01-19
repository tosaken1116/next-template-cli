#!/usr/bin/env node
import prompts, { InitialReturnValue } from "prompts";
import pkg from "picocolors";
import packageJson from "./package.json";
import { Command } from "commander";
import { generator } from "./generator";
import path from "path";
import { log } from "./helper/log";
import { exit } from "process";
const handleSigTerm = () => process.exit(0);
let projectName = "";
process.on("SIGINT", handleSigTerm);
process.on("SIGTERM", handleSigTerm);
const { blue, green } = pkg;
const program = new Command(packageJson.name);
program
    .version(packageJson.version)
    .arguments("<project-directory>")
    .usage(`${green("<project-directory>")} [options]`)
    .action((name) => {
        projectName = name;
    })
    .option(
        "--ts, --typescript",
        `

  Initialize as a TypeScript project. (default)
`
    )
    .option(
        "--js, --javascript",
        `

  Initialize as a JavaScript project.
`
    )
    .option(
        "--tailwind",
        `

  Initialize with Tailwind CSS config. (default)
`
    )
    .option(
        "--eslint",
        `

  Initialize with eslint config.
`
    )
    .option(
        "--app",
        `

  Initialize as an App Router project.
`
    )
    .option(
        "--src-dir",
        `

  Initialize inside a \`src/\` directory.
`
    )
    .option(
        "--import-alias <alias-to-configure>",
        `

  Specify import alias to use (default "@/*").
`
    )
    .option(
        "--storybook",
        `

    Initialize with Storybook.
`
    )
    .option(
        "--jest",
        `

    Initialize with Jest.
`
    )
    .option(
        "--vitest",
        `

    Initialize with Vitest.
`
    )
    .option(
        "--hygen",
        `

    Initialize with Hygen.
`
    )
    .option(
        "--scaffdog",
        `

    Initialize with Scaffdog.
`
    )
    .option(
        "--small",
        `

    Initialize with small project size.
`
    )
    .option(
        "--medium",
        `

    Initialize with medium project size. (default)
`
    )
    .option(
        "--large",
        `

    Initialize with large project size.
`
    )
    .option(
        "--npm",
        `

    Initialize with npm.
`
    )
    .option(
        "--yarn",
        `

    Initialize with Yarn. (default)
`
    )
    .option(
        "--pnpm",
        `

    Initialize with pnpm.
`
    )
    .option(
        "--bun",
        `

    Initialize with bun.
`
    )
    .allowUnknownOption()
    .parse(process.argv);
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
    const options = program.opts();

    if (!projectName) {
        const res = await prompts({
            onState: onPromptState,
            type: "text",
            name: "projectName",
            message: `What is your project ${blue("name")}?`,
            validate: (value) =>
                value === "" ? `Please enter a ${blue("name")}.` : true,
        });
        if (typeof res.projectName === "string") {
            projectName = res.projectName.trim();
        }
    }
    if (process.argv.includes("--ts") || process.argv.includes("--no-js")) {
        options.typescript = true;
    } else if (
        process.argv.includes("--js") ||
        process.argv.includes("--no-ts")
    ) {
        options.typescript = false;
    } else {
        const { typescript } = await prompts({
            onState: onPromptState,
            type: "toggle",
            name: "typescript",
            message: `Would you like to use ${blue("Typescript")}?`,
            active: "Yes",
            inactive: "No",
        });
        options.typescript = typescript;
    }

    if (process.argv.includes("--tailwind")) {
        options.tailwind = true;
    } else if (process.argv.includes("--no-tailwind")) {
        options.tailwind = false;
    } else {
        const { tailwind } = await prompts({
            onState: onPromptState,
            type: "toggle",
            name: "tailwind",
            message: `Would you like to use ${blue("Tailwind CSS")}?`,
            active: "Yes",
            inactive: "No",
        });
        options.tailwind = tailwind;
    }
    if (process.argv.includes("--src-dir")) {
        options.srcDir = true;
    } else if (process.argv.includes("--no-src-dir")) {
        options.srcDir = false;
    } else {
        const { srcDir } = await prompts({
            onState: onPromptState,
            type: "toggle",
            name: "srcDir",
            message: `Would you like to use ${blue("`src/` directory")}?`,
            active: "Yes",
            inactive: "No",
        });
        options.srcDir = srcDir;
    }
    if (process.argv.includes("--app") || process.argv.includes("--no-pages")) {
        options.appRouter = true;
    } else if (
        process.argv.includes("--no-app") ||
        process.argv.includes("--pages")
    ) {
        options.appRouter = false;
    } else {
        const { appRouter } = await prompts({
            onState: onPromptState,
            type: "toggle",
            name: "appRouter",
            message: `Would you like to use ${blue("AppRouter")}?`,
            active: "Yes",
            inactive: "No",
        });
        options.appRouter = appRouter;
    }

    if (
        typeof options.importAlias !== "string" ||
        !options.importAlias.length
    ) {
        async () => {
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
            if (!needImportAlias) {
                options.importAlias = "@/*";
            }
            const { importAlias } = await prompts({
                onState: onPromptState,
                type: "text",
                name: "importAlias",
                message: `What ${blue(
                    "import alias"
                )} would you like configured?`,
            });
            options.importAlias = importAlias;
        };
    }
    if (process.argv.includes("--no-lint")) {
        options.lintTool = null;
    } else if (process.argv.includes("--eslint")) {
        options.lintTool = "eslint";
    } else if (process.argv.includes("--biome")) {
        options.lintTool = "biome";
    } else {
        const { lintTool } = await prompts({
            onState: onPromptState,
            type: "select",
            name: "lintTool",
            message: `Which ${blue("lint tool")} would you like to use?`,
            choices: [
                { title: "ESLint + Prettier", value: "eslint" },
                { title: "Biome", value: "biome" },
                { title: "None", value: null },
            ],
        });
        options.lintTool = lintTool;
    }
    if (process.argv.includes("--storybook")) {
        options.needStorybook = true;
    } else if (process.argv.includes("--no-storybook")) {
        options.needStorybook = false;
    } else {
        const { needStorybook } = await prompts({
            onState: onPromptState,
            type: "toggle",
            name: "needStorybook",
            message: `Would you like to use ${blue("Storybook")}?`,
            active: "Yes",
            inactive: "No",
        });
        options.needStorybook = needStorybook;
    }
    if (process.argv.includes("--no-test")) {
        options.testTool = null;
    } else if (process.argv.includes("--jest")) {
        options.testTool = "jest";
    } else if (process.argv.includes("--vitest")) {
        options.testTool = "vitest";
    } else {
        const { testTool } = await prompts({
            onState: onPromptState,
            type: "select",
            name: "testTool",
            message: `Which ${blue("test tool")} would you like to use?`,
            choices: [
                { title: "Jest", value: "jest" },
                { title: "Vitest", value: "vitest" },
                { title: "None", value: null },
            ],
        });
        options.testTool = testTool;
    }
    if (process.argv.includes("--no-gen")) {
        options.genTool = null;
    } else if (process.argv.includes("--hygen")) {
        options.genTool = "hygen";
    } else if (process.argv.includes("--scaffdog")) {
        options.genTool = "scaffdog";
    } else {
        const { genTool } = await prompts({
            onState: onPromptState,
            type: "select",
            name: "genTool",
            message: `Which ${blue("code generator")} would you like to use?`,
            choices: [
                { title: "Hygen", value: "hygen" },
                { title: "scaffdog", value: "scaffdog" },
                { title: "None", value: null },
            ],
        });
        options.genTool = genTool;
    }
    if (process.argv.includes("--small")) {
        options.projectSize = "small";
    } else if (process.argv.includes("--medium")) {
        options.projectSize = "medium";
    } else if (process.argv.includes("--large")) {
        options.projectSize = "large";
    } else {
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
        options.projectSize = projectSize;
    }
    if (process.argv.includes("--npm")) {
        options.packageTool = "npm";
    } else if (process.argv.includes("--yarn")) {
        options.packageTool = "yarn";
    } else if (process.argv.includes("--pnpm")) {
        options.packageTool = "pnpm";
    } else if (process.argv.includes("--bun")) {
        options.packageTool = "bun";
    } else {
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
        options.packageTool = packageTool;
    }
    const commandOptions = ["create-next-app", projectName];
    if (options.typescript) {
        commandOptions.push("--typescript");
    } else {
        commandOptions.push("--javascript");
    }
    if (options.lintTool == "eslint") {
        commandOptions.push("--eslint");
    } else {
        commandOptions.push("--no-eslint");
    }
    if (options.tailwind) {
        commandOptions.push("--tailwind");
    } else {
        commandOptions.push("--no-tailwind");
    }
    if (options.srcDir) {
        commandOptions.push("--src-dir");
    } else {
        commandOptions.push("--no-src-dir");
    }
    if (options.appRouter) {
        commandOptions.push("--app");
    } else {
        commandOptions.push("--no-app");
    }
    commandOptions.push(`--import-alias`, `"${options.importAlias}"`);
    commandOptions.push(`--use-${options.packageTool}`);

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
        needStorybook: options.storybook,
        type: options.typescript ? "ts" : "js",
        lintTool: options.lintTool,
        testTool: options.testTool,
        genTool: options.genTool,
        size: options.projectSize,
        packageManager: options.packageTool,
        isAppRouter: options.appRouter,
        isSrcDir: options.srcDir,
    });
    process.stdout.write("\x1Bc");
    console.log(green("Done!"));
    console.log(`create Next.js app ${blue(projectName)}`);
    console.log(`cd ${blue(projectName)}`);
    console.log(
        `${options.packageTool}${
            options.packageTool == "npm" || "bun" ? " run" : ""
        } dev`
    );
    exit(0);
}

main();
