export const getElements = () => ({
  colorsBox: document.querySelectorAll(".game__board-box") as NodeList,
  btnsDifficulty: document.querySelectorAll(".game__modes-btn-mode") as NodeList,
  btnStart: document.querySelector(
    ".game__actions-header-btn-start"
  ) as HTMLButtonElement,
  whoPlaysElement: document.querySelector(".game__actions-header-text-start") as HTMLHeadingElement,
  scoreElement: document.querySelector(".game__actions-header-text-score") as HTMLHeadingElement,
});
