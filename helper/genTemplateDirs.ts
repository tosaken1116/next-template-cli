import path from "path";
import { GenerateConfigType } from "../generator";
import { generateFiles } from "./genDirs";

export const genTemplateDirs = ({
    size,
    projectRoot,
    isSrcDir,
}: Pick<GenerateConfigType, "size" | "projectRoot" | "isSrcDir">) => {
    if (size == "small") {
        generateFiles([
            {
                path: path.resolve(
                    projectRoot,
                    `${isSrcDir ? "src/" : ""}components/.gitkeep`
                ),
                content: "",
            },
        ]);
    }
    if (size == "medium") {
        generateFiles([
            {
                path: path.resolve(
                    projectRoot,
                    `${isSrcDir ? "src/" : ""}components/ui/.gitkeep`
                ),
                content: "",
            },
            {
                path: path.resolve(
                    projectRoot,
                    `${isSrcDir ? "src/" : ""}components/model/.gitkeep`
                ),
                content: "",
            },
        ]);
    }

    if (size == "large") {
        generateFiles([
            {
                path: path.resolve(
                    projectRoot,
                    `${isSrcDir ? "src/" : ""}components/ui/.gitkeep`
                ),
                content: "",
            },
            {
                path: path.resolve(
                    projectRoot,
                    `${isSrcDir ? "src/" : ""}components/model/.gitkeep`
                ),
                content: "",
            },
            {
                path: path.resolve(
                    projectRoot,
                    `${isSrcDir ? "src/" : ""}components/domains/.gitkeep`
                ),
                content: "",
            },
            {
                path: path.resolve(
                    projectRoot,
                    `${isSrcDir ? "src/" : ""}components/page/.gitkeep`
                ),
                content: "",
            },
        ]);
    }
    if (size == ("large" || "medium")) {
        generateFiles([
            {
                path: path.resolve(
                    projectRoot,
                    `${isSrcDir ? "src/" : ""}libs/errorBoundary/index.ts`
                ),
                content: "export * from 'react-error-boundary';",
            },
        ]);
    }
};
