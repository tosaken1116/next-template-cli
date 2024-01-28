import { readFileSync } from "fs";
import { writeFile } from "fs/promises";
import path from "path";
import { objectMergeDeep } from "./mergeObject";

export const editPackageJson = async (
    packageDir: string,
    editContent: object
) => {
    const packageJsonPath = path.join(packageDir, "package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
    const mergedPackageJson = objectMergeDeep(packageJson, editContent);
    await writeFile(
        packageJsonPath,
        JSON.stringify(mergedPackageJson, null, 4),
        "utf8"
    );
};
