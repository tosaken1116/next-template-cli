import path from "path";
import { getAllFiles } from "../../helper/getAllFiles";
import { GenTool, GenerateConfigType } from "../../types";
import { sync } from "glob";

export const getSrcReplaceFiles = (
    genTool: GenTool,
    config: Pick<GenerateConfigType, "projectRoot" | "isSrcDir">
) => {
    if (config.isSrcDir) {
        return [];
    }
    return getAllFiles(
        path.resolve(
            config.projectRoot,
            genTool == "hygen"
                ? "_templates/generator"
                : genTool == "scaffdog"
                ? ".scaffdog"
                : ""
        )
    );
};

export const getAppRouterReplaceFiles = (
    genTool: GenTool,
    config: Pick<GenerateConfigType, "projectRoot" | "isAppRouter">
) => {
    if (config.isAppRouter) {
        return [];
    }
    return getAllFiles(
        path.resolve(
            config.projectRoot,
            genTool == "hygen"
                ? "_templates/generator"
                : genTool == "scaffdog"
                ? ".scaffdog"
                : ""
        )
    );
};
export const getStorybookTemplateFiles = (
    genTool: GenTool,
    config: Pick<GenerateConfigType, "storyTool" | "projectRoot">
) => {
    if (config.storyTool != null) {
        return [];
    }
    if (genTool == "hygen") {
        return sync(
            path.join(
                config.projectRoot,
                "_templates",
                "generator",
                "**/stories.ejs.t"
            )
        );
    }
    if (genTool == "scaffdog") {
        return sync(path.join(config.projectRoot, ".scaffdog", "**/*.md"));
    }
    return [];
};

export const getTestTemplateFiles = (
    genTool: GenTool,
    config: Pick<GenerateConfigType, "testTool" | "projectRoot">
) => {
    if (config.testTool != null) {
        return [];
    }
    if (genTool == "hygen") {
        return sync(
            path.join(
                config.projectRoot,
                "_templates",
                "generator",
                "**/test.ejs.t"
            )
        );
    }
    if (genTool == "scaffdog") {
        return sync(path.join(config.projectRoot, ".scaffdog", "**/*.md"));
    }
    return [];
};
