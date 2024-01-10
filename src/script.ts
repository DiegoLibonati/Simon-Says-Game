const colorsBox = document.querySelectorAll(".box_color") as NodeList;
const btnsDifficulty = document.querySelectorAll(".btnDif") as NodeList;
const btnStart = document.querySelector(
  ".section_start_row1 button"
) as HTMLButtonElement;
const whoPlaysHtml = document.querySelector(".whoPlays") as HTMLHeadingElement;
const scoreHtml = document.querySelector(".score") as HTMLHeadingElement;

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

// Btn Start Game
btnStart.addEventListener("click", startGame);

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

// Btns Difficulty
btnsDifficulty.forEach(function (btnDif) {
  btnDif.addEventListener("click", selectDifficulty);
});

// Se resea el juego. Se pasa los parametros de cambio de color y cada cuanto dice que color es
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

// Si userCanPlay es True, al clickear vas a cambiar el color de la boxColor y vas a pushear el elemento al arrayUser. Si el array del usuario es igual al array previo de la IA. Pasa a chequear ambos arrays.
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

// Obtenes los colores y le damos a cada uno la funcion de click.
colorsBox.forEach(function (colorBox) {
  colorBox.addEventListener("click", userSystemPlay);
});

// Funcion que cambia los colores de sus respectivos boxes.
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

// Funcion que permite obtener algun color aleatoria de valuesCanPlayIA y los retorna.
const iaSelectColorToPlay = (): string => {
  const randomColor = Math.floor(Math.random() * valuesCanPlayIA.length);

  return valuesCanPlayIA[randomColor];
};

// Funcion que permite hacer jugar a la maquina. Si el array de la maquina es menor a iaCount va a seguir jugando. Va elegir un color random y lo va pushear al arrayIA existente.
// Luego, a traves de la funcion loopIa va a recorrer el arrayIA y va a mostrar que colores se estan tocando en pantalla si el id de la caja y el valor del array son iguales.
// Esto tendra un delay de 1000 segundos y volvera a llamar a la funcion.
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

// Funcion que dictamina quien juega.
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

// Funcion que permite comparar amabos arrays.
const checkArraysIaAndUser = (arr: string[], arr2: string[]): boolean => {
  if (arr === arr2) return true;
  if (arr == null || arr2 == null) return false;
  if (arr.length !== arr2.length) return false;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== arr2[i]) return false;
  }

  return true;
};
