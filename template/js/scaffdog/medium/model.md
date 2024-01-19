---
name: "model"
root: "src/components/model"
output: "."
questions:
    name: "component name"
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

# `{{ name }}/index.jsx`

```jsx
import { Suspense } from 'react';

import { {{ name }}Presentation } from './presentations';
{{include(inputs.gen_files,"loading" )|| "import { " + name + "LoadingPresentation } from './presentations/loading'"}}
import { ErrorBoundary } from '@/libs/ErrorBoundary';
{{inputs.have_props||"type Props = {}"}}

export const {{ name }} = ({{inputs.have_props||"{}"}}) => (
  {{include(inputs.gen_files,"Error") && "<ErrorBoundary>"}}
    {{include(inputs.gen_files,"Loading") && "<Suspense fallback={<" + name + "LoadingPresentation />}>"}}
      <{{ name }}Presentation />
    {{include(inputs.gen_files,"Loading") && "</Suspense>"}}
  {{include(inputs.gen_files,"Error") && "</ErrorBoundary>"}}
);

```

# `{{ name }}/container.jsx`

```jsx
{{inputs.have_hooks&&("import { use" + name + " } from './hooks'")}}
import { {{ name }}Presentation } from './presentations';
{{inputs.have_hooks && "import { " + name + "EmptyPresentation } from './presentations/empty';"}}
export const {{name}}Container = ()=>{
  {{ inputs.have_hooks && "const { state" + ( include(inputs.gen_files,"empty") || ", isEmpty") + "} = use" + name + "()"}}
  {{ (inputs.have_hooks && include(inputs.gen_files,"empty")) || "if (isEmpty){return <" + name + "EmptyPresentation />;}"}}
  return <{{ name }}Presentation  />
}
```

# `{{include(inputs.gen_files,"Empty")}}{{ name }}/presentations/empty.jsx`

```jsx
export const {{ name }}EmptyPresentation = () => {
  return <>this is {{ name }} empty presentation</>;
};
```

# `{{include(inputs.gen_files,"Loading")}}{{ name }}/presentations/loading.jsx`

```jsx
export const {{ name }}LoadingPresentation = () => {
  return <>this is {{ name }} loading presentation</>;
};
```

# `{{ include(inputs.gen_files,"Error") || "!" }}{{ name }}/presentations/error.jsx`

```jsx
export const {{ name }}ErrorPresentation = () => {
  return <>this is {{ name }} error presentation</>;
};
```

# `{{ inputs.have_hooks || "!" }}{{ name }}/hooks/index.js`

```js
import { useState } from 'react';

export const use{{ name }} = () => {
  const [state, setState] = useState("");
  {{include(inputs.gen_files,"empty")||"const isEmpty = true;"}}
  return {state{{include(inputs.gen_files,"empty")||" , isEmpty"}} }
};
```

# `{{name}}/presentations/index.jsx`

```jsx
export const {{ name }}Presentation = () => (
   <div>this is {{ name }} presentation</div>;
);

```

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

# `{{ name }}/index.test.jsx`

```jsx
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
