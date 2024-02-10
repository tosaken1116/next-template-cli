---
name: "page"
root: "src"
output: "."
questions:
  name: "page name"
  page_path: "page path(http://localhost:3000/)"
---

# Variables

- name: `{{ inputs.name | pascal }}`

# `app/{{ inputs.page_path }}/page.jsx`

```jsx
import { Screen } from '@/components/page/{{name}}'

const {{ name }} = () => <Screen />;

export default {{ name }};
```

# `components/page/{{name}}/index.jsx`

```jsx
export const Screen = () => {
  return <>this is page of {{ name }} </>;
};
```

# `components/page/{{name}}/index.stories.jsx`

```jsx

import { Screen as {{ name }} } from '.';

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
