import path from "path";
import { GenerateConfigType } from "../generator";
import { stringReplace } from "./dirNameFixer";
import { removeFiles } from "./removeFiles";
import { sync } from "glob";

const SCAFFDOG_STORYBOOK_TEMPLATE = `# \`{{ inputs.name }}/index.stories.tsx\`

\`\`\`
import { {{ inputs.name }} } from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof {{ inputs.name }}> = {
  component: {{ inputs.name }},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof {{ inputs.name }}>;

export const Default: Story = {
  args: {},
};

\`\`\`
`;
const SCAFFDOG_TEST_TEMPLATE = `# \`{{ name }}/index.test.tsx\`

\`\`\`tsx
import { render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";
import { {{ name }} } from ".";

describe("{{ name }}", () => {
  it("title is exist", () => {
    render(<{{ name }} />);

    const title = screen.getByText(/this is {{ name }} component/);

    expect(title).toBeInTheDocument();
  });
});

\`\`\`
`;
export const removeNonUse = ({
    projectRoot,
    needStorybook,
    genTool,
}: Pick<GenerateConfigType, "genTool" | "needStorybook" | "projectRoot">) => {
    if (!needStorybook) {
        if (genTool == "hygen") {
            const files = sync(
                path.join(
                    projectRoot,
                    "_templates",
                    "generator",
                    "**/stories.ejs.t"
                )
            );
            removeFiles(files);
        }
        if (genTool == "scaffdog") {
            const files = sync(path.join(projectRoot, ".scaffdog", "**/*.md"));
            files.forEach((file) => {
                stringReplace(
                    [
                        {
                            target: SCAFFDOG_STORYBOOK_TEMPLATE,
                            replace: "",
                        },
                        {
                            target: SCAFFDOG_TEST_TEMPLATE,
                            replace: "",
                        },
                    ],
                    file
                );
            });
        }
    }
};
