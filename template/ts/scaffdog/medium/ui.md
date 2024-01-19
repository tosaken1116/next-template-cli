---
name: "ui"
root: "src/components/ui"
output: "."
questions:
    name: "component name"
---

# Variables

-   name: `{{ inputs.name | pascal }}`

# `{{ name }}/index.stories.tsx`

```tsx
import { {{ name }} } from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof {{ name }}> = {
  component: {{ name }},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof {{ name }}>;

export const Default: Story = {
  args: {},
};

```

# `{{ name }}/index.tsx`

```tsx
import type { FC } from 'react';

type Props = {};

export const {{ name }}:FC<Props> = ({}) => {
  return <>this is ui of {{ name }} </>;
};

```
