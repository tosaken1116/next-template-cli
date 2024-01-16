---
to: "<%= gen_files.includes('Error') ? `src/components/model/${domains}/components/${name}/presentations/error.jsx` : null %>"
---
export const <%= name %>ErrorPresentation = () => {
  return <>this is <%= name %> error presentation</>;
};
