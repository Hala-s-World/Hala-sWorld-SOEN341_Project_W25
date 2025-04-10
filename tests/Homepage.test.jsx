import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Homepage from "../src/pages/Homepage";
import { BrowserRouter } from "react-router-dom";

// ✅ Fix: Return object with "default" key
vi.mock("../src/assets/media/logo.png", () => ({
  default: "mock-logo",
}));
vi.mock("../src/assets/media/cat.jpg", () => ({
  default: "mock-cat",
}));

describe("Homepage", () => {
  it("renders homepage with hero title and navigation links", () => {
    render(
      <BrowserRouter>
        <Homepage />
      </BrowserRouter>
    );

    expect(screen.getByText("C H A T H A V E N")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Features")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Get Started")).toBeInTheDocument();
  });
});
