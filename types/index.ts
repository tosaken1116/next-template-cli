export type LintTool = "eslint" | "biome" | null;
export type OtherTool = "stylelint" | "markuplint" | "lint-staged";
export type GenTool = "hygen" | "scaffdog" | null;
export type TestTool = "jest" | "vitest" | null;
export type StoryTool = "storybook" | null;
export type Tools = NonNullable<
	| LintTool
	| GenTool
	| TestTool
	| StoryTool
	| WorkflowTemplates
	| ActionsTemplates
>;
export type ImportAlias = string;
export type ProjectSize = "small" | "medium" | "large";
export type PackageManager = "npm" | "yarn" | "pnpm" | "bun";
export type Language = "js" | "ts";
export type Workflows =
	| "lighthouse"
	| "lint"
	| "test"
	| "code-diff"
	| "bundle-size"
	| "install-dependencies"
	| "build"
	| "useless-modules";
export type Actions = "cache-build" | "cache-module" | "pull-request-comment";
export type WorkflowTemplates = `${"workflows/"}${Workflows}`;
export type ActionsTemplates = `${"actions/"}${Actions}`;
export type UiLibrary =
	| "mui"
	| "chakra-ui"
	| "shadcn-ui"
	| "mantine-ui"
	| "yamada-ui"
	| null;
export type GenerateConfigType = {
	projectRoot: string;
	type: Language;
	storyTool: StoryTool;
	lintTool: LintTool;
	testTool: TestTool;
	genTool: GenTool;
	size: ProjectSize;
	packageManager: PackageManager;
	isAppRouter: boolean;
	isSrcDir: boolean;
	workflows: Workflows[];
	uiLibrary: UiLibrary;
	otherTools: OtherTool[];
	importAlias: ImportAlias;
};
export type RewriteFiles = {
	path: string;
	replaceStrings: { target: string; replace: string }[];
}[];
export type CopyFiles = {
	from: string;
	to: string;
}[];
export type WriteFiles = {
	path: string;
	content: string;
}[];

export type OperationResult = {
	dependencies: string[];
	devDependencies: string[];
	packageJson: Record<string, unknown>;
	rewriteFiles: RewriteFiles;
	copyFiles: CopyFiles;
	writeFiles: WriteFiles;
	removeFiles: string[];
};

export type Packages<T extends string | null> = Record<
	NonNullable<T>,
	string[]
>;

export type Scripts<T extends string | null> = Record<
	NonNullable<T>,
	Record<NonNullable<ProjectSize>, Record<string, string>>
>;
