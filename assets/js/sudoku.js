
// Load board from file or manually
const easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
];
const medium = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
];
const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
];

// Create variables

var timer;
var timeRemaining;
var lives;
var selectedNum;
var selectedTile;
var disableSelect;

window.onload = function (){
    //Solver
    id("solve-btn").addEventListener('click',solveStarter);

    // Run startgame function whenn button is clicked.
    id("start-btn").addEventListener('click',startGame);
    //Add event listener to each number in number container
    for(let i = 0; i < id("number-container").children.length; i++){
        id("number-container").children[i].addEventListener("click",function(){
            // if selecting is not disabled.
            if (!disableSelect) {
                //if number is already selected
                if (this.classList.contains("selected")){
                    //Then remove selection
                    this.classList.remove("selected");
                    selectedNum = null;


                }else{
                    for(let i = 0; i < 9; i++){
                        id("number-container").children[i].classList.remove("selected");
                    }
                    //Select it and update selectedNum variable
                    this.classList.add("selected");
                    selectedNum = this;
                    updateMove();
                }
            }



        });
    }

}

function startGame(){
    //Choose board difficulty
    let board;
    if(id("diff-1").checked) board = easy[0];
    else if(id("diff-2").checked) board = medium[0];
    else board = hard[0];

    // Set lives to 3 and enabled selecting numbers and tiles
    lives = 3;
    disableSelect = false;

    id("lives").textContent = "Lives Remaining: " + lives;

    //Creates board basesd onn difficulty
    generateBoard(board);

    //Starts the timer
    startTimer();


    //Show number container
    id("number-container").classList.remove("hidden");



}

function startTimer(){
    //Sets time remaiing based on input
    if (id("time-1").checked){
        timeRemaining = 180;
    }else if (id("time-2").checked){
        timeRemaining = 300;
    }else{
        timeRemaining = 600;
    }
    //Sets timer for first second,
    id("timer").textContent = timeConversion(timeRemaining);
    //Sets timer to update every second
    timer = setInterval(function (){
        timeRemaining--;
        //If no time remaining end the game.
        if (timeRemaining === 0) endGame();
        id("timer").textContent = timeConversion(timeRemaining);
    }, 1000);
}

//Converts seconds into string of MM:SS format
function timeConversion(time) {

    let minutes = Math.floor(time / 60);
    if (minutes < 10) minutes = "0" + minutes;

    let seconds = time % 60;
    if (seconds < 10) seconds = "0" + seconds;

    return minutes +  ":" + seconds;
}


function generateBoard(board) {
    //Clear previous board
    clearPrevious();

    //Let used to increment tile ids
    let idCount = 0;

    //Create 81 tiles
    for(let i = 0; i < 81; i++){
        //Create a new paragraph element
        let tile = document.createElement("p");
        // If the tile is not supposed to be blank
        if(board.charAt(i) !== "-"){
            //Set tile text to correct number;
            tile.textContent = board.charAt(i);
        }else{
            //Add click event listener to tile
            tile.addEventListener("click", function (){
                //If selecting is not disabled
                if(disableSelect) return;
                //If the tile is already selected
                if(tile.classList.contains("selected")){
                    //Then remove thee selection
                    tile.classList.remove("selected");
                    selectedTile = null;
                }else{
                    //Deselect all other tiles.
                    for(let i = 0; i < 81; i++){
                        qsa(".tile")[i].classList.remove("selected");
                    }
                    // Add selection and update variable
                    tile.classList.add("selected");
                    selectedTile = tile;
                    updateMove();
                }

            });
        }
        //Assing tilee id
        tile.id = idCount;
        //Increment for next tile:
        idCount++;

        //Add tile class to all tiles
        tile.classList.add("tile");
        if((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)){
            tile.classList.add("bottomBorder");
        }
        if ((tile.id + 1) % 9 === 3 || (tile.id + 1) % 9 === 6){
            tile.classList.add("rightBorder");
        }


        //Add tile to board
        id("board").appendChild(tile);

    }
}

function updateMove() {
    //If a tile and a number is selected
    if(selectedTile && selectedNum){
        // Set the tile to correct number
        selectedTile.textContent = selectedNum.textContent;
        //if the number matches the corresponding number inn the solution key
        if(checkCorrect(selectedTile)){
            //Deselect the tile
            selectedTile.classList.remove("selected");
            selectedNum.classList.remove("selected");
            //clear the selected variables;
            selectedNum = null;
            selectedTile = null;
            //Check if board is completed
            if(checkDone()){
                endGame();
            }
            //if the number does not match the solution key
        }else{
            //disable selecting new numbers for one second
            disableSelect = true;
            //Make the tile turn red
            selectedTile.classList.add("incorrect");
            //Run in one second
            setTimeout(function(){
                //Subtract the lives by one
                lives--;
                //If no lives left end the game;
                if(lives === 0) {
                    endGame();
                }else{
                    //If lives is not equal to zero
                    //Update the lives text
                    id("lives").textContent = "Lives Remaining: " + lives;
                    //Re-enable selecting numbers and tiles.
                    disableSelect = false;
                }
                //Restore tile color and remove selected from both
                selectedTile.classList.remove("incorrect");
                selectedTile.classList.remove("selected");
                selectedNum.classList.remove("selected");

                //Clear the tiles teext and clear selected variables.
                selectedTile.textContent = "";
                selectedTile = null;
                selectedNum = null;


            }, 1000);

        }

    }
}

function checkDone() {
    let tiles = qsa(".tile");


    for(let i = 0; i < tiles.length; i++){
        if (tiles[i].textContent === "") return false;
    }

    return true;
}


function endGame() {
    //disable moves and stop the timer
    disableSelect = true;
    clearTimeout(timer);

    //Display win or loss
    if (lives === 0 || timeRemaining === 0){
        id("lives").textContent = "You Lost!";
    }else{
        id("lives").textContent = "You Won!";
    }

}



function checkCorrect(tile) {
    // Set solution based on difficulty selection
    let solution;
    if (id("diff-1").checked) solution = easy[1];
    else if (id("diff-2").checked) solution = medium[1];
    else solution = hard[1];

    // If tile's number is equal to solution's number
    if (solution.charAt(tile.id) === tile.textContent) return true;
    else return false;

}

function clearPrevious() {
    //Access all of the tiles
    let tiles = qsa(".tile");

    //Remove each tile
    for(let i = 0; i < tiles.length; i++){
        tiles[i].remove();
    }

    //If there is a timer, clear it.
    if(timer) clearTimeout(timer);

    //Deselect any numbers
    for(let i = 0; i < id("number-container").children.length; ++i){
        id("number-container").children[i].classList.remove("selected");
    }

    //Clear selected variables
    selectedTile = null;
    selectedNum = null;
}


function changeTheme(radio) {

    if (radio.value === "dark"){
        qs("body").classList.add("dark");

    }else{
        qs("body").classList.remove("dark");
    }

}


//Helper functions ...

function id(id){
    return document.getElementById(id);
}

function qs(selector) {
    return document.querySelector(selector);
}
function qsa(selector){
    return document.querySelectorAll(selector);
}




function solveStarter() {
    let tilesPriv = qsa(".tile");
    if (tilesPriv.length === 0){
        alert("You have to create a game first!");
        return false;
    }

    tiles = tilesPriv;


    let board;
    if(id("diff-1").checked) board = easy[0];
    else if(id("diff-2").checked) board = medium[0];
    else board = hard[0];

    let arrBoard = transformToArr(board);

    solvePuzzle(arrBoard);

}

var tiles;



function solvePuzzle(arrBoard) {

    checkDone();

    finishGame();


//        if (board.charAt(i) === "-" && tiles[i].textContent === ""){
    for (let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            let idx = (9*i) + j;

            if (arrBoard[i][j] == "-"){

                for(let k = 1; k <= 9; k++){

                        if(isValid(arrBoard,i,j,k)){
                            setTimeout(function (){
                                tiles[idx].textContent = k;

                            }, idx * 200);

                            arrBoard[i][j] = k;

                            if (solvePuzzle(arrBoard)){
                                return true;
                            }else{
                                setTimeout(function (){
                                    tiles[idx].textContent = "";

                                }, idx * 200);
                                arrBoard[i][j] = "-";

                            }
                        }

                }
                return false;

            }
        }
    }
    return true;

}

function isValid(board, row, col, k) {
    for (let i = 0; i < 9; i++){
        const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
        const n = 3 * Math.floor(col / 3) + i % 3;

        if(board[row][i] == k || board[i][col] == k || board[m][n] == k){
            return false;
        }
    }

    return true;
}


function transformToArr(board) {

    var transformed = [];
    var array = [];
    for(let i = 0; i < board.length; i++ ){
        array.push(board.charAt(i));
        if (array.length % 9 === 0){
            transformed.push(array);
            array = [];
        }
    }

    return transformed;


}


function finishGame() {
    disableSelect = true;
    clearTimeout(timer);


}


















