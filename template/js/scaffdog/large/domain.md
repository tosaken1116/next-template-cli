---
name: "domain"
root: "src/components/domain"
output: "."
questions:
    name: "domain name"
---

# Variables

-   name: `{{ inputs.name | pascal }}`

# `{{ name }}/index.js`

```jsx
// NOTE: uncomment when components are created
// export * from "./components";

export * from "./repository";

export * from "./usecase";
```

# `{{ name }}/components/index.js`

```jsx
// export model components from here
```

# `{{ name }}/usecase/index.js`

```jsx
// export usecase function from here
```

# `{{ name }}/repository/index.js`

```jsx
export const createNew{{ name }}Repository = () => {
    return {};
};
```
