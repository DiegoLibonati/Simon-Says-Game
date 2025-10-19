import { GameModeButton } from "@src/components/GameModeButton/GameModeButton";

import modes from "@src/constants/modes";
import {
  MESSAGE_CANT_PLAY,
  MESSAGE_CANT_START,
  valuesCanPlayIA,
} from "@src/constants/vars";
import { arraysToBeEqual } from "@src/helpers/arraysToBeEqual";

import "@src/pages/SimonSaysPage/SimonSaysPage.css";

let score: number;

let userPlaying: boolean;
let iaPlaying: boolean;

let arrayUser: string[];
let arrayIA: string[];

let timeColorDelay: number;
let timeColorChange: number;

let timeoutColorChange: NodeJS.Timeout | null;
let timeoutNextPlay: NodeJS.Timeout | null;

const handleStartGame = (
  timeColorDelay: number = 1000,
  timeColorChange: number = 500
): void => {
  if (userPlaying || iaPlaying) return console.log(MESSAGE_CANT_START);

  handleSetInitialValues(timeColorDelay, timeColorChange);

  iaPlaying = true;
  whoPlays();
};

const handleSetInitialValues = (
  delayValue: number = 1000,
  changeValue: number = 500
): void => {
  const whoPlaysElement =
    document.querySelector<HTMLHeadingElement>(".game__label-start");
  const scoreElement =
    document.querySelector<HTMLHeadingElement>(".game__score");

  score = 0;
  userPlaying = false;
  iaPlaying = false;

  arrayUser = [];
  arrayIA = [];

  timeColorDelay = delayValue;
  timeColorChange = changeValue;

  whoPlaysElement!.innerHTML = `JUEGA IA`;
  scoreElement!.innerHTML = `SCORE: ${score}`;

  if (timeoutColorChange) clearTimeout(timeoutColorChange);
  if (timeoutNextPlay) clearTimeout(timeoutNextPlay);

  timeoutColorChange = null;
  timeoutNextPlay = null;
};

const handleSelectDifficulty = (
  _: Event,
  timeColorDelay: number,
  timeColorChange: number
): void => {
  if (userPlaying || iaPlaying) return console.log(MESSAGE_CANT_START);

  handleStartGame(timeColorDelay, timeColorChange);
};

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
  const whoPlaysElement =
    document.querySelector<HTMLHeadingElement>(".game__label-start");
  const scoreElement =
    document.querySelector<HTMLHeadingElement>(".game__score");

  let result = arraysToBeEqual(arrayIA, arrayUser);

  if (timeoutNextPlay) clearTimeout(timeoutNextPlay);

  if (!result) {
    whoPlaysElement!.innerHTML = `PERDISTE`;
    iaPlaying = false;
    userPlaying = false;
    return;
  }

  timeoutNextPlay = setTimeout(() => {
    score++;
    scoreElement!.innerHTML = `SCORE: ${score}`;
    iaPlaying = true;
    whoPlays();
  }, 500);
};

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

const iaSelectColorToPlay = (): string => {
  const randomColor = Math.floor(Math.random() * valuesCanPlayIA.length);

  return valuesCanPlayIA[randomColor];
};

const iaPlay = async (
  timeColorDelay: number,
  timeColorChange: number
): Promise<void> => {
  const colorsBox = document.querySelectorAll<HTMLDivElement>(".game__box");
  const iaPickColor = iaSelectColorToPlay();

  arrayIA.push(iaPickColor);

  for (let i = 0; i < arrayIA.length; i++) {
    colorsBox.forEach((colorBox) => {
      const box = colorBox as HTMLElement;
      if (box.id === arrayIA[i]) {
        changeColorViewOfTabletop(box, timeColorChange);
      }
    });

    await delay(timeColorDelay);
  }
};

const whoPlays = (): void => {
  const whoPlaysElement =
    document.querySelector<HTMLHeadingElement>(".game__label-start");

  if (timeoutNextPlay) clearTimeout(timeoutNextPlay);

  // Juega el usuario
  if (userPlaying && !iaPlaying) {
    whoPlaysElement!.innerHTML = `ITS YOUR TURN!`;
    arrayUser = [];
    return;
  }

  // Juega la maquina
  whoPlaysElement!.innerHTML = `IA PLAYS`;

  iaPlay(timeColorDelay!, timeColorChange!);

  iaPlaying = false;

  timeoutNextPlay = setTimeout(() => {
    userPlaying = true;
    whoPlays();
  }, timeColorDelay! * arrayUser.length + 1);
};

const delay = (amount: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, amount);
  });
};

export const SimonSaysPage = (): HTMLElement => {
  const main = document.createElement("main");
  main.className = "simon-says-page";

  main.innerHTML = `
    <section class="tutorial">
      <div class="tutorial__header">
        <h2 class="tutorial__title">¿How to play?</h2>
      </div>

      <div class="tutorial__content">
        <p class="tutorial__description">
        Press the start button to start playing. First the machine will play,
        wait for it to say 'Now the user plays' to play, don't be in a hurry.
        Repeat the sequence of colors, continue until the computer explodes or
        you lose, surely you lose. (If you want to change difficulty of the
        game you need tou lose first). Good Luck.
        </p>
      </div>
    </section>

    <section class="game">
      <article class="game__header">
        <div class="game__information">
          <h3 class="game__label-start">Press START</h3>

          <h3 class="game__score">SCORE: 0</h3>

          <button type="button" aria-label="start" class="game__btn-start">
            START
          </button>
        </div>

        <div class="game__modes"></div>
      </article>

      <article class="game__board">
        <div class="game__box game__box--green" id="green"></div>

        <div class="game__box game__box--red" id="red"></div>

        <div class="game__box game__box--yellow" id="yellow"></div>

        <div class="game__box game__box--blue" id="blue"></div>
      </article>
    </section>
  `;

  const gameModes = main.querySelector<HTMLDivElement>(".game__modes");
  const btnStart = main.querySelector<HTMLButtonElement>(".game__btn-start");
  const colorsBox = main.querySelectorAll<HTMLDivElement>(".game__box");

  modes.forEach((mode) => {
    const gameModeButton = GameModeButton({
      id: mode.id,
      ariaLabel: `${mode.name} mode`,
      children: mode.name.toUpperCase(),
      onClick: (e) =>
        handleSelectDifficulty(e, mode.timeColorDelay, mode.timeColorChange),
    });

    gameModes?.append(gameModeButton);
  });

  btnStart?.addEventListener("click", () => handleStartGame());

  colorsBox.forEach((colorBox) =>
    colorBox.addEventListener("click", handleUserPlay)
  );

  return main;
};
