---
name: "model"
root: "src/components/domain"
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

# `{{ name }}/index.ts`

```tsx
export type * from "./type";

// NOTE: uncomment when components are created
// export * from "./components";

export * from "./repository";

export * from "./usecase";
```

# `{{ name }}/components/index.ts`

```tsx
// export model components from here
```

# `{{ name }}/types/index.ts`

```tsx
// export domain type from here
export type {{ name }} = {
    id: string;
};
```

# `{{ name }}/usecase/index.ts`

```tsx
// export usecase function from here
```

# `{{ name }}/repository/index.ts`

```tsx
type I{{ name }}Repository = {};

export const createNew{{ name }}Repository = (): I{{ name }}Repository => {
    return {};
};
```
