import path from "path";
import { getAllFiles } from "../../helper/getAllFiles";
import { GenTool, GenerateConfigType } from "../../types";
import { sync } from "glob";
import { getTemplate } from "../../helper/getTemplate";

export const getSrcReplaceFiles = (
	genTool: NonNullable<GenTool>,
	config: Pick<
		GenerateConfigType,
		"projectRoot" | "isSrcDir" | "type" | "size"
	>,
) => {
	if (config.isSrcDir) {
		return [];
	}
	return getAllFiles(getTemplate({ ...config, tool: genTool })).map((file) =>
		path.join(
			config.projectRoot,
			genTool === "hygen" ? "_templates" : ".scaffdog",
			file
				.split("/")
				.splice(genTool === "hygen" ? -3 : -1, genTool === "hygen" ? 3 : 1)
				.join("/"),
		),
	);
};

export const getAppRouterReplaceFiles = (
	genTool: NonNullable<GenTool>,
	config: Pick<
		GenerateConfigType,
		"projectRoot" | "isAppRouter" | "type" | "size"
	>,
) => {
	if (config.isAppRouter) {
		return [];
	}

	return sync(
		path.join(getTemplate({ ...config, tool: genTool }), "**/page.ejs.t"),
	).map((file) =>
		path.join(
			config.projectRoot,
			genTool === "hygen" ? "_templates" : ".scaffdog",
			file
				.split("/")
				.splice(genTool === "hygen" ? -3 : -1, genTool === "hygen" ? 3 : 1)
				.join("/"),
		),
	);
};
export const getStorybookTemplateFiles = (
	genTool: GenTool,
	config: Pick<GenerateConfigType, "storyTool" | "projectRoot">,
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
				"**/stories.ejs.t",
			),
		);
	}
	if (genTool == "scaffdog") {
		return sync(path.join(config.projectRoot, ".scaffdog", "**/*.md"));
	}
	return [];
};

export const getTestTemplateFiles = (
	genTool: GenTool,
	config: Pick<GenerateConfigType, "testTool" | "projectRoot">,
) => {
	if (config.testTool != null) {
		return [];
	}
	if (genTool == "hygen") {
		return sync(
			path.join(config.projectRoot, "_templates", "generator", "**/test.ejs.t"),
		);
	}
	if (genTool == "scaffdog") {
		return sync(path.join(config.projectRoot, ".scaffdog", "**/*.md"));
	}
	return [];
};
