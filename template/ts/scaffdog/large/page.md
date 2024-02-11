---
name: "page"
root: "."
output: "."
questions:
  name: "page name"
  page_path: "page path(http://localhost:3000/)"
---

# Variables

- name: `{{ inputs.name | pascal }}`

# `src/app/{{ inputs.page_path }}/page.tsx`

```tsx
import type { FC } from 'react';
import { Screen } from '@/components/page/{{name}}'

const {{ name }}:FC = () => <Screen />;

export default {{ name }};
```

# `src/components/page/{{name}}/index.tsx`

```tsx
import type { FC } from "react";
export const Screen: FC = () => {
  return <>this is page of {{ name }} </>;
};
```

# `src/components/page/{{name}}/index.stories.tsx`

```tsx

import { Screen as {{ name }} } from '.';

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
