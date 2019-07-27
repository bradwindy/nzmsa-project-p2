import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { create } from "react-test-renderer";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe("App Button Match", () => {
  test("Testing app button", () => {
    const tree = create(<App />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});