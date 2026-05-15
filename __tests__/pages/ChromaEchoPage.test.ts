import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import type { Page } from "@/types/pages";

import ChromaEchoPage from "@/pages/ChromaEchoPage/ChromaEchoPage";

import { MESSAGE_CANT_PLAY, MESSAGE_CANT_START } from "@/constants/vars";

import { mockModes } from "@tests/__mocks__/modes.mock";

jest.mock("@/constants/modes", () => {
  const mockData = jest.requireActual("@tests/__mocks__/modes.mock");
  const { mockModes } = mockData;
  return {
    __esModule: true,
    default: mockModes,
  };
});

const renderPage = (): Page => {
  const element = ChromaEchoPage();
  document.body.appendChild(element);
  return element;
};

describe("ChromaEchoPage", () => {
  let mockAlert: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    mockAlert = jest.spyOn(window, "alert").mockImplementation(() => {
      // empty fn
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
    document.body.innerHTML = "";
  });

  describe("rendering", () => {
    it("should render the main page element with correct class", () => {
      const page = renderPage();
      expect(page).toHaveClass("chroma-echo-page");
    });

    it("should display SCORE: 0 initially", () => {
      renderPage();
      expect(screen.getByText("SCORE: 0")).toBeInTheDocument();
    });

    it("should display Press START label initially", () => {
      renderPage();
      expect(screen.getByText("Press START")).toBeInTheDocument();
    });

    it("should render the start button", () => {
      renderPage();
      expect(
        screen.getByRole("button", { name: "Start game" })
      ).toBeInTheDocument();
    });

    it("should render the start button with text START", () => {
      renderPage();
      expect(
        screen.getByRole("button", { name: "Start game" })
      ).toHaveTextContent("START");
    });

    it("should render mode buttons from config", () => {
      renderPage();
      mockModes.forEach((mode) => {
        expect(
          screen.getByRole("button", { name: `${mode.name} mode` })
        ).toBeInTheDocument();
      });
    });

    it("should render four color boxes", () => {
      const page = renderPage();
      const colorBoxes = page.querySelectorAll<HTMLDivElement>(".game__box");
      expect(colorBoxes).toHaveLength(4);
    });

    it("should render color boxes with correct ids", () => {
      const page = renderPage();
      expect(page.querySelector<HTMLDivElement>("#green")).toBeInTheDocument();
      expect(page.querySelector<HTMLDivElement>("#red")).toBeInTheDocument();
      expect(page.querySelector<HTMLDivElement>("#yellow")).toBeInTheDocument();
      expect(page.querySelector<HTMLDivElement>("#blue")).toBeInTheDocument();
    });

    it("should render the tutorial section", () => {
      const page = renderPage();
      expect(page.querySelector<HTMLElement>(".tutorial")).toBeInTheDocument();
    });

    it("should render the how to play heading", () => {
      renderPage();
      expect(
        screen.getByRole("heading", { name: "¿How to play?" })
      ).toBeInTheDocument();
    });

    it("should render the tutorial description text", () => {
      renderPage();
      expect(
        screen.getByText(/Press the start button to start playing/i)
      ).toBeInTheDocument();
    });
  });

  describe("start button", () => {
    it("should change label to IA PLAYS when start is clicked", async () => {
      const user = userEvent.setup({ delay: null });
      renderPage();
      await user.click(screen.getByRole("button", { name: "Start game" }));
      expect(screen.getByText("IA PLAYS")).toBeInTheDocument();
    });

    it("should keep score at SCORE: 0 when start is clicked", async () => {
      const user = userEvent.setup({ delay: null });
      renderPage();
      await user.click(screen.getByRole("button", { name: "Start game" }));
      expect(screen.getByText("SCORE: 0")).toBeInTheDocument();
    });

    it("should show ITS YOUR TURN after IA finishes playing", async () => {
      const user = userEvent.setup({ delay: null });
      renderPage();
      await user.click(screen.getByRole("button", { name: "Start game" }));
      await jest.advanceTimersByTimeAsync(3000);
      expect(screen.getByText("ITS YOUR TURN!")).toBeInTheDocument();
    });

    it("should show alert when start is clicked while user is playing", async () => {
      const user = userEvent.setup({ delay: null });
      renderPage();
      await user.click(screen.getByRole("button", { name: "Start game" }));
      await jest.advanceTimersByTimeAsync(3000);
      await user.click(screen.getByRole("button", { name: "Start game" }));
      expect(mockAlert).toHaveBeenCalledWith(MESSAGE_CANT_START);
    });
  });

  describe("mode buttons", () => {
    it("should start the game when a mode button is clicked", async () => {
      const user = userEvent.setup({ delay: null });
      renderPage();
      await user.click(screen.getByRole("button", { name: "Easy mode" }));
      expect(screen.getByText("IA PLAYS")).toBeInTheDocument();
    });

    it("should show alert when mode button is clicked while user is playing", async () => {
      const user = userEvent.setup({ delay: null });
      renderPage();
      await user.click(screen.getByRole("button", { name: "Start game" }));
      await jest.advanceTimersByTimeAsync(3000);
      await user.click(screen.getByRole("button", { name: "Easy mode" }));
      expect(mockAlert).toHaveBeenCalledWith(MESSAGE_CANT_START);
    });
  });

  describe("color boxes", () => {
    it("should show alert when color box is clicked before user turn", async () => {
      const user = userEvent.setup({ delay: null });
      const page = renderPage();
      const greenBox = page.querySelector<HTMLDivElement>("#green")!;
      await user.click(greenBox);
      expect(mockAlert).toHaveBeenCalledWith(MESSAGE_CANT_PLAY);
    });

    it("should show PERDISTE when wrong color is clicked", async () => {
      jest.spyOn(Math, "random").mockReturnValue(0);
      const user = userEvent.setup({ delay: null });
      const page = renderPage();
      await user.click(screen.getByRole("button", { name: "Start game" }));
      await jest.advanceTimersByTimeAsync(3000);
      const redBox = page.querySelector<HTMLDivElement>("#red")!;
      await user.click(redBox);
      expect(screen.getByText("PERDISTE")).toBeInTheDocument();
    });

    it("should increment score after correct sequence", async () => {
      jest.spyOn(Math, "random").mockReturnValue(0);
      const user = userEvent.setup({ delay: null });
      const page = renderPage();
      await user.click(screen.getByRole("button", { name: "Start game" }));
      await jest.advanceTimersByTimeAsync(3000);
      const greenBox = page.querySelector<HTMLDivElement>("#green")!;
      await user.click(greenBox);
      await jest.advanceTimersByTimeAsync(500);
      expect(screen.getByText("SCORE: 1")).toBeInTheDocument();
    });

    it("should add color highlight class when user clicks a color box during turn", async () => {
      jest.spyOn(Math, "random").mockReturnValue(0);
      const user = userEvent.setup({ delay: null });
      const page = renderPage();

      await user.click(screen.getByRole("button", { name: "Start game" }));
      await jest.advanceTimersByTimeAsync(3000);

      const greenBox = page.querySelector<HTMLDivElement>("#green")!;
      await user.click(greenBox);

      expect(greenBox).toHaveClass("game__box--green-color");
    });

    it("should remove the color highlight class after 100ms", async () => {
      jest.spyOn(Math, "random").mockReturnValue(0);
      const user = userEvent.setup({ delay: null });
      const page = renderPage();

      await user.click(screen.getByRole("button", { name: "Start game" }));
      await jest.advanceTimersByTimeAsync(3000);

      const greenBox = page.querySelector<HTMLDivElement>("#green")!;
      await user.click(greenBox);
      await jest.advanceTimersByTimeAsync(100);

      expect(greenBox).not.toHaveClass("game__box--green-color");
    });
  });

  describe("ia color highlight", () => {
    it("should add color highlight class to the selected color box during IA turn", async () => {
      jest.spyOn(Math, "random").mockReturnValue(0);
      const user = userEvent.setup({ delay: null });
      const page = renderPage();

      await user.click(screen.getByRole("button", { name: "Start game" }));

      const greenBox = page.querySelector<HTMLDivElement>("#green")!;
      expect(greenBox).toHaveClass("game__box--green-color");
    });

    it("should remove the color highlight class after timeColorChange", async () => {
      jest.spyOn(Math, "random").mockReturnValue(0);
      const user = userEvent.setup({ delay: null });
      const page = renderPage();

      await user.click(screen.getByRole("button", { name: "Start game" }));
      await jest.advanceTimersByTimeAsync(500);

      const greenBox = page.querySelector<HTMLDivElement>("#green")!;
      expect(greenBox).not.toHaveClass("game__box--green-color");
    });
  });

  describe("game progression", () => {
    it("should restart the game after losing", async () => {
      jest.spyOn(Math, "random").mockReturnValue(0);
      const user = userEvent.setup({ delay: null });
      const page = renderPage();

      await user.click(screen.getByRole("button", { name: "Start game" }));
      await jest.advanceTimersByTimeAsync(3000);
      const redBox = page.querySelector<HTMLDivElement>("#red")!;
      await user.click(redBox);
      expect(screen.getByText("PERDISTE")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Start game" }));
      expect(screen.getByText("IA PLAYS")).toBeInTheDocument();
      expect(screen.getByText("SCORE: 0")).toBeInTheDocument();
    });

    it("should increment score to 2 after two correct sequences", async () => {
      jest.spyOn(Math, "random").mockReturnValue(0);
      const user = userEvent.setup({ delay: null });
      const page = renderPage();
      const greenBox = page.querySelector<HTMLDivElement>("#green")!;

      await user.click(screen.getByRole("button", { name: "Start game" }));
      await jest.advanceTimersByTimeAsync(3000);
      await user.click(greenBox);
      await jest.advanceTimersByTimeAsync(500);
      expect(screen.getByText("SCORE: 1")).toBeInTheDocument();

      await jest.advanceTimersByTimeAsync(3000);
      expect(screen.getByText("ITS YOUR TURN!")).toBeInTheDocument();

      await user.click(greenBox);
      await user.click(greenBox);
      await jest.advanceTimersByTimeAsync(500);
      expect(screen.getByText("SCORE: 2")).toBeInTheDocument();
    });
  });

  describe("cleanup", () => {
    it("should have a cleanup method", () => {
      const page = renderPage();
      expect(page.cleanup).toBeDefined();
    });

    it("should not respond to start button click after cleanup", async () => {
      const user = userEvent.setup({ delay: null });
      const page = renderPage();
      page.cleanup?.();
      await user.click(screen.getByRole("button", { name: "Start game" }));
      expect(screen.queryByText("IA PLAYS")).not.toBeInTheDocument();
    });

    it("should not show alert on color box click after cleanup", async () => {
      const user = userEvent.setup({ delay: null });
      const page = renderPage();
      page.cleanup?.();
      const greenBox = page.querySelector<HTMLDivElement>("#green")!;
      await user.click(greenBox);
      expect(mockAlert).not.toHaveBeenCalled();
    });

    it("should not respond to mode button click after cleanup", async () => {
      const user = userEvent.setup({ delay: null });
      const page = renderPage();
      page.cleanup?.();
      await user.click(screen.getByRole("button", { name: "Easy mode" }));
      expect(screen.queryByText("IA PLAYS")).not.toBeInTheDocument();
    });

    it("should clear pending timeouts on cleanup", async () => {
      const user = userEvent.setup({ delay: null });
      const page = renderPage();

      await user.click(screen.getByRole("button", { name: "Start game" }));
      expect(screen.getByText("IA PLAYS")).toBeInTheDocument();

      page.cleanup?.();
      await jest.advanceTimersByTimeAsync(5000);

      expect(screen.queryByText("ITS YOUR TURN!")).not.toBeInTheDocument();
    });
  });
});
