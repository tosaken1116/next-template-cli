---
to: "<%= `src/components/domains/${name}/index.ts` %>"
---
export type * from "./type";

// NOTE: uncomment when components are created
// export * from "./components";

export * from "./repository";

export * from "./usecase";