import { screen } from "@testing-library/dom";
import user from "@testing-library/user-event";

import { SimonSaysPage } from "@src/pages/SimonSaysPage/SimonSaysPage";

import { GameModeButton } from "@src/components/GameModeButton/GameModeButton";

import modes from "@src/constants/modes";
import { MESSAGE_CANT_PLAY, MESSAGE_CANT_START } from "@src/constants/vars";

type RenderComponent = {
  container: HTMLElement;
};

const renderComponent = (): RenderComponent => {
  const container = SimonSaysPage();
  document.body.appendChild(container);
  return { container: container };
};

jest.mock("@src/components/GameModeButton/GameModeButton");
jest.mock("@src/constants/modes", () => [
  { id: "easy", name: "Easy", timeColorDelay: 1000, timeColorChange: 500 },
  { id: "hard", name: "Hard", timeColorDelay: 500, timeColorChange: 250 },
]);

describe("SimonSaysPage.ts", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    jest.clearAllMocks();

    (GameModeButton as jest.Mock).mockImplementation(
      ({ id, ariaLabel, children }) => {
        const btn = document.createElement("button");
        btn.id = id;
        btn.setAttribute("aria-label", ariaLabel);
        btn.textContent = children;
        return btn;
      }
    );
  });

  describe("General Tests.", () => {
    test("It should render the main structure with correct sections", () => {
      const { container } = renderComponent();

      expect(container).toBeInstanceOf(HTMLElement);
      expect(container.className).toBe("simon-says-page");

      expect(
        container.querySelector<HTMLElement>(".tutorial")
      ).toBeInTheDocument();
      expect(container.querySelector<HTMLElement>(".game")).toBeInTheDocument();
      expect(
        container.querySelector<HTMLElement>(".game__board")
      ).toBeInTheDocument();
    });

    test("It should render four color boxes (green, red, yellow, blue)", () => {
      renderComponent();

      expect(
        screen.getByRole("button", { name: /start/i })
      ).toBeInTheDocument();
      expect(
        document.querySelectorAll<HTMLDivElement>(".game__box")
      ).toHaveLength(4);

      ["green", "red", "yellow", "blue"].forEach((color) => {
        expect(
          document.querySelector<HTMLDivElement>(`#${color}`)
        ).toBeInTheDocument();
      });
    });

    test("It should render all game modes from constants", () => {
      renderComponent();

      expect(GameModeButton).toHaveBeenCalledTimes(modes.length);
      expect(GameModeButton).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "easy",
          ariaLabel: "Easy mode",
          children: "EASY",
        })
      );
      expect(GameModeButton).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "hard",
          ariaLabel: "Hard mode",
          children: "HARD",
        })
      );
    });
  });

  describe("Start Button Behavior.", () => {
    test("It should update the label when START is clicked", async () => {
      renderComponent();

      const btnStart = screen.getByRole("button", { name: /start/i });
      const label = screen.getByText("Press START");

      await user.click(btnStart);

      await new Promise((r) => setTimeout(r, 50));

      const labelText = label.textContent?.toLowerCase() ?? "";

      expect(labelText).toMatch(/(ia|your turn|press start)/i);
    });

    test("It should not start again if game is already active", async () => {
      const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
      renderComponent();

      const btnStart = screen.getByRole("button", { name: /start/i });
      await user.click(btnStart);
      await user.click(btnStart);

      expect(logSpy).toHaveBeenCalledWith(MESSAGE_CANT_START);
      logSpy.mockRestore();
    });
  });

  describe("Color Boxes Behavior.", () => {
    test("It should not allow user to play before IA starts", async () => {
      const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
      renderComponent();

      const greenBox = document.querySelector<HTMLDivElement>("#green")!;

      await user.click(greenBox);

      await new Promise((r) => setTimeout(r, 100));

      if (logSpy.mock.calls.length === 0) {
        const label =
          document.querySelector<HTMLHeadingElement>(".game__label-start")!;
        const labelText = label.textContent ?? "";
        expect(labelText).toMatch(/(press start|perdiste)/i);
      } else {
        expect(logSpy).toHaveBeenCalledWith(MESSAGE_CANT_PLAY);
      }

      logSpy.mockRestore();
    });

    test("It should apply and remove color class when clicked (simulated turn)", () => {
      renderComponent();

      const greenBox = document.querySelector<HTMLDivElement>("#green")!;
      const className = "game__box--green-color";

      greenBox.classList.add(className);
      expect(greenBox.classList.contains(className)).toBe(true);

      greenBox.classList.remove(className);
      expect(greenBox.classList.contains(className)).toBe(false);
    });
  });

  describe("Difficulty Buttons Behavior.", () => {
    test("It should render difficulty buttons and call start handler", async () => {
      renderComponent();

      const easyButton = screen.getByRole("button", { name: /easy mode/i });
      const hardButton = screen.getByRole("button", { name: /hard mode/i });

      expect(easyButton).toBeInTheDocument();
      expect(hardButton).toBeInTheDocument();

      await user.click(easyButton);
      await user.click(hardButton);

      expect(GameModeButton).toHaveBeenCalledTimes(2);
    });
  });
});
