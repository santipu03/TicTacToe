

const factoryPlayers = (name) => {
    let playerMoves =[]
    return {name, playerMoves}
}


const gameBoard = (() => {
    const gameBoard = ["","","","","","","","",""]

    const render = () => {
        let gridContainer = document.createElement("div");
        gridContainer.classList.add("grid-container");

        for (let i = 0; i < gameBoard.length; i++){
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.classList.add(i);
            cell.textContent = gameBoard[i];
            gridContainer.appendChild(cell);
        }

        const main = document.querySelector(".gameboard");
        main.appendChild(gridContainer);
    }


    return {render}
})();


const displayModal = (() => {
    
    const render = () => {
        hideModal();
        gameBoard.render();
        // hideModal and gameBoard.render
    }
    const startButton = document.querySelector(".start-btn");
    startButton.addEventListener("click", render)

    

    const hideModal = () => {
        const modal = document.getElementById("start-modal")
        modal.classList.remove("show");
    }



})();



// const cellElements = document.querySelectorAll(".cell");

// let xTurn = true;

// cellElements.forEach(cell => {
//     cell.addEventListener("click", (e) => {
//         if (e.currentTarget.classList.contains("X") || e.currentTarget.classList.contains("O")){
//         } else {
//             if (xTurn) {
//                 e.target.textContent = "X";
//                 e.currentTarget.classList.add("X")
//             } else {
//                 e.target.textContent = "O";
//                 e.currentTarget.classList.add("O");
//             }
//             xTurn = !xTurn
//             let winner = checkWin();
//         }
        
//     })
// })


const checkWin = () => {

    const winCombos = [
        [1,2,3],
        [4,5,6],
        [7,8,9],
        [1,4,7],
        [2,5,8],
        [3,6,9],
        [1,5,9],
        [3,5,7]
    ]


    return winCombos.some(combo => {
        return combo.every()
    })
    // check if a winning combination has the same class of X's or O's

}

const checkDraw = () => {

    //check if all cells have classes of W's or O's

}

