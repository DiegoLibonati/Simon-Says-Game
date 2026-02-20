import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import type { GameModeButtonProps } from "@/types/props";
import type { GameModeButtonComponent } from "@/types/components";

import { GameModeButton } from "@/components/GameModeButton/GameModeButton";

const renderComponent = (
  props: GameModeButtonProps
): GameModeButtonComponent => {
  const container = GameModeButton(props);
  document.body.appendChild(container);
  return container;
};

describe("GameModeButton Component", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  const mockOnClick = jest.fn();

  const defaultProps: GameModeButtonProps = {
    id: "easy",
    ariaLabel: "easy mode",
    children: "EASY",
    onClick: mockOnClick,
  };

  it("should render button with correct attributes", () => {
    renderComponent(defaultProps);

    const button = screen.getByRole("button", { name: "easy mode" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("id", "easy");
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveClass("game-mode-button");
    expect(button.innerHTML).toBe("EASY");
  });

  it("should call onClick handler when clicked", async () => {
    const user = userEvent.setup();
    renderComponent(defaultProps);

    const button = screen.getByRole("button", { name: "easy mode" });
    await user.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("should render different game modes", () => {
    const hardProps: GameModeButtonProps = {
      id: "hard",
      ariaLabel: "hard mode",
      children: "HARD",
      onClick: mockOnClick,
    };

    renderComponent(hardProps);

    const button = screen.getByRole("button", { name: "hard mode" });
    expect(button).toHaveAttribute("id", "hard");
    expect(button.innerHTML).toBe("HARD");
  });

  it("should cleanup event listener", async () => {
    const user = userEvent.setup();
    const button = renderComponent(defaultProps);

    button.cleanup?.();

    const buttonElement = screen.getByRole("button", { name: "easy mode" });
    await user.click(buttonElement);

    expect(mockOnClick).not.toHaveBeenCalled();
  });
});
