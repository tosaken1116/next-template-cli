import { GenTool, Packages, Scripts } from "../../types";

export const packages: Packages<GenTool> = {
    scaffdog: ["scaffdog"],
    hygen: ["hygen"],
} as const;

export const tsPackages: Record<NonNullable<GenTool>, string[]> = {
    scaffdog: ["scaffdog"],
    hygen: ["hygen"],
} as const;

export const scripts: Scripts<GenTool> = {
    scaffdog: {
        small: {
            new: "scaffdog generate component",
        },
        medium: {
            "new:ui": "scaffdog generate ui",
            "new:model": "scaffdog generate model",
        },
        large: {
            "new:ui": "scaffdog generate ui",
            "new:model": "scaffdog generate model",
            "new:page": "scaffdog generate page",
            "new:domain": "scaffdog generate domain",
        },
    },
    hygen: {
        small: {
            new: "hygen generator component",
        },
        medium: {
            "new:ui": "hygen generator ui",
            "new:model": "hygen generator model",
        },
        large: {
            "new:ui": "hygen generator ui",
            "new:model": "hygen generator model",
            "new:page": "hygen generator page",
            "new:domain": "hygen generator domain",
        },
    },
} as const;

export const copyFilePaths: Record<NonNullable<GenTool>, string> = {
    hygen: "_templates",
    scaffdog: ".scaffdog",
};

export const SCAFFDOG_STORYBOOK_TEMPLATE = `# \`{{ inputs.name }}/index.stories.tsx\`

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
export const SCAFFDOG_TEST_TEMPLATE = `# \`{{ name }}/index.test.tsx\`

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
