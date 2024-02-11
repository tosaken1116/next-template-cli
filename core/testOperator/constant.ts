import { GenTool, Packages, ProjectSize, Scripts, TestTool } from "../../types";

export const packages: Packages<TestTool> = {
	vitest: ["@testing-library/jest-dom", "vitest", "@vitejs/plugin-react"],
	jest: ["@testing-library/jest-dom", "jest", "jest-environment-jsdom"],
} as const;

export const tsPackages: Record<NonNullable<TestTool>, string[]> = {
	jest: ["@types/jest", "ts-jest", "ts-node"],
	vitest: [],
} as const;

export const scripts: Scripts<TestTool> = {
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
} as const;
