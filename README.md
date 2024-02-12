# Simon-Says-Game-Page

## Getting Started

1. Clone the repository
2. Join to the correct path of the clone
3. Install LiveServer extension from Visual Studio Code [OPTIONAL]
4. Click in "Go Live" from LiveServer extension

---

1. Clone the repository
2. Join to the correct path of the clone
3. Open index.html in your favorite navigator

---

1. Clone the repository
2. Join to the correct path of the clone
3. Execute: `yarn install`
4. Execute: `yarn dev`

## Description

I made a website that allows you to play simon says. You can choose between 3 difficulties: easy, medium and hard. The difference between these difficulties is the speed that the colors will be shown on the screen. Being easy very slow and hard very fast the game itself. Each time we do well the pattern of colors indicated by the game we will add 1 point.

## Technologies used

1. Typescript
2. CSS3
3. HTML5

## Portfolio Link

[`https://www.diegolibonati.com.ar/#/project/47`](https://www.diegolibonati.com.ar/#/project/47)

## Video

https://github.com/DiegoLibonati/Simon-Says-Game-Page/assets/99032604/575ea582-d12d-4ae2-96a4-8aa1218fb5ab

## Documentation

Here we obtain all the containers that we are going to use from the DOM:

```
const colorsBox = document.querySelectorAll(".box_color") as NodeList;
const btnsDifficulty = document.querySelectorAll(".btnDif") as NodeList;
const btnStart = document.querySelector(
  ".section_start_row1 button"
) as HTMLButtonElement;
const whoPlaysHtml = document.querySelector(".whoPlays") as HTMLHeadingElement;
const scoreHtml = document.querySelector(".score") as HTMLHeadingElement;
```

The variable `valuesCanPlayIA` indicates what possibilities the computer can play. The variable `arrayIA` refers to the colors the computer played. The variable `iaCanPlay` refers to whether the computer can play. The variable `userCanPlay` indicates whether the user can play. The variable `arrayUser` is an array that integrates the colors played by the user. The variable `checkIfUserIsEqualToIa` checks if the user played the same as the computer. The variable `score` dictates the score of the user, if the user matches the pattern a point will be added. The variable `isTheGameLose` indicates if the game is over. The variable `IsPlaying` dictates if the AI is playing. The variable `timeColorDelay` refers to the delay time between color and color `timeColorChange` and so does this variable.

```
const valuesCanPlayIA = ["green", "yellow", "red", "blue"];
let arrayIA: string[] = [];
let iaCanPlay: boolean = false;
let iaCount: number = 0;

let userCanPlay: boolean = false;
let arrayUser: string[] = [];

let checkIfUserIsEqualToIa: boolean = false;

let score: number = 0;
let isTheGameLose: boolean = false;
let isPlaying: boolean = false;

let timeColorDelay: number = 1000;
let timeColorChange: number = 500;
```

This function starts the game when the `Start` button is pressed:

```
// Function: Inicio de juego
const startGame = (): void => {
  if (isTheGameLose == false) {
    if (isPlaying == false) {
      isPlaying = true;
      iaCanPlay = true;
      whoPlays();
    } else {
      console.log(
        "No se puede iniciar o resetear el juego porque estas jugando, perde antes."
      );
    }
  } else {
    resetGame(timeColorDelay, timeColorChange);
  }
};
```

The `selectDifficulty()` function changes the difficulty of the game:

```
const selectDifficulty = (e: Event): void => {
  const target = e.currentTarget as HTMLElement;

  if (target.id == "easy") {
    resetGame(1000, 500);
  }

  if (target.id == "medium") {
    resetGame(500, 250);
  }

  if (target.id == "hard") {
    resetGame(250, 125);
  }
};
```

This `resetGame()` function basically resets the game, it is passed how often the color is going to change and in what time:

```
const resetGame = (tcd: number, tcc: number): void => {
  if (isPlaying == false) {
    whoPlaysHtml.innerHTML = `JUEGA IA`;
    isTheGameLose = false;
    iaCanPlay = true;
    userCanPlay = false;
    checkIfUserIsEqualToIa = false;
    iaCount = 0;
    arrayUser = [];
    arrayIA = [];
    timeColorDelay = tcd;
    timeColorChange = tcc;
    startGame();
  } else {
    console.log(
      "No se puede iniciar o resetear el juego porque estas jugando, perde antes."
    );
  }
};
```

The `userSystemPlay()` function means that if userCanPlay is True, clicking will change the color of the boxColor and push the element to the arrayUser. If the user's array is equal to the previous AI array. Go on to check both arrays:

```
const userSystemPlay = (e: Event): void => {
  if (userCanPlay == true) {
    const target = e.currentTarget as HTMLElement;
    const itemId = target.id;

    changeColorViewOfTabletop(itemId, target, 100);

    arrayUser.push(itemId);

    if (arrayUser.length === arrayIA.length) {
      userCanPlay = false;
      checkIfUserIsEqualToIa = true;
      whoPlays();
    }
  }
};
```

The `changeColorViewOfTableTop()` function changes the colors of their respective boxes:

```
const changeColorViewOfTabletop = (
  itemId: string,
  item: HTMLElement,
  time: number
): void => {
  item.classList.add(`${itemId}-color`);

  setTimeout(() => {
    item.classList.remove(`${itemId}-color`);
  }, time);
};
```

The `iaSelectColorToPlay()` function allows to get some random color from valuesCanPlayIA and returns them:

```
const iaSelectColorToPlay = (): string => {
  const randomColor = Math.floor(Math.random() * valuesCanPlayIA.length);

  return valuesCanPlayIA[randomColor];
};
```

The `iaPlay()` function allows to make the machine play. If the machine's array is less than iaCount it will keep playing. It will choose a random color and push it to the existing arrayIA. Then, through the loopIa function it will loop through the arrayIA and show what colors are being played on the screen if the box id and the array value are equal. This will have a delay of 1000 seconds and will call the function again.

```
const iaPlay = (timeColorDelay: number, timeColorChange: number): void => {
  if (!(arrayIA.length === iaCount)) {
    const iaPickColor = iaSelectColorToPlay();

    arrayIA.push(iaPickColor);

    const delay = (amount: number) => {
      return new Promise((resolve) => {
        setTimeout(resolve, amount);
      });
    };

    async function loopIa() {
      for (let i = 0; i < arrayIA.length; i++) {
        colorsBox.forEach(function (colorBox) {
          const box = colorBox as HTMLElement;
          if (box.id == arrayIA[i]) {
            changeColorViewOfTabletop(arrayIA[i], box, timeColorChange);
          }
        });

        await delay(timeColorDelay);
      }
    }
    loopIa();
  }
};
```

The `whoPlays()` function dictates who plays:

```
const whoPlays = (): void => {
  // Juega la maquina
  if (
    iaCanPlay == true &&
    checkIfUserIsEqualToIa == false &&
    userCanPlay == false
  ) {
    whoPlaysHtml.innerHTML = `IA PLAYS`;
    iaCount++;

    iaPlay(timeColorDelay, timeColorChange);

    iaCanPlay = false;

    setTimeout(() => {
      userCanPlay = true;
      console.log(userCanPlay);
      whoPlays();
    }, timeColorDelay * iaCount);
  }

  // Juega el usuario
  if (
    userCanPlay == true &&
    checkIfUserIsEqualToIa == false &&
    iaCanPlay == false
  ) {
    whoPlaysHtml.innerHTML = `ITS YOUR TURN!`;
    arrayUser = [];
  }

  // Se fija si los arrays son iguales
  if (
    checkIfUserIsEqualToIa == true &&
    userCanPlay == false &&
    iaCanPlay == false
  ) {
    let result = checkArraysIaAndUser(arrayIA, arrayUser);

    if (result == true) {
      setTimeout(() => {
        score++;
        scoreHtml.innerHTML = `SCORE: ${score}`;
        iaCanPlay = true;
        checkIfUserIsEqualToIa = false;
        whoPlays();
      }, 500);
    } else {
      whoPlaysHtml.innerHTML = `PERDISTE`;
      isPlaying = false;
      isTheGameLose = true;
    }
  }
};
```

The `checkArraysIaAndUser()` function allows to know if two arrays are equal or not:

```
const checkArraysIaAndUser = (arr: string[], arr2: string[]): boolean => {
  if (arr === arr2) return true;
  if (arr == null || arr2 == null) return false;
  if (arr.length !== arr2.length) return false;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== arr2[i]) return false;
  }

  return true;
};
```
