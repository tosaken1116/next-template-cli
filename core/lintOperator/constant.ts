import { LintTool, ProjectSize } from "../../types";

export const packages: Record<NonNullable<LintTool>, string[]> = {
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
} as const;

export const tsPackages: Record<NonNullable<LintTool>, string[]> = {
    biome: [],
    eslint: ["@typescript-eslint/eslint-plugin", "@typescript-eslint/parser"],
} as const;

export const scripts: Record<
    NonNullable<LintTool>,
    Record<NonNullable<ProjectSize>, Record<string, string>>
> = {
    biome: {
        small: {
            "lint:biome": "biome lint --apply --no-errors-on-unmatched",
        },
        medium: {
            "lint:biome": "biome lint --apply --no-errors-on-unmatched",
        },
        large: {
            "lint:biome": "biome lint --apply --no-errors-on-unmatched",
        },
    },
    eslint: {
        small: {
            "lint:eslint":
                "eslint 'src/**/*.{ts,tsx}' --report-unused-disable-directives --max-warnings 0",
        },
        medium: {
            "lint:eslint":
                "eslint 'src/**/*.{ts,tsx}' --report-unused-disable-directives --max-warnings 0",
        },
        large: {
            "lint:eslint":
                "eslint 'src/**/*.{ts,tsx}' --report-unused-disable-directives --max-warnings 0",
        },
    },
} as const;

export const copyFilePaths: Record<NonNullable<LintTool>, string> = {
    biome: ".",
    eslint: ".",
} as const;
