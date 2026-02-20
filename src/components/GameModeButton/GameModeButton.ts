import type { GameModeButtonProps } from "@/types/props";
import type { GameModeButtonComponent } from "@/types/components";

import "@/components/GameModeButton/GameModeButton.css";

export const GameModeButton = ({
  id,
  ariaLabel,
  children,
  onClick,
}: GameModeButtonProps): GameModeButtonComponent => {
  const button = document.createElement("button") as GameModeButtonComponent;
  button.id = id;
  button.type = "button";
  button.className = "game-mode-button";
  button.setAttribute("aria-label", ariaLabel);

  button.innerHTML = children ?? "";

  button.addEventListener("click", onClick);

  button.cleanup = (): void => {
    button.removeEventListener("click", onClick);
  };

  return button;
};
