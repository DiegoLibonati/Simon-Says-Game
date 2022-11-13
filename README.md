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

## Description

I made a website that allows you to play simon says. You can choose between 3 difficulties: easy, medium and hard. The difference between these difficulties is the speed that the colors will be shown on the screen. Being easy very slow and hard very fast the game itself. Each time we do well the pattern of colors indicated by the game we will add 1 point.

## Technologies used

1. Javascript
2. CSS3
3. HTML5

## Galery

![Simon-Says-page](https://raw.githubusercontent.com/DiegoLibonati/DiegoLibonatiWeb/main/data/projects/Javascript/Imagenes/simonsay-0.jpg)

![Simon-Says-page](https://raw.githubusercontent.com/DiegoLibonati/DiegoLibonatiWeb/main/data/projects/Javascript/Imagenes/simonsay-1.jpg)

![Simon-Says-page](https://raw.githubusercontent.com/DiegoLibonati/DiegoLibonatiWeb/main/data/projects/Javascript/Imagenes/simonsay-2.jpg)

![Simon-Says-page](https://raw.githubusercontent.com/DiegoLibonati/DiegoLibonatiWeb/main/data/projects/Javascript/Imagenes/simonsay-3.jpg)

![Simon-Says-page](https://raw.githubusercontent.com/DiegoLibonati/DiegoLibonatiWeb/main/data/projects/Javascript/Imagenes/simonsay-4.jpg)

## Portfolio Link

`https://diegolibonati.github.io/DiegoLibonatiWeb/#/projects?q=Simon%20Says%20Page`

## Video

https://user-images.githubusercontent.com/99032604/199375024-8f4a4b86-776b-4cb5-8158-18dedbb3d220.mp4

## Documentation

Here we obtain all the containers that we are going to use from the DOM:

```
const colorsBox = document.querySelectorAll(".box_color");
const btnStart = document.querySelector(".section_start_row1 button");
const whoPlaysHtml = document.querySelector(".whoPlays");
const scoreHtml = document.querySelector(".score");
const btnsDifficulty = document.querySelectorAll(".btnDif");
```

The variable `valuesCanPlayIA` indicates what possibilities the computer can play. The variable `arrayIA` refers to the colors the computer played. The variable `iaCanPlay` refers to whether the computer can play. The variable `userCanPlay` indicates whether the user can play. The variable `arrayUser` is an array that integrates the colors played by the user. The variable `checkIfUserIsEqualToIa` checks if the user played the same as the computer. The variable `score` dictates the score of the user, if the user matches the pattern a point will be added. The variable `isTheGameLose` indicates if the game is over. The variable `IsPlaying` dictates if the AI is playing. The variable `timeColorDelay` refers to the delay time between color and color `timeColorChange` and so does this variable.

```
let valuesCanPlayIA = ["green", "yellow", "red", "blue"];
let arrayIA = [];
let iaCanPlay = false;
let iaCount = 0;

let userCanPlay = false;
let arrayUser = [];

let checkIfUserIsEqualToIa = false;

let score = 0;
let IsTheGameLose = false;
let IsPlaying = false;

let timeColorDelay = 1000;
let timeColorChange = 500;
```

This function starts the game when the `Start` button is pressed:

```
const startGame = () =>{

    if (IsTheGameLose == false){

        if(IsPlaying == false){
            IsPlaying = true;
            iaCanPlay = true;
            whoPlays();
        } else {
            console.log("No se puede iniciar o resetear el juego porque estas jugando, perde antes.")
        }

    } else {

        resetGame(timeColorDelay, timeColorChange);
    }


}
```

The `selectDifficulty()` function changes the difficulty of the game:

```
const selectDifficulty = (e) => {

    if (e.currentTarget.id == "easy"){
        resetGame(1000, 500);
    }

    if (e.currentTarget.id == "medium"){
        resetGame(500, 250);
    }

    if (e.currentTarget.id == "hard"){
        resetGame(250, 125);
    }

}
```

This `resetGame()` function basically resets the game, it is passed how often the color is going to change and in what time:

```
const resetGame = (tcd, tcc) => {

    if(IsPlaying == false){
        whoPlaysHtml.innerHTML = `JUEGA IA`;
        IsTheGameLose = false;
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
        console.log("No se puede iniciar o resetear el juego porque estas jugando, perde antes.")
    }

}
```

The `userSystemPlay()` function means that if userCanPlay is True, clicking will change the color of the boxColor and push the element to the arrayUser. If the user's array is equal to the previous AI array. Go on to check both arrays:

```
const userSystemPlay = (e) => {

    if (userCanPlay == true){
        let itemId = e.currentTarget.id;

        changeColorViewOfTabletop(itemId, e.currentTarget, 100);

        arrayUser.push(itemId);

        if (arrayUser.length === arrayIA.length){
                userCanPlay = false;
                checkIfUserIsEqualToIa = true;
                whoPlays();
        }
    }

}
```

The `changeColorViewOfTableTop()` function changes the colors of their respective boxes:

```
const changeColorViewOfTabletop = (itemId, item, time) => {

    item.classList.add(`${itemId}-color`);

    setTimeout(()=>{

        item.classList.remove(`${itemId}-color`);

    },time);

}
```

The `iaSelectColorToPlay()` function allows to get some random color from valuesCanPlayIA and returns them:

```
const iaSelectColorToPlay = () => {

    const randomColor = Math.floor(Math.random() * valuesCanPlayIA.length);

    return valuesCanPlayIA[randomColor];

}
```

The `iaPlay()` function allows to make the machine play. If the machine's array is less than iaCount it will keep playing. It will choose a random color and push it to the existing arrayIA. Then, through the loopIa function it will loop through the arrayIA and show what colors are being played on the screen if the box id and the array value are equal. This will have a delay of 1000 seconds and will call the function again.

```
const iaPlay = (timeColorDelay, timeColorChange) => {

    if (!(arrayIA.length === iaCount)){

        const iaPickColor = iaSelectColorToPlay();

        arrayIA.push(iaPickColor);

        const delay = (amount = number) => {
            return new Promise((resolve) => {
                setTimeout(resolve, amount);
            });
        }

        async function loopIa() {
            for (let i = 0; i < arrayIA.length; i++) {

                colorsBox.forEach(function(colorBox){

                    if (colorBox.id == arrayIA[i]){
                        changeColorViewOfTabletop(arrayIA[i], colorBox, timeColorChange);
                    }

                })

                await delay(timeColorDelay);
            }
            }
            loopIa();
    }
}
```

The `whoPlays()` function dictates who plays:

```
const whoPlays = () => {

    // Juega la maquina
    if (iaCanPlay == true && checkIfUserIsEqualToIa == false && userCanPlay == false){
        whoPlaysHtml.innerHTML = `IA PLAYS`;
        iaCount++

        iaPlay(timeColorDelay, timeColorChange)

        iaCanPlay = false;

        setTimeout(() => {
            userCanPlay = true
            console.log(userCanPlay)
            whoPlays();
        }, timeColorDelay * iaCount)
    }

    if (userCanPlay == true && checkIfUserIsEqualToIa == false && iaCanPlay == false){
        whoPlaysHtml.innerHTML = `ITS YOUR TURN!`;
        arrayUser = [];
    }

    if (checkIfUserIsEqualToIa == true && userCanPlay == false && iaCanPlay == false){
       let result = checkArraysIaAndUser(arrayIA, arrayUser);

       if (result == true){
            setTimeout(() => {
                score++
                scoreHtml.innerHTML = `SCORE: ${score}`;
                iaCanPlay = true;
                checkIfUserIsEqualToIa = false;
                whoPlays();
            }, 500);
       } else {
            whoPlaysHtml.innerHTML = `PERDISTE`;
            IsPlaying = false;
            IsTheGameLose = true;
       }
    }

}
```

The `checkArraysIaAndUser()` function allows to know if two arrays are equal or not:

```
const checkArraysIaAndUser = (arr, arr2) => {

        if (arr === arr2) return true;
        if (arr == null || arr2 == null) return false;
        if (arr.length !== arr2.length) return false;

        for (let i = 0; i < arr.length; i++){
            if (arr[i] !== arr2[i]) return false
        }

        return true;

}
```
