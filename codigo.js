const colorsBox = document.querySelectorAll(".box_color");
const btnStart = document.querySelector(".section_start_row1 button");
const whoPlaysHtml = document.querySelector(".whoPlays");
const scoreHtml = document.querySelector(".score");
const btnsDifficulty = document.querySelectorAll(".btnDif"); 

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

// Function: Inicio de juego
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

// Btn Start Game
btnStart.addEventListener("click", startGame);

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

// Btns Difficulty
btnsDifficulty.forEach(function(btnDif){

    btnDif.addEventListener("click", selectDifficulty);

});

// Se resea el juego. Se pasa los parametros de cambio de color y cada cuanto dice que color es
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

// Si userCanPlay es True, al clickear vas a cambiar el color de la boxColor y vas a pushear el elemento al arrayUser. Si el array del usuario es igual al array previo de la IA. Pasa a chequear ambos arrays.
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

// Obtenes los colores y le damos a cada uno la funcion de click.
colorsBox.forEach(function(colorBox){

    colorBox.addEventListener("click", userSystemPlay);

});

// Funcion que cambia los colores de sus respectivos boxes.
const changeColorViewOfTabletop = (itemId, item, time) => {

    item.classList.add(`${itemId}-color`);

    setTimeout(()=>{
    
        item.classList.remove(`${itemId}-color`);
    
    },time); 

}

// Funcion que permite obtener algun color aleatoria de valuesCanPlayIA y los retorna.
const iaSelectColorToPlay = () => {

    const randomColor = Math.floor(Math.random() * valuesCanPlayIA.length);

    return valuesCanPlayIA[randomColor];

}

// Funcion que permite hacer jugar a la maquina. Si el array de la maquina es menor a iaCount va a seguir jugando. Va elegir un color random y lo va pushear al arrayIA existente. 
// Luego, a traves de la funcion loopIa va a recorrer el arrayIA y va a mostrar que colores se estan tocando en pantalla si el id de la caja y el valor del array son iguales.
// Esto tendra un delay de 1000 segundos y volvera a llamar a la funcion.
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

// Funcion que dictamina quien juega.
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

    // Juega el usuario
    if (userCanPlay == true && checkIfUserIsEqualToIa == false && iaCanPlay == false){
        whoPlaysHtml.innerHTML = `ITS YOUR TURN!`;
        arrayUser = [];
    }

    // Se fija si los arrays son iguales
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

// Funcion que permite comparar amabos arrays.
const checkArraysIaAndUser = (arr, arr2) => {

        if (arr === arr2) return true;
        if (arr == null || arr2 == null) return false;
        if (arr.length !== arr2.length) return false;
    
        for (let i = 0; i < arr.length; i++){
            if (arr[i] !== arr2[i]) return false
        }
    
        return true;
    
}


