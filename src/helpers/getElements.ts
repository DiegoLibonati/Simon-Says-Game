export const getElements = () => ({
  colorsBox: document.querySelectorAll(".box__color") as NodeList,
  btnsDifficulty: document.querySelectorAll(".btn__mode") as NodeList,
  btnStart: document.querySelector(
    ".game__btns__header button"
  ) as HTMLButtonElement,
  whoPlaysElement: document.querySelector(".text__start") as HTMLHeadingElement,
  scoreElement: document.querySelector(".score") as HTMLHeadingElement,
});
