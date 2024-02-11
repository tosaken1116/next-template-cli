#!/usr/bin/env node
import prompts, { InitialReturnValue } from "prompts";
import pkg from "picocolors";
import packageJson from "./package.json";
import { Command } from "commander";
import { generator } from "./generator";
import path from "path";
import { log } from "./helper/log";
import { exit } from "process";
import { exec } from "./helper/exec";
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
		"--recommend",
		`
Initialize with recommended options.
    `,
	)
	.option(
		"--moonshot",
		`
    Initialize with moonshot options.
`,
	)
	.option(
		"--ts, --typescript",
		`

  Initialize as a TypeScript project. (default)
`,
	)
	.option(
		"--js, --javascript",
		`

  Initialize as a JavaScript project.
`,
	)
	.option(
		"--tailwind",
		`

  Initialize with Tailwind CSS config. (default)
`,
	)
	.option(
		"--eslint",
		`

  Initialize with eslint config.
`,
	)
	.option(
		"--app",
		`

  Initialize as an App Router project.
`,
	)
	.option(
		"--src-dir",
		`

  Initialize inside a \`src/\` directory.
`,
	)
	.option(
		"--import-alias <alias-to-configure>",
		`

  Specify import alias to use (default "@/*").
`,
	)
	.option(
		"--storybook",
		`

    Initialize with Storybook.
`,
	)
	.option(
		"--jest",
		`

    Initialize with Jest.
`,
	)
	.option(
		"--vitest",
		`

    Initialize with Vitest.
`,
	)
	.option(
		"--hygen",
		`

    Initialize with Hygen.
`,
	)
	.option(
		"--scaffdog",
		`

    Initialize with Scaffdog.
`,
	)
	.option(
		"--small",
		`

    Initialize with small project size.
`,
	)
	.option(
		"--medium",
		`

    Initialize with medium project size. (default)
`,
	)
	.option(
		"--large",
		`

    Initialize with large project size.
`,
	)
	.option(
		"--npm",
		`

    Initialize with npm.
`,
	)
	.option(
		"--yarn",
		`

    Initialize with Yarn. (default)
`,
	)
	.option(
		"--pnpm",
		`

    Initialize with pnpm.
`,
	)
	.option(
		"--bun",
		`

    Initialize with bun.
`,
	)
	.option(
		"--github-actions",
		`
    Initialize with GitHub Actions.
`,
	)
	.option(
		"--actions-all",
		`
    Initialize with ALL GitHub Actions.
`,
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
	try {
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
		} else if (process.argv.includes("--recommend")) {
			options.typescript = true;
		} else if (process.argv.includes("--moonshot")) {
			options.typescript = true;
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
		if (process.argv.includes("--no-ui")) {
			options.uiLibrary = null;
		} else if (process.argv.includes("--chakra-ui")) {
			options.uiLibrary = "chakra-ui";
		} else if (process.argv.includes("--mui")) {
			options.uiLibrary = "mui";
		} else if (process.argv.includes("--shadcn-ui")) {
			options.uiLibrary = "shadcn-ui";
		} else if (process.argv.includes("--mantine-ui")) {
			options.uiLibrary = "mantine-ui";
		} else if (process.argv.includes("--yamada-ui")) {
			options.uiLibrary = "yamada-ui";
		} else if (process.argv.includes("--recommend")) {
			options.uiLibrary = "mui";
		} else if (process.argv.includes("--moonshot")) {
			options.uiLibrary = "shadcn-ui";
		} else {
			const { uiLibrary } = await prompts({
				onState: onPromptState,
				type: "select",
				name: "uiLibrary",
				message: `Which ${blue("UI library")} would you like to use?`,
				choices: [
					{ title: "Chakra UI", value: "chakra-ui" },
					{ title: "Material UI", value: "mui" },
					{ title: "Shadcn UI", value: "shadcn-ui" },
					{ title: "Mantine UI", value: "mantine-ui" },
					{ title: "Yamada UI", value: "yamada-ui" },
					{ title: "None", value: null },
				],
			});
			options.uiLibrary = uiLibrary;
			if (uiLibrary == "shadcn-ui") {
				options.tailwind = true;
			}
		}
		if (options.uiLibrary === null) {
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
		}
		if (process.argv.includes("--src-dir")) {
			options.srcDir = true;
		} else if (process.argv.includes("--no-src-dir")) {
			options.srcDir = false;
		} else if (
			process.argv.includes("--recommend") ||
			process.argv.includes("--moonshot")
		) {
			options.srcDir = true;
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
		} else if (process.argv.includes("--recommend")) {
			options.appRouter = false;
		} else if (process.argv.includes("--moonshot")) {
			options.appRouter = true;
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
			(process.argv.includes("--moonshot") ||
				process.argv.includes("--recommend")) &&
			options.importAlias === undefined
		) {
			options.importAlias = "@";
		} else if (
			typeof options.importAlias === "string" &&
			options.importAlias !== undefined &&
			options.importAlias.match(/(.+)\/\*/) !== null
		) {
			const match = options.importAlias.match(/(.+)\/\*/);
			if (match !== null) {
				options.importAlias = match[1];
			}
		} else if (
			typeof options.importAlias !== "string" ||
			!options.importAlias.length
		) {
			await (async () => {
				const { needImportAlias } = await prompts({
					onState: onPromptState,
					type: "toggle",
					name: "needImportAlias",
					message: `Would you like to customize the default ${blue(
						"import alias",
					)}?`,
					active: "Yes",
					inactive: "No",
				});
				if (!needImportAlias) {
					options.importAlias = "@";
					return;
				}
				const { importAlias } = await prompts({
					onState: onPromptState,
					type: "text",
					name: "importAlias",
					message: `What ${blue("import alias")} would you like configured?`,
				});
				const match = importAlias.match(/(.+)\/\*/);
				options.importAlias = match ? match[1] : "@";
			})();
		}
		if (process.argv.includes("--no-lint")) {
			options.lintTool = null;
		} else if (process.argv.includes("--eslint")) {
			options.lintTool = "eslint";
		} else if (process.argv.includes("--biome")) {
			options.lintTool = "biome";
		} else if (process.argv.includes("--recommend")) {
			options.lintTool = "eslint";
		} else if (process.argv.includes("--moonshot")) {
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
		options.otherTools = [];
		if (process.argv.includes("--all-other-tool")) {
			options.otherTools = ["stylelint", "markuplint", "lint-staged"];
		} else if (process.argv.includes("--no-other-tool")) {
			options.otherTools = [];
		} else if (process.argv.includes("--stylelint")) {
			options.otherTools.push("stylelint");
		} else if (process.argv.includes("--markuplint")) {
			options.otherTools.push("markuplint");
		} else if (process.argv.includes("--lint-staged")) {
			options.otherTools.push("lint-staged");
		} else if (
			process.argv.includes("--recommend") ||
			process.argv.includes("--moonshot")
		) {
			options.otherTools = ["stylelint", "markuplint", "lint-staged"];
		}

		if (
			process.argv.filter((arg) =>
				["--stylelint", "--markuplint", "--lint-staged"].includes(arg),
			).length !== 3 &&
			!process.argv.includes("--recommend") &&
			!process.argv.includes("--moonshot") &&
			!process.argv.includes("--all-other-tool") &&
			!process.argv.includes("--no-other-tool")
		) {
			const { otherTools } = await prompts({
				onState: onPromptState,
				type: "multiselect",
				name: "otherTools",
				message: `Which ${blue("other tool")} would you like to use?`,
				choices: [
					{
						title: "stylelint",
						value: "stylelint",
						selected: process.argv.includes("--stylelint"),
					},
					{
						title: "markuplint",
						value: "markuplint",
						selected: process.argv.includes("--markuplint"),
					},
					{
						title: "lint-staged",
						value: "lint-staged",
						selected: process.argv.includes("--lint-staged"),
					},
				],
			});
			options.otherTools = otherTools;
		}
		if (process.argv.includes("--storybook")) {
			options.needStorybook = true;
		} else if (process.argv.includes("--no-storybook")) {
			options.needStorybook = false;
		} else if (process.argv.includes("--recommend")) {
			options.needStorybook = true;
		} else if (process.argv.includes("--moonshot")) {
			options.needStorybook = true;
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
		} else if (process.argv.includes("--recommend")) {
			options.testTool = "jest";
		} else if (process.argv.includes("--moonshot")) {
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
		} else if (process.argv.includes("--recommend")) {
			options.genTool = "hygen";
		} else if (process.argv.includes("--moonshot")) {
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
		} else if (process.argv.includes("--recommend")) {
			options.projectSize = "medium";
		} else if (process.argv.includes("--moonshot")) {
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
		} else if (process.argv.includes("--recommend")) {
			options.packageTool = "pnpm";
		} else if (process.argv.includes("--moonshot")) {
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
		if (process.argv.includes("--all-actions")) {
			options.workflows = [
				"lighthouse",
				"code-diff",
				"lint",
				"test",
				"bundle-size",
				"useless-modules",
			];
		} else if (process.argv.includes("--github-actions")) {
			const { workflows } = await prompts({
				onState: onPromptState,
				type: "multiselect",
				name: "workflows",
				message: `Which ${blue("workflow")} would you like to use?`,
				choices: [
					{ title: "Lighthouse score", value: "lighthouse" },
					{ title: "Check amount code change", value: "code-diff" },
					{ title: "lint", value: "lint" },
					{ title: "test", value: "test" },
					{ title: "Check Bundle Size", value: "bundle-size" },
					{
						title: "Report Useless Modules",
						value: "useless-modules",
					},
				],
			});
			options.workflows = workflows;
		} else if (process.argv.includes("--no-github-actions")) {
			options.workflows = [];
		} else if (process.argv.includes("--recommend")) {
			options.workflows = [
				"lighthouse",
				"code-diff",
				"lint",
				"test",
				"bundle-size",
				"useless-modules",
			];
		} else if (process.argv.includes("--moonshot")) {
			options.workflows = [
				"lighthouse",
				"code-diff",
				"lint",
				"test",
				"bundle-size",
				"useless-modules",
			];
		} else {
			const { needWorkflow } = await prompts({
				onState: onPromptState,
				type: "toggle",
				name: "needWorkflow",
				message: `Would you like to use ${blue("GitHub Actions")}?`,
				active: "Yes",
				inactive: "No",
			});
			if (needWorkflow) {
				const { workflows } = await prompts({
					onState: onPromptState,
					type: "multiselect",
					name: "workflows",
					message: `Which ${blue("workflow")} would you like to use?`,
					choices: [
						{ title: "Lighthouse score", value: "lighthouse" },
						{
							title: "Check amount code change",
							value: "code-diff",
						},
						{ title: "lint", value: "lint" },
						{ title: "test", value: "test" },
						{ title: "Check Bundle Size", value: "bundle-size" },
					],
				});
				options.workflows = workflows;
			} else {
				options.workflows = [];
			}
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
		commandOptions.push(`--import-alias`, `"${options.importAlias}/*"`);
		commandOptions.push(`--use-${options.packageTool}`);

		// create-next-app コマンドを実行
		const command = `npx ${commandOptions.join(" ")}`;

		await log(
			() => exec(command),
			"Initializing Next.js project with create-next-app...",
		);

		await generator({
			projectRoot: path.resolve(`${projectName}`),
			storyTool: options.needStorybook ? "storybook" : null,
			type: options.typescript ? "ts" : "js",
			lintTool: options.lintTool,
			testTool: options.testTool,
			genTool: options.genTool,
			size: options.projectSize,
			packageManager: options.packageTool,
			isAppRouter: options.appRouter,
			isSrcDir: options.srcDir,
			workflows: options.workflows,
			uiLibrary: options.uiLibrary,
			otherTools: options.otherTools,
			importAlias: options.importAlias,
		});
		console.log(green("Done!"));
		console.log(`create Next.js app ${blue(projectName)}`);
		console.log(`cd ${blue(projectName)}`);
		console.log(
			`${options.packageTool}${
				options.packageTool == "npm" || "bun" ? " run" : ""
			} dev`,
		);
		exit(0);
	} catch (e) {
		console.error(e);
		exit(1);
	}
}

main();
