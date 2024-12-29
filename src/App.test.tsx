import { screen, render } from "@testing-library/react";
import App from "./App";
import { client } from "./axios";

const getTweets = vi.spyOn(client, "get");

describe("App", () => {
  it("renders tweets", async () => {
    getTweets.mockResolvedValue({
      data: [{ id: 1, content: "Hello, world!", updatedAt: "now", userId: 1 }],
    });
    render(<App />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(getTweets).toHaveBeenCalledWith("/api/tweets");
    expect(await screen.findByText("Hello, world!")).toBeInTheDocument();
  });

  it("handles errors", async () => {
    getTweets.mockRejectedValue(new Error("Ooops!"));
    render(<App />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(getTweets).toHaveBeenCalledWith("/api/tweets");
    expect(await screen.findByText("Ooops!")).toBeInTheDocument();
  });
});
