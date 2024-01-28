import { PackageManager } from "../types";
import { exec } from "./exec";

export const installPackages = async (
    packages: { depend: string[]; devDepend: string[] },
    packageManager: PackageManager = "npm",
    projectRoot = process.cwd()
) => {
    if (!packages.depend.length && !packages.devDepend.length) {
        return;
    }
    const commands = [
        `${
            packages.devDepend
                ? [packageManager, "install", "-D", ...packages.devDepend].join(
                      " "
                  )
                : ""
        }`,
        `${
            packages.depend
                ? [packageManager, "install", ...packages.depend].join(" ")
                : ""
        }`,
    ].filter((command) => command != "");
    const command = commands.join(" && ");
    await exec(command, {
        cwd: projectRoot,
    });
};
