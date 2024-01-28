import { Packages, ProjectSize, StoryTool } from "../../types";

export const packages: Packages<"storybook"> = {
    storybook: [
        "storybook",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
        "@storybook/addon-links",
        "@storybook/addon-onboarding",
        "@storybook/blocks",
        "@storybook/nextjs",
        "@storybook/react",
        "@storybook/testing-library",
    ],
} as const;

export const scripts: Record<
    NonNullable<"storybook">,
    Record<NonNullable<ProjectSize>, Record<string, string>>
> = {
    storybook: {
        small: {
            storybook: "storybook dev -p 6006",
            "build-storybook": "storybook build",
        },
        medium: {
            storybook: "storybook dev -p 6006",
            "build-storybook": "storybook build",
        },
        large: {
            storybook: "storybook dev -p 6006",
            "build-storybook": "storybook build",
        },
    },
};
export const copyFilePaths: Record<NonNullable<StoryTool>, string> = {
    storybook: ".storybook",
};
