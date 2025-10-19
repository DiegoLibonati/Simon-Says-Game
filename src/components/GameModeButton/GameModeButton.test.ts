import { screen } from "@testing-library/dom";
import user from "@testing-library/user-event";

import { GameModeButtonProps } from "@src/entities/props";

import { GameModeButton } from "@src/components/GameModeButton/GameModeButton";

type RenderComponent = {
  container: HTMLButtonElement;
  props: GameModeButtonProps;
};

const renderComponent = (
  custom?: Partial<GameModeButtonProps>
): RenderComponent => {
  const props: GameModeButtonProps = {
    id: "easyMode",
    ariaLabel: "select easy mode",
    children: "<span>Easy Mode</span>",
    onClick: jest.fn(),
    ...custom,
  };

  const container = GameModeButton(props);
  document.body.appendChild(container);

  return { container: container, props: props };
};

describe("GameModeButton.ts", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    jest.clearAllMocks();
  });

  describe("General Tests.", () => {
    test("It should render a button element with correct id, class, and aria-label", () => {
      const { container, props } = renderComponent();

      expect(container).toBeInstanceOf(HTMLButtonElement);
      expect(container.id).toBe(props.id);
      expect(container.className).toBe("game-mode-button");
      expect(container.getAttribute("aria-label")).toBe(props.ariaLabel);
    });

    test("It should render the innerHTML correctly based on children", () => {
      renderComponent();

      const innerSpan = screen.getByText("Easy Mode");
      expect(innerSpan).toBeInTheDocument();
    });

    test("It should render empty innerHTML if no children provided", () => {
      const { container } = renderComponent({ children: undefined });
      expect(container.innerHTML).toBe("");
    });
  });

  describe("Interaction Tests.", () => {
    test("It should call onClick when clicked", async () => {
      const { container, props } = renderComponent();
      await user.click(container);
      expect(props.onClick).toHaveBeenCalledTimes(1);
    });

    test("It should not throw if onClick is not provided", async () => {
      const { container } = renderComponent({ onClick: undefined });
      expect(() => user.click(container)).not.toThrow();
    });
  });
});
