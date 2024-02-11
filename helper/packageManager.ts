import { PackageManager } from "../types";

export const getRunCommand = (packageManager: PackageManager) => {
	if (packageManager === "yarn" || packageManager === "pnpm") {
		return "yarn";
	}
	if (packageManager === "bun") {
		return "bun run";
	}
	return "npm run";
};

export const getInstallCommand = (
	packageManager: PackageManager,
	isDevDepend = false,
) => {
	if (packageManager === "yarn" || packageManager === "pnpm") {
		return `${packageManager} add${isDevDepend ? "  -D" : ""}`;
	}
	return `${packageManager} install${isDevDepend ? " -D" : ""}`;
};
