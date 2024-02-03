import { getRunCommand } from "../../helper/packageManager";
import { GenerateConfigType, OtherTool } from "../../types";

export const packages: Record<OtherTool, string[]> = {
    "lint-staged": ["lint-staged", "husky"],
    markuplint: [
        "markuplint",
        "@markuplint/jsx-parser",
        "@markuplint/react-spec",
    ],
    stylelint: ["stylelint", "stylelint-config-standard"],
} as const;

export const scripts: Record<OtherTool, Record<string, string>> = {
    markuplint: {
        "lint:markuplint": "markuplint 'src/**/*.{tsx,ts,jsx,js,html}'",
        "format:markuplint": "markuplint 'src/**/*.{tsx,ts,jsx,js,html}' --fix",
    },
    stylelint: {
        "lint:stylelint": "stylelint 'src/**/*.css'",
        "format:stylelint": "stylelint 'src/**/*.css' --fix",
    },
    "lint-staged": {},
};

export const LINT_STAGED_CONFIG = (
    config: Pick<GenerateConfigType, "type" | "lintTool" | "packageManager">
) => `${
    config.lintTool === "eslint"
        ? `import { ESLint } from 'eslint';
const removeIgnoredFiles = async (files) => {
  const eslint = new ESLint();
  const isIgnored = await Promise.all(
    files.map((file) => {
      return eslint.isPathIgnored(file);
    }),
  );
  const filteredFiles = files.filter((_, i) => !isIgnored[i]);
  return filteredFiles.join(' ');
};`
        : ""
}

export default {
  '**/*.{ts,tsx}': async (files) => {
    ${
        config.lintTool === "eslint"
            ? "const filesToLint = await removeIgnoredFiles(files);"
            : ""
    }
    return [\`${getRunCommand(config.packageManager)} lint \${${
    config.lintTool === "eslint" ? "filesToLint" : "files"
}}\`];
  },
};`;
