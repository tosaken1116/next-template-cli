---
to: "<%= `src/components/model/${name}/repository/get.js` %>"
---
export const get<%= name %> = ():<%= name %> => {
  return { id: "1" };
};
