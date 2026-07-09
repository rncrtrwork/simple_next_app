import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("enters local replay mode when no API base URL is configured", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("STREAM: LOCAL REPLAY")).toBeInTheDocument();
    });

    expect(screen.getByText("TENANT WALL: ENFORCED")).toBeInTheDocument();
    expect(screen.getByText("Atlas Rail HoldCo")).toBeInTheDocument();
  });
});
