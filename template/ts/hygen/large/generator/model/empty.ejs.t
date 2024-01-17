---
to: "<%= gen_files.includes('Empty') ? `src/domains/model/${domains}/components/${name}/presentations/empty.tsx` : null %>"
---
import type { FC } from 'react';

export const <%= name %>EmptyPresentation:FC = () => {
  return <>this is <%= name %> empty presentation</>;
};
