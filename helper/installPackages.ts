import { PackageManager } from "../types";
import { exec } from "./exec";
import { getInstallCommand } from "./packageManager";

export const installPackages = async (
	packages: { depend: string[]; devDepend: string[] },
	packageManager: PackageManager = "npm",
	projectRoot = process.cwd(),
) => {
	if (!packages.depend.length && !packages.devDepend.length) {
		return;
	}
	const commands = [
		packages.devDepend.length !== 0
			? `${getInstallCommand(packageManager, true)} ${packages.devDepend.join(
					" ",
			  )}`
			: "",
		packages.depend.length !== 0
			? `${getInstallCommand(packageManager, false)} ${packages.depend.join(
					" ",
			  )}`
			: "",
	].filter((command) => command != "");
	const command = commands.join(" && ");
	await exec(command, {
		cwd: projectRoot,
	});
};
