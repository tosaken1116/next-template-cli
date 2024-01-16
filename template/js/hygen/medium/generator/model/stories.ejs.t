---
to: src/components/<%= name %>/index.stories.jsx
---

import { <%= name %>Presentation  } from './presentations';
<% gen_files.forEach(file=>{%>import { <%= name %><%= file %>Presentation  } from './presentations/<%= file.toLowerCase() %>';
<%})%>
const meta = {
  component: <%= name %>Presentation,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Default = <% if (!have_props) { %>{};<% }else{%>{
  args: {},
};<% } %>
<% gen_files.forEach(file=>{%>
export const <%= file %> = {
  render: () => <<%= name %><%= file %>Presentation />,
};
<%})
%>