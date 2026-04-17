import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import type { GameModeButtonProps } from "@/types/props";
import type { GameModeButtonComponent } from "@/types/components";

import GameModeButton from "@/components/GameModeButton/GameModeButton";

const mockOnClick = jest.fn();

const defaultProps: GameModeButtonProps = {
  id: "easy",
  ariaLabel: "Easy mode",
  children: "EASY",
  onClick: mockOnClick,
};

const renderComponent = (
  props: Partial<GameModeButtonProps> = {}
): GameModeButtonComponent => {
  const element = GameModeButton({ ...defaultProps, ...props });
  document.body.appendChild(element);
  return element;
};

describe("GameModeButton", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("rendering", () => {
    it("should render a button element", () => {
      renderComponent();
      expect(
        screen.getByRole("button", { name: "Easy mode" })
      ).toBeInTheDocument();
    });

    it("should have the correct id", () => {
      renderComponent();
      expect(screen.getByRole("button", { name: "Easy mode" })).toHaveAttribute(
        "id",
        "easy"
      );
    });

    it("should have the game-mode-button class", () => {
      renderComponent();
      expect(screen.getByRole("button", { name: "Easy mode" })).toHaveClass(
        "game-mode-button"
      );
    });

    it("should have type button", () => {
      renderComponent();
      expect(screen.getByRole("button", { name: "Easy mode" })).toHaveAttribute(
        "type",
        "button"
      );
    });

    it("should display children as text content", () => {
      renderComponent();
      expect(
        screen.getByRole("button", { name: "Easy mode" })
      ).toHaveTextContent("EASY");
    });

    it("should render empty content when children is not provided", () => {
      const element = GameModeButton({
        id: "easy",
        ariaLabel: "Easy mode",
        onClick: mockOnClick,
      });
      document.body.appendChild(element);
      expect(
        screen.getByRole("button", { name: "Easy mode" })
      ).toHaveTextContent("");
    });
  });

  describe("behavior", () => {
    it("should call onClick when clicked", async () => {
      const user = userEvent.setup();
      renderComponent();
      await user.click(screen.getByRole("button", { name: "Easy mode" }));
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("should not call onClick before being clicked", () => {
      renderComponent();
      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it("should call onClick with the mouse event", async () => {
      const user = userEvent.setup();
      renderComponent();
      await user.click(screen.getByRole("button", { name: "Easy mode" }));
      expect(mockOnClick).toHaveBeenCalledWith(expect.any(MouseEvent));
    });
  });

  describe("cleanup", () => {
    it("should have a cleanup method", () => {
      const element = renderComponent();
      expect(element.cleanup).toBeDefined();
    });

    it("should stop calling onClick after cleanup", async () => {
      const user = userEvent.setup();
      const element = renderComponent();
      element.cleanup?.();
      await user.click(screen.getByRole("button", { name: "Easy mode" }));
      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });
});
