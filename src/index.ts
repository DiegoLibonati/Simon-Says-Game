import { arraysToBeEqual } from "./helpers/arraysToBeEqual";
import { getElements } from "./helpers/getElements";

import {
  MESSAGE_CANT_PLAY,
  MESSAGE_CANT_START,
  valuesCanPlayIA,
} from "./constants/constants";

// New Keys
let score: number;

let userPlaying: boolean;
let iaPlaying: boolean;

let arrayUser: string[];
let arrayIA: string[];

let timeColorDelay: number;
let timeColorChange: number;

let timeoutColorChange: NodeJS.Timeout | null;
let timeoutNextPlay: NodeJS.Timeout | null;

// Function: Inicio de juego
const handleStartGame = (tcd: number = 1000, tcc: number = 500): void => {
  // Si no perdiste y estas jugando y tocas algun boton.
  if (userPlaying || iaPlaying) return console.log(MESSAGE_CANT_START);

  handleSetInitialValues(tcd, tcc);

  iaPlaying = true;
  whoPlays();
};

const handleSetInitialValues = (
  tcd: number = 1000,
  tcc: number = 500
): void => {
  const { whoPlaysElement, scoreElement } = getElements();

  score = 0;

  userPlaying = false;
  iaPlaying = false;

  arrayUser = [];
  arrayIA = [];

  timeColorDelay = tcd;
  timeColorChange = tcc;

  whoPlaysElement.innerHTML = `JUEGA IA`;
  scoreElement.innerHTML = `SCORE: ${score}`;

  if (timeoutColorChange) clearTimeout(timeoutColorChange);
  if (timeoutNextPlay) clearTimeout(timeoutNextPlay);

  timeoutColorChange = null;
  timeoutNextPlay = null;
};

const handleSelectDifficulty = (e: Event): void => {
  const target = e.currentTarget as HTMLElement;

  if (userPlaying || iaPlaying) return console.log(MESSAGE_CANT_START);

  if (target.id == "easy") return handleStartGame(1000, 500);

  if (target.id == "medium") return handleStartGame(500, 250);

  if (target.id == "hard") return handleStartGame(250, 125);
};

// Si userCanPlay es True, al clickear vas a cambiar el color de la boxColor y vas a pushear el elemento al arrayUser. Si el array del usuario es igual al array previo de la IA. Pasa a chequear ambos arrays.
const handleUserPlay = (e: Event): void => {
  if (iaPlaying || (!userPlaying && !iaPlaying))
    return console.log(MESSAGE_CANT_PLAY);

  const target = e.currentTarget as HTMLElement;
  const itemId = target.id;

  changeColorViewOfTabletop(target, 100);

  arrayUser.push(itemId);

  if (arrayUser.length === arrayIA.length) {
    userPlaying = false;
    resultValidate();
  }
};

const resultValidate = () => {
  const { scoreElement, whoPlaysElement } = getElements();

  let result = arraysToBeEqual(arrayIA, arrayUser);

  if (timeoutNextPlay) clearTimeout(timeoutNextPlay);

  if (!result) {
    whoPlaysElement.innerHTML = `PERDISTE`;
    iaPlaying = false;
    userPlaying = false;
    return;
  }

  timeoutNextPlay = setTimeout(() => {
    score++;
    scoreElement.innerHTML = `SCORE: ${score}`;
    iaPlaying = true;
    whoPlays();
  }, 500);
};

// Funcion que cambia los colores de sus respectivos boxes.
const changeColorViewOfTabletop = (
  element: HTMLElement,
  time: number
): void => {
  if (timeoutColorChange) clearTimeout(timeoutColorChange);

  const id = element.id;

  element.classList.add(`game__box--${id}-color`);

  timeoutColorChange = setTimeout(() => {
    element.classList.remove(`game__box--${id}-color`);
  }, time);
};

// Funcion que permite obtener algun color aleatoria de valuesCanPlayIA y los retorna.
const iaSelectColorToPlay = (): string => {
  const randomColor = Math.floor(Math.random() * valuesCanPlayIA.length);

  return valuesCanPlayIA[randomColor];
};

const iaPlay = async (
  timeColorDelay: number,
  timeColorChange: number
): Promise<void> => {
  if (arrayIA.length === arrayUser.length + 1) return;

  const { colorsBox } = getElements();

  const iaPickColor = iaSelectColorToPlay();

  arrayIA.push(iaPickColor);

  for (let i = 0; i < arrayIA.length; i++) {
    colorsBox.forEach(function (colorBox) {
      const box = colorBox as HTMLElement;
      if (box.id === arrayIA[i]) {
        changeColorViewOfTabletop(box, timeColorChange);
      }
    });

    await delay(timeColorDelay);
  }
};

// Funcion que dictamina quien juega.
const whoPlays = (): void => {
  const { whoPlaysElement } = getElements();

  if (timeoutNextPlay) clearTimeout(timeoutNextPlay);

  // Juega el usuario
  if (userPlaying && !iaPlaying) {
    whoPlaysElement.innerHTML = `ITS YOUR TURN!`;
    arrayUser = [];
    return;
  }

  // Juega la maquina
  whoPlaysElement.innerHTML = `IA PLAYS`;

  iaPlay(timeColorDelay, timeColorChange);

  iaPlaying = false;

  timeoutNextPlay = setTimeout(() => {
    userPlaying = true;
    whoPlays();
  }, timeColorDelay * arrayUser.length + 1);
};

const delay = (amount: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, amount);
  });
};

const onInit = () => {
  const { btnStart, btnsDifficulty, colorsBox } = getElements();

  // Btn Start Game
  btnStart.addEventListener("click", () => handleStartGame());
  // Btns Difficulty
  btnsDifficulty.forEach((btn__mode) =>
    btn__mode.addEventListener("click", handleSelectDifficulty)
  );
  // Obtenes los colores y le damos a cada uno la funcion de click.
  colorsBox.forEach((colorBox) =>
    colorBox.addEventListener("click", handleUserPlay)
  );
};

document.addEventListener("DOMContentLoaded", onInit);
