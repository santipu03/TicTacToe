
// To-DO list
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

    const renderGame = () => {
        if (_verifyNamePlayers()){
            modal.hide("start-modal");
            _renderNamePlayers();
            _setPlayers();
            renderGrid();
            gameFlow.indicateTurn();
        }
    }

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
        let player1Name = document.getElementById("player1-name-input").value;
        let player2Name = document.getElementById("player2-name-input").value;
        let messageNamePlayer1 = document.querySelector(".message-error-input1");
        let messageNamePlayer2 = document.querySelector(".message-error-input2");
        let regex = /[^A-Za-z0-9]+/;


        if (player1Name.length <= 1 || player1Name.length >= 15) {
            return _displayErrorMessageInput(messageNamePlayer1,true);
        } else if (player2Name.length <= 1 || player2Name.length >= 15) {
            messageNamePlayer1.innerHTML = "&nbsp;";
            return _displayErrorMessageInput(messageNamePlayer2,true);
        } else if (regex.test(player1Name)) {
            console.log("true")
            messageNamePlayer2.innerHTML = "&nbsp;";
            return _displayErrorMessageInput(messageNamePlayer1,false);
        } else if (regex.test(player2Name)) {
            messageNamePlayer1.innerHTML = "&nbsp;";
            return _displayErrorMessageInput(messageNamePlayer2,false);
        }
        return true
    }

    const _displayErrorMessageInput = (message,type) => {
        (type) ? message.textContent = "*length between 2 and 15 letters" : message.textContent = "*only letters and numbers";
        return false;
    }

    const _renderNamePlayers = () => {
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

    const _setPlayers = () => {
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

    return {movesArray,renderGrid,createPlayers,getPlayers,clearGrid,clearPlayerMoves,renderGame}
})();


const modal = (() => {

    // hide the modal displayed in that moment
    const hide = (type) => {
        const modal = document.getElementById(type)
        modal.classList.remove("show");
    }

    // create and display the end modal with different message depending of who has won, and set listener to the restart btn
    const displayEndModal = (result,xturn) => {
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

    // Hide the end modal and restart the game
    const _restartGameFromModal = () => {
        hide("end-modal");
        gameFlow.restartGame();
    }

    // Event listener to the restart button of the endModal
    const _setRestartModalBtnEventListener = () => {
        const restartBtn = document.querySelector(".restart-btn-end");
        restartBtn.addEventListener("click", _restartGameFromModal)
    }

    // Event listener to render the gameboard when click the start button
    document.querySelector(".start-btn").addEventListener("click", gameBoard.renderGame)

    return {displayEndModal,hide}

})();



const gameFlow = (() => {

    // set xTurn to random
    const _setTurn = () => Math.floor(Math.random()*2);
    let xTurn = (_setTurn()) ? true : false;
    
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
                modal.displayEndModal(true,xTurn);
                
            } else if (_checkDraw()){
                modal.displayEndModal(false,xTurn);
            } else {
                _changeTurn();
                indicateTurn();
            }
        }
    }

    const _changeTurn = () => xTurn = !xTurn;

    const _addToGameBoardArray = (e) => {
        let numCell = parseInt(e.currentTarget.classList[1]);
        (xTurn) ? marker = "X" : marker = "O";
        gameBoard.movesArray[numCell] = marker;
    }

    const indicateTurn = () => {
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
        xTurn = (_setTurn()) ? true : false; 
        indicateTurn();
    }

    return {handleClick,restartGame,indicateTurn}
})();

