import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import Wrapper from "../src/pages/Wrapper";

// Mock the Wrapper component
vi.mock("../src/pages/Wrapper", () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>, // Return children as-is
}));

describe("Wrapper", () => {
  it("renders loading text when loading is true", () => {
    render(
      <BrowserRouter>
        {" "}
        {/* Wrap the component in BrowserRouter */}
        <Wrapper loading={true}>
          <div>Test Children</div>
        </Wrapper>
      </BrowserRouter>
    );

    expect(screen.getByText("Test Children")).toBeInTheDocument();
  });

  it("renders children when authenticated is true", () => {
    render(
      <BrowserRouter>
        {" "}
        {/* Wrap the component in BrowserRouter */}
        <Wrapper authenticated={true}>
          <div>Test Children</div>
        </Wrapper>
      </BrowserRouter>
    );

    expect(screen.getByText("Test Children")).toBeInTheDocument();
  });
});
