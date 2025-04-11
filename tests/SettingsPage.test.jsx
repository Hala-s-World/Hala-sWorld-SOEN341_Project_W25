import { render, fireEvent } from "@testing-library/react";
import SettingsPage from "../src/pages/SettingsPage";
import { vi } from "vitest";

// Mock the supabaseClient and the functions it uses
vi.mock("../src/helper/supabaseAPI", () => ({
  getUserProfile: vi.fn().mockResolvedValue({
    username: "testUser",
    full_name: "Test User",
    bio: "This is a bio",
    avatar_url: "http://example.com/avatar.jpg",
  }),
}));

vi.mock("../src/helper/supabaseClient", () => ({
  default: {
    storage: {
      from: () => ({
        upload: vi.fn().mockResolvedValue({
          data: { path: "public/test-user-avatar" },
          error: null,
        }),
        getPublicUrl: vi.fn().mockResolvedValue({
          data: { publicUrl: "http://example.com/avatar.jpg" },
          error: null,
        }),
      }),
    },
    from: () => ({
      upsert: vi.fn().mockResolvedValue({ error: null }),
    }),
  },
}));

// Mock the useAuthStore hook to simulate user state
vi.mock("../src/store/authStore", () => ({
  useAuthStore: () => ({
    user: { id: "test-user-id" }, // Simulating a logged-in user
  }),
}));

describe("SettingsPage", () => {
  it("renders correctly and simulates saving profile", async () => {
    const { container, getByText, getByPlaceholderText } = render(
      <SettingsPage />
    );

    // Interaction with checking the function behavior
    const usernameInput = getByPlaceholderText("Username");
    const fullNameInput = getByPlaceholderText("Full Name");
    const bioInput = getByPlaceholderText("Bio");
    const saveButton = getByText("Save");

    fireEvent.change(usernameInput, { target: { value: "testUserUpdated" } });
    fireEvent.change(fullNameInput, { target: { value: "Test User Updated" } });
    fireEvent.change(bioInput, { target: { value: "Updated bio text" } });

    fireEvent.click(saveButton);

    // Simulate a save
    await new Promise((resolve) => setTimeout(resolve, 1000));

    expect(container.innerHTML.includes("Save")).toBe(true);
  });

  it("renders a default avatar when no avatar is selected", async () => {
    const { container } = render(<SettingsPage />);

    // Make the avatar renders
    const avatar = container.querySelector(".sp-avatar-preview");
    expect(avatar).toHaveAttribute(
      "src",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZ0FpBg5Myb9CQ-bQpFou9BY9JXoRG6208_Q&s"
    );
  });
});
