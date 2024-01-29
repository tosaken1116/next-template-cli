import path from "path";
import { getTemplate } from "../../helper/getTemplate";
import { GenTool, GenerateConfigType, OperationResult } from "../../types";
import {
    SCAFFDOG_STORYBOOK_TEMPLATE,
    SCAFFDOG_TEST_TEMPLATE,
    copyFilePaths,
    packages,
    scripts,
} from "./constant";
import {
    getAppRouterReplaceFiles,
    getSrcReplaceFiles,
    getStorybookTemplateFiles,
    getTestTemplateFiles,
} from "./utils";

export const genOperator = (
    genTool: GenTool,
    config: Pick<
        GenerateConfigType,
        | "size"
        | "type"
        | "isAppRouter"
        | "projectRoot"
        | "storyTool"
        | "testTool"
    >
): OperationResult => {
    if (!genTool) {
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
    const devDependencies = packages[genTool];
    const addScripts = scripts[genTool][config.size];
    const copyFiles = [
        {
            from: getTemplate({
                type: config.type,
                tool: genTool,
                size: config.size,
            }),
            to: path.join(config.projectRoot, copyFilePaths[genTool]),
        },
    ];
    const needEditOfStorybookTemplate = getStorybookTemplateFiles(genTool, {
        projectRoot: config.projectRoot,
        storyTool: config.storyTool,
    });
    const needEditOfTestTemplate = getTestTemplateFiles(genTool, {
        projectRoot: config.projectRoot,
        testTool: config.testTool,
    });

    const rewriteFiles = [
        // appRouterがfalseの場合は、page.tsxをindex.tsxに変更する
        ...getAppRouterReplaceFiles(genTool, {
            projectRoot: config.projectRoot,
            isAppRouter: config.isAppRouter,
        }).map((file) => {
            return {
                path: file,
                replaceStrings: [{ target: "page.tsx", replace: "index.tsx" }],
            };
        }),

        // srcDirがfalseの場合は、src/を削除する
        ...getSrcReplaceFiles(genTool, {
            projectRoot: config.projectRoot,
            isSrcDir: config.isAppRouter,
        }).map((file) => {
            return {
                path: file,
                replaceStrings: [{ target: "src/", replace: "" }],
            };
        }),
        // scaffdogの場合は、storybookのテンプレートを編集する
        ...(genTool === "scaffdog"
            ? needEditOfStorybookTemplate.map((file) => {
                  return {
                      path: file,
                      replaceStrings: [
                          {
                              target: SCAFFDOG_STORYBOOK_TEMPLATE,
                              replace: file,
                          },
                      ],
                  };
              })
            : []),
        // scaffdogの場合は、testのテンプレートを編集する
        ...(genTool === "scaffdog"
            ? needEditOfTestTemplate.map((file) => {
                  return {
                      path: file,
                      replaceStrings: [
                          {
                              target: SCAFFDOG_TEST_TEMPLATE,
                              replace: file,
                          },
                      ],
                  };
              })
            : []),
    ];
    const removeFiles =
        genTool === "hygen"
            ? [...needEditOfStorybookTemplate, ...needEditOfTestTemplate]
            : [];
    return {
        dependencies: [],
        devDependencies,
        packageJson: { scripts: addScripts },
        rewriteFiles,
        copyFiles,
        writeFiles: [],
        removeFiles: removeFiles,
    };
};
