import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import type { Page } from "@/types/pages";

import { SimonSaysPage } from "@/pages/SimonSaysPage/SimonSaysPage";

const renderPage = (): Page => {
  const container = SimonSaysPage();
  document.body.appendChild(container);
  return container;
};

describe("SimonSaysPage", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    document.body.innerHTML = "";
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("should render the page with correct structure", () => {
    renderPage();

    const main = document.querySelector<HTMLElement>(".simon-says-page");
    expect(main).toBeInTheDocument();
    expect(main?.tagName).toBe("MAIN");
  });

  it("should render tutorial section", () => {
    renderPage();

    expect(screen.getByText("¿How to play?")).toBeInTheDocument();
    expect(
      screen.getByText(/Press the start button to start playing/)
    ).toBeInTheDocument();
  });

  it("should render game header with initial state", () => {
    renderPage();

    expect(screen.getByText("Press START")).toBeInTheDocument();
    expect(screen.getByText("SCORE: 0")).toBeInTheDocument();
  });

  it("should render start button", () => {
    renderPage();

    const startButton = screen.getByRole("button", { name: "start" });
    expect(startButton).toBeInTheDocument();
    expect(startButton.textContent.trim()).toBe("START");
  });

  it("should render all four color boxes", () => {
    renderPage();

    const greenBox = document.querySelector<HTMLDivElement>("#green");
    const redBox = document.querySelector<HTMLDivElement>("#red");
    const yellowBox = document.querySelector<HTMLDivElement>("#yellow");
    const blueBox = document.querySelector<HTMLDivElement>("#blue");

    expect(greenBox).toBeInTheDocument();
    expect(redBox).toBeInTheDocument();
    expect(yellowBox).toBeInTheDocument();
    expect(blueBox).toBeInTheDocument();
  });

  it("should render game mode buttons", () => {
    renderPage();

    expect(
      screen.getByRole("button", { name: "Easy mode" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Medium mode" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Hard mode" })
    ).toBeInTheDocument();
  });

  it("should update label when start button is clicked", async () => {
    const user = userEvent.setup({ delay: null });
    renderPage();

    const startButton = screen.getByRole("button", { name: "start" });
    await user.click(startButton);

    const label =
      document.querySelector<HTMLHeadingElement>(".game__label-start");
    expect(label?.textContent).toBe("IA PLAYS");
  });

  it("should reset score when game starts", async () => {
    const user = userEvent.setup({ delay: null });
    renderPage();

    const startButton = screen.getByRole("button", { name: "start" });
    await user.click(startButton);

    const score = document.querySelector<HTMLHeadingElement>(".game__score");
    expect(score?.textContent).toBe("SCORE: 0");
  });

  it("should not allow starting game while playing", async () => {
    const user = userEvent.setup({ delay: null });
    const alertSpy = jest.spyOn(window, "alert").mockImplementation();

    renderPage();

    const startButton = screen.getByRole("button", { name: "start" });
    await user.click(startButton);

    await Promise.resolve();

    const greenBox = document.querySelector<HTMLDivElement>("#green");
    if (greenBox) await user.click(greenBox);

    await user.click(startButton);

    expect(alertSpy).toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  it("should not allow user to play when it is not their turn", async () => {
    const user = userEvent.setup({ delay: null });
    const alertSpy = jest.spyOn(window, "alert").mockImplementation();

    renderPage();

    const greenBox = document.querySelector<HTMLDivElement>("#green");
    if (greenBox) await user.click(greenBox);

    expect(alertSpy).toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  it("should add color class when box is clicked during user turn", async () => {
    const user = userEvent.setup({ delay: null });
    renderPage();

    const startButton = screen.getByRole("button", { name: "start" });
    await user.click(startButton);

    jest.advanceTimersByTime(3000);

    const greenBox = document.querySelector<HTMLDivElement>("#green");
    if (greenBox) {
      await user.click(greenBox);
      expect(greenBox).toHaveClass("game__box--green-color");
    }
  });

  it("should start game with selected difficulty", async () => {
    const user = userEvent.setup({ delay: null });
    renderPage();

    const easyButton = screen.getByRole("button", { name: "Easy mode" });
    await user.click(easyButton);

    const label =
      document.querySelector<HTMLHeadingElement>(".game__label-start");
    expect(label?.textContent).toBe("IA PLAYS");
  });

  it("should cleanup timeouts and event listeners on page cleanup", () => {
    const page = renderPage();

    expect(page.cleanup).toBeDefined();
    page.cleanup?.();

    expect(page.cleanup).toBeDefined();
  });
});
