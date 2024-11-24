import { render } from "@testing-library/react";
import { Button } from "./button";

describe("Button", () => {
  test("Should be rendered", () => {
    const { container } = render(<Button>Hello world</Button>);

    expect(container.querySelector("button")).toBeInTheDocument();
  });
});
