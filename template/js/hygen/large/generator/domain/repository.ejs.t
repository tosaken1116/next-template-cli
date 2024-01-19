---
to: "<%= `src/components/domains/${name}/repository/index.js` %>"
---
import { get<%= name %> } from "./get";

export const createNew<%= name %>Repository = () => ({
    get<%= name %>
});
