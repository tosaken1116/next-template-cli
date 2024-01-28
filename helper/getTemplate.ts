import path from "path";
import { fileURLToPath } from "url";
import { GenerateConfigType, Tools } from "../types";

type Args = {
    type?: GenerateConfigType["type"];
    tool: Tools | "actions" | "workflows";
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
