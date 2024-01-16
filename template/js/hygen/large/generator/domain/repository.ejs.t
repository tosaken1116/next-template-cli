---
to: "<%= `src/components/model/${name}/repository/index.js` %>"
---
import { get<%= name %> } from "./get";

export const createNew<%= name %>Repository = () => ({
    get<%= name %>
});
