---
name: "ui"
root: "src/components/ui"
output: "."
questions:
    name: "component name"
---

# `{{ inputs.name }}/index.stories.tsx`

```
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

```

# `{{ inputs.name }}/index.tsx`

```
import type { FC } from 'react';

type Props = {};

export const {{ inputs.name }}:FC<Props> = ({}) => {
  return <>this is ui of {{ inputs.name }} </>;
};

```
