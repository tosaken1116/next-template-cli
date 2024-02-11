import { existsSync, mkdirSync, copyFileSync, readdirSync } from "fs";
import path from "path";

const ensureDirectoryExistence = (filePath: string) => {
	const dirname = path.dirname(filePath);
	if (existsSync(dirname)) {
		return true;
	}
	ensureDirectoryExistence(dirname);
	mkdirSync(dirname, { recursive: true });
};

// ファイルのコピー関数
export const copyFiles = async (srcDir: string, to: string) => {
	if (!existsSync(to)) {
		mkdirSync(to, { recursive: true });
	}

	// ソースディレクトリのファイル/ディレクトリ一覧を取得
	const entries = readdirSync(srcDir, { withFileTypes: true });

	for (let entry of entries) {
		const srcPath = path.join(srcDir, entry.name);
		const dstPath = path.join(to, entry.name);

		// entryがディレクトリの場合は再帰的にコピー
		if (entry.isDirectory()) {
			await copyFiles(srcPath, dstPath);
		} else {
			// ファイルの場合は単純にコピー
			copyFileSync(srcPath, dstPath);
		}
	}
};

export const multipleCopyFiles = async (
	paths: { from: string; to: string }[],
) => {
	paths.forEach(({ from, to }) => {
		copyFiles(from, to);
	});
};
