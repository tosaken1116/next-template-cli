import path from "path";
import { getTemplate } from "../../helper/getTemplate";
import {
    GenerateConfigType,
    LintTool,
    OperationResult,
    UiLibrary,
    WriteFiles,
} from "../../types";
import {
    PROVIDER,
    SHADCN_CN,
    SHADCN_CONFIG,
    SHADCN_CSS,
    SHADCN_TAILWIND_CONFIG,
    TS_SYNTAXES,
    packages,
} from "./constant";

export const uiLibraryOperator = (
    uiLibrary: UiLibrary,
    config: Pick<
        GenerateConfigType,
        "size" | "type" | "projectRoot" | "isAppRouter" | "isSrcDir"
    >
): OperationResult => {
    if (!uiLibrary) {
        return {
            dependencies: [],
            devDependencies: [],
            packageJson: {},
            rewriteFiles: [],
            copyFiles: [],
            writeFiles: [],
            removeFiles: [],
        };
    }
    const dependencies = packages[uiLibrary];
    const writeFiles: WriteFiles =
        uiLibrary === "shadcn-ui"
            ? [
                  {
                      path: path.join(
                          config.projectRoot,
                          "src",
                          "libs",
                          "cn",
                          "index.ts"
                      ),
                      content: SHADCN_CN.replace(
                          config.type === "js" ? ", type ClassValue" : "",
                          ""
                      ).replace(
                          config.type === "js" ? ": ClassValue[]" : "",
                          ""
                      ),
                  },
                  {
                      path: path.join(
                          config.projectRoot,
                          config.isSrcDir ? "src" : "",
                          config.isAppRouter ? "app" : "pages",
                          "globals.css"
                      ),
                      content: SHADCN_CSS,
                  },
                  {
                      path: path.join(
                          config.projectRoot,
                          `tailwind.config.${config.type}`
                      ),
                      content: SHADCN_TAILWIND_CONFIG.replace(
                          config.type == "js"
                              ? 'import type { Config } from "tailwindcss"\n'
                              : "",
                          ""
                      ).replace(
                          config.type == "js" ? " satisfies Config" : "",
                          ""
                      ),
                  },
                  {
                      path: path.join(config.projectRoot, "components.json"),
                      content: SHADCN_CONFIG,
                  },
              ]
            : uiLibrary === "chakra-ui" ||
              uiLibrary === "mantine-ui" ||
              uiLibrary === "yamada-ui"
            ? [
                  {
                      path: path.join(
                          config.projectRoot,
                          "src",
                          "libs",
                          "provider",
                          `index.${config.type}x`
                      ),
                      content: PROVIDER(uiLibrary).replaceAll(
                          new RegExp(
                              config.type == "js" ? TS_SYNTAXES.join("|") : "",
                              "g"
                          ),
                          ""
                      ),
                  },
              ]
            : [];
    return {
        dependencies,
        devDependencies: [],
        packageJson: {},
        rewriteFiles: [],
        copyFiles: [],
        writeFiles: writeFiles,
        removeFiles: [],
    };
};
