---
to: "<%= have_hooks ? `src/components/model/${domains}/components/${name}/hooks/index.js` : null %>"
---
import { useState } from 'react';

export const use<%= name %> = ()=> {
  const [state, setState] = useState("");
  <% if(gen_files.includes("Empty")){ %>const isEmpty = true;<% }%>
  return {state,setState<% if(gen_files.includes("Empty")){ %>, isEmpty <% }%>}
};
