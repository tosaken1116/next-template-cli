import { readdirSync, statSync } from "fs";
import path from "path";

export const getAllFiles = (dirPath: string): string[] => {
	const files: string[] = [];

	const getFilesRecursively = (dir: string) => {
		const fileNames = readdirSync(dir);

		for (const fileName of fileNames) {
			const filePath = path.join(dir, fileName);
			const stat = statSync(filePath);

			if (stat.isFile()) {
				files.push(filePath);
			} else if (stat.isDirectory()) {
				getFilesRecursively(filePath);
			}
		}
	};

	getFilesRecursively(dirPath);

	return files;
};
