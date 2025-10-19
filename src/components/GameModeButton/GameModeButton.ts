import { GameModeButtonProps } from "@src/entities/props";

import "@src/components/GameModeButton/GameModeButton.css";

export const GameModeButton = ({
  id,
  ariaLabel,
  children,
  onClick,
}: GameModeButtonProps): HTMLButtonElement => {
  const button = document.createElement("button");
  button.id = id;
  button.type = "button";
  button.className = "game-mode-button";
  button.setAttribute("aria-label", ariaLabel);

  button.innerHTML = children ?? "";

  button.addEventListener("click", onClick);

  return button;
};
