
// To-DO list
// - underscore in all private functions inside modules (_)
// - verify input names of the players
// - vars of colors CSS
// - ReadMe explaining modules
// - Make turn random



const factoryPlayers = (name) => {
    let moves = [];
    return {name, moves}
}

const gameBoard = (() => {
    let movesArray = ["","","","","","","","",""];
    let player1;
    let player2;

    const renderGrid = () => {
        let gridContainer = document.createElement("div");
        gridContainer.classList.add("grid-container");

        for (let i = 0; i < movesArray.length; i++){
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.classList.add(i);
            gridContainer.appendChild(cell);
        }

        const main = document.querySelector(".gameboard");
        main.appendChild(gridContainer);
        _setCellEventListeners();
        _setRestartTopBtnEventListener();
    }

    const clearGrid = () => {
        const grid = document.querySelector(".grid-container");
        grid.remove();
    }

    const _verifyNamePlayers = () => {
        let player1Name = document.getElementById("player1-name-input").value.toUpperCase();
        let player2Name = document.getElementById("player2-name-input").value.toUpperCase();
        // regex to check only letters and numbers, no more than (...) chars and no less than 2 chars
        return true
    }

    const renderNamePlayers = () => {
        if (_verifyNamePlayers())
        document.querySelector(".player1-name").textContent = document.getElementById("player1-name-input").value.toUpperCase();
        document.querySelector(".player2-name").textContent = document.getElementById("player2-name-input").value.toUpperCase();
    }

    const createPlayers = (name) => {
        return factoryPlayers(name);
    }

    const _setCellEventListeners = () => {
        const cellElements = document.querySelectorAll(".cell")
        cellElements.forEach(cell => {
            cell.addEventListener("click", (e) => {
                gameFlow.handleClick(e);
            })
        })
    }

    const setPlayers = () => {
        player1 = createPlayers(document.querySelector(".player1-name").textContent);
        player2 = createPlayers(document.querySelector(".player2-name").textContent);
    }

    const getPlayers = (xturn) => {
        return (xturn) ? player1 : player2;
    }

    const clearPlayerMoves = () => {
        player1.moves = [];
        player2.moves = [];
    }

    const _setRestartTopBtnEventListener = () => {
        const restartBtn = document.querySelector(".restart-btn-top");
        restartBtn.addEventListener("click", gameFlow.restartGame)
    }

    return {movesArray,renderGrid,renderNamePlayers,createPlayers,setPlayers,getPlayers,clearGrid,clearPlayerMoves}
})();


const displayModal = (() => {

    const _renderGame = () => {
        _hideModal("start-modal");
        gameBoard.renderGrid();
        
        gameBoard.renderNamePlayers();
        gameBoard.setPlayers();
        
        
    }

    const _hideModal = (type) => {
        const modal = document.getElementById(type)
        modal.classList.remove("show");
    }

    const endModal = (result,xturn) => {
        const endModal = document.getElementById("end-modal");
        const modalTitle = document.querySelector(".end-modal-title");
        const modalMessage = document.querySelector(".modal-message");
        endModal.classList.add("show");

        if (result) {
            let player = gameBoard.getPlayers(xturn);
            modalTitle.textContent = `${player.name} WINS!`;
            modalMessage.textContent = "Next time try drinking redbull before playing"
        } else {
            modalTitle.textContent = "IT'S A TIEEE";
            modalMessage.textContent = "I know you can play better than this"
        }
        _setRestartModalBtnEventListener();  
    }

    const _restartGameFromModal = () => {
        _hideModal("end-modal");
        gameFlow.restartGame();
    }

    // Event listener to the restart button of the endModal
    const _setRestartModalBtnEventListener = () => {
        const restartBtn = document.querySelector(".restart-btn-end");
        restartBtn.addEventListener("click", _restartGameFromModal)
    }

    // Event listener to render the gameboard when click the start button
    const startButton = document.querySelector(".start-btn");
    startButton.addEventListener("click", _renderGame)

    return {endModal}

})();



const gameFlow = (() => {

    // set xTurn to random
    let xTurn = true;
    const winCombos = [
        [0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]
    ]


    const handleClick = (e) => {
        let numCell = e.currentTarget.classList[1];
        if (_verifyMove(numCell)) {
            _markCell(e);
            // THis 2 functions down need to be united, remove the player.moves and checkWin using the gameboard array
            _addToGameBoardArray(e);
            _addPlayerMoves(e);
            if (_checkWin()){
                displayModal.endModal(true,xTurn);
                
            } else if (_checkDraw()){
                displayModal.endModal(false,xTurn);
            } else {
                _changeTurn();
                _indicateTurn();
            }
        }
    }

    const _changeTurn = () => xTurn = !xTurn;

    const _addToGameBoardArray = (e) => {
        let numCell = parseInt(e.currentTarget.classList[1]);
        (xTurn) ? marker = "X" : marker = "O";
        gameBoard.movesArray[numCell] = marker;
    }

    const _indicateTurn = () => {
        const turnMessage = document.querySelector(".turn");
        const arrowDiv = document.querySelector(".icon");
        let icon = document.createElement("i");
        icon.classList.add("fa-solid");
        (xTurn) ? icon.classList.add("fa-arrow-left-long") : icon.classList.add("fa-arrow-right-long");
        arrowDiv.firstChild.remove()
        arrowDiv.appendChild(icon);
        let player = gameBoard.getPlayers(xTurn).name;
        turnMessage.textContent = `is ${player} turn`;
    }

    const _addPlayerMoves  = (e) => {
        let player = gameBoard.getPlayers(xTurn);
        let numCell = parseInt(e.currentTarget.classList[1]);

        player.moves.push(numCell)
    }

    const _markCell = (e) => { 
        if (xTurn) {
            e.currentTarget.classList.add("X");
            e.target.textContent = "X";
        } else {
            e.currentTarget.classList.add("O");
            e.target.textContent = "O";
        }
        
    }

    const _verifyMove = (numCell) => {
        let returnStatement;
        document.querySelectorAll(".cell").forEach(cell => {
            if (cell.classList[1] === numCell) {
                (cell.classList[2] === undefined) ? returnStatement = true : returnStatement = false
            }
        })
        return returnStatement
    }

    const _checkWin = () => {
        return winCombos.some(combo => {
            return combo.every(index => {
                let player = gameBoard.getPlayers(xTurn);
                return player.moves.includes(index)
            })
        })
    }

    const _checkDraw = () => {
        return gameBoard.movesArray.every(item => {
            return item === "X" || item === "O";
        })
    }

    const restartGame = () => {
        gameBoard.movesArray = ["","","","","","","","",""];
        gameBoard.clearGrid();
        gameBoard.renderGrid();
        gameBoard.clearPlayerMoves();
        xTurn = true; 
        _indicateTurn();
    }

    return {handleClick,restartGame}
})();

