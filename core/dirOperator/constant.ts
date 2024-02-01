import { ProjectSize } from "../../types";

export const dirs: Record<ProjectSize, { dir: string; content: string }[]> = {
    large: [
        { dir: "components/ui/.gitkeep", content: "" },
        { dir: "components/model/.gitkeep", content: "" },
        { dir: "components/domains/.gitkeep", content: "" },
        { dir: "components/page/.gitkeep", content: "" },
        {
            dir: "libs/errorBoundary/.gitkeep",
            content: "export * from 'react-error-boundary';",
        },
    ],
    medium: [
        { dir: "components/ui/.gitkeep", content: "" },
        { dir: "components/model/.gitkeep", content: "" },
        {
            dir: "libs/errorBoundary/index.ts",
            content: "export * from 'react-error-boundary';",
        },
    ],
    small: [{ dir: "components/.gitkeep", content: "" }],
} as const;
