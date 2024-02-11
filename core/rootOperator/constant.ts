export const defaultDevDependencies = ["npm-run-all"];

export const defaultScripts = {
	lint: "run-p lint:*",
	test: "run-p test:*",
	format: "run-p format:*",
} as const;
