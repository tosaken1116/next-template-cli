---
to: "<%= `src/components/page/${name}/index.jsx` %>"
---
<% used_models.forEach(use_model=>{%>import { <%= use_model %> } from '@/components/model/<%= use_model %>';
<%})%>
export const Screen:React = () => {
  return <>this is page of <%= name %> </>;
};
