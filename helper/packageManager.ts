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
