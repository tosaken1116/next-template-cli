---
name: "ui"
root: "src/components/ui"
output: "."
questions:
    name: "component name"
---

# Variables

-   name: `{{ inputs.name | pascal }}`

# `{{ name }}/index.stories.jsx`

```jsx
import { {{ name }} } from '.';

const meta = {
  component: {{ name }},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {},
};

```

# `{{ name }}/index.jsx`

```jsx
export const {{ name }} = ({}) => {
  return <>this is ui of {{ name }} </>;
};

```
