---
to: "<%= `src/components/domains/${name}/repository/get.js` %>"
---
export const get<%= name %> = ():<%= name %> => {
  return { id: "1" };
};
