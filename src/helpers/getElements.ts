export const getElements = () => ({
  colorsBox: document.querySelectorAll(".game__box") as NodeList,
  btnsDifficulty: document.querySelectorAll(".game__btn-mode") as NodeList,
  btnStart: document.querySelector(
    ".game__btn-start"
  ) as HTMLButtonElement,
  whoPlaysElement: document.querySelector(".game__label-start") as HTMLHeadingElement,
  scoreElement: document.querySelector(".game__score") as HTMLHeadingElement,
});
