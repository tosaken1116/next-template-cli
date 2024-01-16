---
to: src/components/page/<%= name %>/index.stories.jsx
---

import { Screen as <%= name %> } from '.';

const meta = {
  component: <%= name %>,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {},
};