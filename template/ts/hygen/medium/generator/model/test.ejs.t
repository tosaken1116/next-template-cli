---
to: src/components/<%= name %>/index.test.tsx
---
import { render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";
import { <%= name %> } from ".";

describe("<%= name %>", () => {
  it("title is exist", () => {
    render(<<%= name %> />);

    const title = screen.getByText(/this is <%= name %> component/);

    expect(title).toBeInTheDocument();
  });
});