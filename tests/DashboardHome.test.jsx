import { render, fireEvent } from "@testing-library/react";
import DashboardHome from "../src/pages/DashboardHome";

// Mock AddChannel and InvitesList to simplify the test
vi.mock("../src/assets/components/AddChannel", () => ({
  default: () => <div>Add Channel Component</div>,
}));

vi.mock("../src/assets/components/InvitesList", () => ({
  default: () => <div>Invites List Component</div>,
}));

describe("DashboardHome", () => {
  it("renders Add Channel button", () => {
    render(<DashboardHome />);
    // Check if the "Add a private channel" button is rendered
    const button = document.querySelector(".add-channel");
    expect(button).toBeInTheDocument();
  });

  it("opens and closes modal on button click", () => {
    const { getByText, queryByText } = render(<DashboardHome />);

    // Check if modal content is not present initially
    expect(queryByText("Add New Channel")).toBeNull();

    // Click the "Add a private channel" button to open the modal
    fireEvent.click(getByText("Add a private channel"));

    // Check if the modal content is now visible
    expect(queryByText("Add New Channel")).toBeInTheDocument();

    // Click the "Cancel" button to close the modal
    fireEvent.click(getByText("Cancel"));

    // Check if the modal is closed
    expect(queryByText("Add New Channel")).toBeNull();
  });

  it("renders InvitesList component", () => {
    const { getByText } = render(<DashboardHome />);
    // Check if InvitesList component is rendered
    expect(getByText("Invites List Component")).toBeInTheDocument();
  });
});
