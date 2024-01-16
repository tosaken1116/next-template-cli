---
to: "<%= gen_files.includes('Loading') ? `src/components/model/${domains}/components/${name}/presentations/loading.jsx` : null %>"
---
export const <%= name %>LoadingPresentation = () => {
  return <>this is <%= name %> component</>;
};
