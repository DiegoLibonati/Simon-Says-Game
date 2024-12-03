export const getElements = () => ({
  colorsBox: document.querySelectorAll(".box_color") as NodeList,
  btnsDifficulty: document.querySelectorAll(".btnDif") as NodeList,
  btnStart: document.querySelector(
    ".section_start_row1 button"
  ) as HTMLButtonElement,
  whoPlaysElement: document.querySelector(".whoPlays") as HTMLHeadingElement,
  scoreElement: document.querySelector(".score") as HTMLHeadingElement,
});
