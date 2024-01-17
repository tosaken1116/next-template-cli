---
to: "<%= `src/components/model/${name}/repository/index.ts` %>"
---
import type { <%= name %> } from "../type";
import { get<%= name %> } from "./get";

type I<%= name %>Repository = {};

export const createNew<%= name %>Repository = ():I<%= name %>Repository => {
  return {};
}