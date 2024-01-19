---
name: "model"
root: "src/components/domains/${inputs.domain | pascal }/components"
output: "."
questions:
    name: "component name"
    domain: "What domain do you want to generate?"
    have_props:
        confirm: "Do you have props?"
        initial: false
    have_hooks:
        confirm: "Do you have hooks?"
        initial: false
    gen_files:
        message: "What files do you want to generate?"
        multiple: true
        choices:
            - "Empty"
            - "Loading"
            - "Error"
---

# Variables

-   name: `{{ inputs.name | pascal }}`

# `{{ name }}/index.tsx`

```tsx
import type { FC } from 'react';
import { Suspense } from 'react';

import { {{ name }}Container } from './container';
{{include(inputs.gen_files,"loading" )|| "import { " + name + "LoadingPresentation } from './presentations/loading'"}}
import { ErrorBoundary } from '@/libs/ErrorBoundary';
{{inputs.have_props||"type Props = {}"}}

export const {{ name }}: FC{{inputs.have_props||"<Props>"}} = ({{inputs.have_props||"{}"}}) => (
  {{include(inputs.gen_files,"Error") && "<ErrorBoundary>"}}
    {{include(inputs.gen_files,"Loading") && "<Suspense fallback={<" + name + "LoadingPresentation />}>"}}
      <{{ name }}Container />
    {{include(inputs.gen_files,"Loading") && "</Suspense>"}}
  {{include(inputs.gen_files,"Error") && "</ErrorBoundary>"}}
);

```

# `{{ name }}/container.tsx`

```tsx
{{inputs.have_hooks&&("import { use" + name + " } from './hooks'")}}
import { {{ name }}Presentation } from './presentations';
{{inputs.have_hooks && "import { " + name + "EmptyPresentation } from './presentations/empty';"}}
export const {{name}}Container = ()=>{
  {{ inputs.have_hooks && "const { state" + ( include(inputs.gen_files,"empty") || ", isEmpty") + "} = use" + name + "()"}}
  {{ (inputs.have_hooks && include(inputs.gen_files,"empty")) || "if (isEmpty){return <" + name + "EmptyPresentation />;}"}}
  return <{{ name }}Presentation  />
}
```

# `{{include(inputs.gen_files,"Empty")}}{{ name }}/presentations/empty.tsx`

```tsx
import type { FC } from 'react';

export const {{ name }}EmptyPresentation:FC = () => {
  return <>this is {{ name }} empty presentation</>;
};
```

# `{{include(inputs.gen_files,"Loading")}}{{ name }}/presentations/loading.tsx`

```tsx
import type { FC } from 'react';

export const {{ name }}LoadingPresentation:FC = () => {
  return <>this is {{ name }} loading presentation</>;
};
```

# `{{ include(inputs.gen_files,"Error") || "!" }}{{ name }}/presentations/error.tsx`

```tsx
import type { FC } from 'react';

export const {{ name }}ErrorPresentation:FC = () => {
  return <>this is {{ name }} error presentation</>;
};
```

# `{{ inputs.have_hooks || "!" }}{{ name }}/hooks/index.ts`

```ts
import { useState } from 'react';

type IUse{{ name }} = {
  state: string;
{{include(inputs.gen_files,"empty")||"  isEmpty: boolean;"}}
};


export const use{{ name }} = ():IUse{{ name }} => {
  const [state, setState] = useState("");
  {{include(inputs.gen_files,"empty")||"const isEmpty = true;"}}
  return {state{{include(inputs.gen_files,"empty")||" , isEmpty"}} }
};
```

# `{{name}}/presentations/index.tsx`

```tsx
import type { FC } from 'react';

export const {{ name }}Presentation: FC = () => (
   <div>this is {{ name }} presentation</div>;
);

```

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

# `{{ name }}/index.test.tsx`

```tsx
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

```
