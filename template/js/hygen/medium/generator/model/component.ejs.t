---
to: "<%=  `src/components/model/${name}/index.jsx` %>"
---
import { Suspense } from 'react';

import { <%= name %>Presentation } from './presentations';
<% gen_files.filter((file)=>file!="Empty").forEach(file=>{%>import { <%= name %><%= file %>Presentation } from './presentations/<%= file.toLowerCase() %>';
<%})%>
import { ErrorBoundary } from '@/libs/ErrorBoundary';

export const <%= name %> = (<% if (have_props) { %>{}<% } %>) => (
  <% if (gen_files.includes("Error")) { %><ErrorBoundary fallback={<<%= name %>ErrorPresentation />}><% } %>
    <% if (gen_files.includes("Loading")) { %><Suspense fallback={<<%= name %>LoadingPresentation />}><% } %>
      <<%= name %>Presentation />
    <% if (gen_files.includes("Loading")) { %></Suspense><% } %>
  <% if (gen_files.includes("Error")) { %></ErrorBoundary><% } %>
);


