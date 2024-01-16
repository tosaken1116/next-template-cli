---
to: src/components/ui/<%= name %>/index.stories.jsx
---
import { <%= name %> } from '.';

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
