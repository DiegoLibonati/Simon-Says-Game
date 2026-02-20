import type { Page } from "@/types/pages";
import type { GameModeButtonComponent } from "@/types/components";

import { GameModeButton } from "@/components/GameModeButton/GameModeButton";

import modes from "@/constants/modes";
import {
  MESSAGE_CANT_PLAY,
  MESSAGE_CANT_START,
  valuesCanPlayIA,
} from "@/constants/vars";
import { arraysToBeEqual } from "@/helpers/arraysToBeEqual";

import "@/pages/SimonSaysPage/SimonSaysPage.css";

const iaSelectColorToPlay = (): string => {
  const randomColor = Math.floor(Math.random() * valuesCanPlayIA.length);
  return valuesCanPlayIA[randomColor]!;
};

const delay = (amount: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, amount);
  });
};

export const SimonSaysPage = (): Page => {
  const main = document.createElement("main") as Page;
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
        game you need to lose first). Good Luck.
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

  let score = 0;
  let userPlaying = false;
  let iaPlaying = false;
  let arrayUser: string[] = [];
  let arrayIA: string[] = [];
  let timeColorDelay = 1000;
  let timeColorChange = 500;
  let timeoutColorChange: number | null = null;
  let timeoutNextPlay: number | null = null;

  const modeButtons: GameModeButtonComponent[] = [];

  const handleStartGame = (
    timeColorDelayParam = 1000,
    timeColorChangeParam = 500
  ): void => {
    if (userPlaying || iaPlaying) {
      alert(MESSAGE_CANT_START);
      return;
    }

    handleSetInitialValues(timeColorDelayParam, timeColorChangeParam);

    iaPlaying = true;
    whoPlays();
  };

  const handleSetInitialValues = (
    delayValue = 1000,
    changeValue = 500
  ): void => {
    const whoPlaysElement =
      main.querySelector<HTMLHeadingElement>(".game__label-start");
    const scoreElement = main.querySelector<HTMLHeadingElement>(".game__score");

    score = 0;
    userPlaying = false;
    iaPlaying = false;

    arrayUser = [];
    arrayIA = [];

    timeColorDelay = delayValue;
    timeColorChange = changeValue;

    if (whoPlaysElement) whoPlaysElement.innerHTML = "JUEGA IA";
    if (scoreElement) scoreElement.innerHTML = `SCORE: ${score}`;

    if (timeoutColorChange !== null) {
      clearTimeout(timeoutColorChange);
      timeoutColorChange = null;
    }
    if (timeoutNextPlay !== null) {
      clearTimeout(timeoutNextPlay);
      timeoutNextPlay = null;
    }
  };

  const handleSelectDifficulty = (
    _: Event,
    timeColorDelayParam: number,
    timeColorChangeParam: number
  ): void => {
    if (userPlaying || iaPlaying) {
      alert(MESSAGE_CANT_START);
      return;
    }

    handleStartGame(timeColorDelayParam, timeColorChangeParam);
  };

  const handleUserPlay = (e: Event): void => {
    if (!userPlaying) {
      alert(MESSAGE_CANT_PLAY);
      return;
    }

    const target = e.currentTarget as HTMLElement;
    const itemId = target.id;

    changeColorViewOfTabletop(target, 100);

    arrayUser.push(itemId);

    if (arrayUser.length === arrayIA.length) {
      userPlaying = false;
      resultValidate();
    }
  };

  const resultValidate = (): void => {
    const whoPlaysElement =
      main.querySelector<HTMLHeadingElement>(".game__label-start");
    const scoreElement = main.querySelector<HTMLHeadingElement>(".game__score");

    const result = arraysToBeEqual(arrayIA, arrayUser);

    if (timeoutNextPlay !== null) {
      clearTimeout(timeoutNextPlay);
      timeoutNextPlay = null;
    }

    if (!result) {
      if (whoPlaysElement) whoPlaysElement.innerHTML = "PERDISTE";
      iaPlaying = false;
      userPlaying = false;
      return;
    }

    timeoutNextPlay = setTimeout(() => {
      score++;
      if (scoreElement) scoreElement.innerHTML = `SCORE: ${score}`;
      iaPlaying = true;
      whoPlays();
    }, 500);
  };

  const changeColorViewOfTabletop = (
    element: HTMLElement,
    time: number
  ): void => {
    if (timeoutColorChange !== null) {
      clearTimeout(timeoutColorChange);
      timeoutColorChange = null;
    }

    const id = element.id;

    element.classList.add(`game__box--${id}-color`);

    timeoutColorChange = setTimeout(() => {
      element.classList.remove(`game__box--${id}-color`);
      timeoutColorChange = null;
    }, time);
  };

  const iaPlay = async (
    timeColorDelayParam: number,
    timeColorChangeParam: number
  ): Promise<void> => {
    const colorsBoxElements =
      main.querySelectorAll<HTMLDivElement>(".game__box");
    const iaPickColor = iaSelectColorToPlay();

    arrayIA.push(iaPickColor);

    for (const colorId of arrayIA) {
      colorsBoxElements.forEach((colorBox) => {
        if (colorBox.id === colorId) {
          changeColorViewOfTabletop(colorBox, timeColorChangeParam);
        }
      });

      await delay(timeColorDelayParam);
    }
  };

  const whoPlays = (): void => {
    const whoPlaysElement =
      main.querySelector<HTMLHeadingElement>(".game__label-start");

    if (timeoutNextPlay !== null) {
      clearTimeout(timeoutNextPlay);
      timeoutNextPlay = null;
    }

    if (userPlaying && !iaPlaying) {
      if (whoPlaysElement) whoPlaysElement.innerHTML = "ITS YOUR TURN!";
      arrayUser = [];
      return;
    }

    if (whoPlaysElement) whoPlaysElement.innerHTML = "IA PLAYS";

    void iaPlay(timeColorDelay, timeColorChange);

    iaPlaying = false;

    timeoutNextPlay = setTimeout(
      () => {
        userPlaying = true;
        whoPlays();
      },
      timeColorDelay * arrayIA.length + 1000
    );
  };

  modes.forEach((mode) => {
    const gameModeButton = GameModeButton({
      id: mode.id,
      ariaLabel: `${mode.name} mode`,
      children: mode.name.toUpperCase(),
      onClick: (e) => {
        handleSelectDifficulty(e, mode.timeColorDelay, mode.timeColorChange);
      },
    });

    modeButtons.push(gameModeButton);
    gameModes?.append(gameModeButton);
  });

  const handleStartClick = (): void => {
    handleStartGame();
  };

  btnStart?.addEventListener("click", handleStartClick);

  colorsBox.forEach((colorBox) => {
    colorBox.addEventListener("click", handleUserPlay);
  });

  main.cleanup = (): void => {
    if (timeoutColorChange !== null) {
      clearTimeout(timeoutColorChange);
      timeoutColorChange = null;
    }
    if (timeoutNextPlay !== null) {
      clearTimeout(timeoutNextPlay);
      timeoutNextPlay = null;
    }

    btnStart?.removeEventListener("click", handleStartClick);

    colorsBox.forEach((colorBox) => {
      colorBox.removeEventListener("click", handleUserPlay);
    });

    modeButtons.forEach((button) => {
      button.cleanup?.();
    });
  };

  return main;
};
