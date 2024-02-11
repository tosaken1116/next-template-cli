import path from "path";
import { fileURLToPath } from "url";
import { multipleCopyFiles } from "./helper/copy";
import { installPackages } from "./helper/installPackages";
import { log } from "./helper/log";
import { GenerateConfigType } from "./types";
import { getEditContents } from "./core/rootOperator";
import { editPackageJson } from "./helper/editPackageJson";
import { removeFiles } from "./helper/removeFiles";
import { replaceStrings } from "./helper/replaceStrings";
import { createFiles } from "./helper/createFiles";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
export const generator = async (config: GenerateConfigType) => {
	const {
		dependencies: depend,
		devDependencies: devDepend,
		packageJson,
		copyFiles,
		removeFiles: uselessFiles,
		rewriteFiles,
		writeFiles,
	} = getEditContents(config);
	try {
		await Promise.all([
			log(
				() =>
					installPackages(
						{ depend, devDepend },
						config.packageManager,
						config.projectRoot,
					),
				"installing packages...",
			),
			log(() => multipleCopyFiles(copyFiles), "copying files..."),
			log(() => createFiles(writeFiles), "creating files..."),
		]);
		await Promise.all([
			log(() => removeFiles(uselessFiles), "removing files..."),
			log(() => replaceStrings(rewriteFiles), "rewriting files..."),
			log(
				() => editPackageJson(config.projectRoot, packageJson),
				"editing package.json...",
			),
		]);
	} catch (err) {
		throw err;
	}
};
