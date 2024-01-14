import path from "path";
import { fileURLToPath } from "url";
import { GenerateConfigType } from "../generator";

export type Tools =
    | GenerateConfigType["lintTool"]
    | GenerateConfigType["testTool"]
    | GenerateConfigType["genTool"]
    | "storybook";
type Args = {
    type?: GenerateConfigType["type"];
    tool: Tools;

    size?: GenerateConfigType["size"];
};
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
export const getTemplate = ({ type, tool, size }: Args) => {
    const dir = `template${type ? `/${type}` : ""}${"/" + tool}${
        size ? `/${size}` : ""
    }`;
    return path.join(__dirname, dir);
};
