
// PLAYER FACTORY
const factoryPlayers = (name) => {
    return {name}
}


// GAME BOARD MODULE
const gameBoard = (() => {
    let movesArray = ["","","","","","","","",""];
    let player1;
    let player2;

    // DOM elements
    const main = document.querySelector(".gameboard");
    let messageNamePlayer1 = document.querySelector(".message-error-input1");
    let messageNamePlayer2 = document.querySelector(".message-error-input2");
    let player1Name = document.querySelector(".player1-name");
    let player2Name = document.querySelector(".player2-name");


    // Event listeners
    const _setCellEventListeners = () => {
        const cellElements = document.querySelectorAll(".cell")
        cellElements.forEach(cell => {
            cell.addEventListener("click", (e) => {
                gameFlow.handleClick(e);
            })
        })
    }

    const _setRestartTopBtnEventListener = () => {
        const restartBtn = document.querySelector(".restart-btn-top");
        restartBtn.addEventListener("click", gameFlow.restartGame)
    }


    // Functions
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

        main.appendChild(gridContainer);
        _setCellEventListeners();
        _setRestartTopBtnEventListener();
    }

    const clearGrid = () => {
        const grid = document.querySelector(".grid-container");
        grid.remove();
    }

    const _verifyNamePlayers = () => {
        let player1NameInput = document.getElementById("player1-name-input").value;
        let player2NameInput = document.getElementById("player2-name-input").value;

        let regex = /[^A-Za-z0-9]+/;

        if (player1NameInput.length <= 1 || player1NameInput.length >= 15) {
            return _displayErrorMessageInput(messageNamePlayer1,true);
        } else if (player2NameInput.length <= 1 || player2NameInput.length >= 15) {
            messageNamePlayer1.innerHTML = "&nbsp;";
            return _displayErrorMessageInput(messageNamePlayer2,true);
        } else if (regex.test(player1NameInput)) {
            messageNamePlayer2.innerHTML = "&nbsp;";
            return _displayErrorMessageInput(messageNamePlayer1,false);
        } else if (regex.test(player2NameInput)) {
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
        player1Name.textContent = document.getElementById("player1-name-input").value.toUpperCase();
        player2Name.textContent = document.getElementById("player2-name-input").value.toUpperCase(); 
    }

    const createPlayers = (name) => {
        return factoryPlayers(name);
    }

    const _setPlayers = () => {
        player1 = createPlayers(player1Name.textContent);
        player2 = createPlayers(player2Name.textContent);
    }

    const getPlayers = (xturn) => {
        return (xturn) ? player1 : player2;
    }

    return {movesArray,renderGrid,createPlayers,getPlayers,clearGrid,renderGame}
})();


// MODAL MODULE
const modal = (() => {

    // DOM elements
    const endModal = document.getElementById("end-modal");
    const restartBtn = document.querySelector(".restart-btn-end");
    const startBtn = document.querySelector(".start-btn")
    let modalTitle = document.querySelector(".end-modal-title");
    let modalMessage = document.querySelector(".end-modal-message");


    // Event listeners
    const _setRestartModalBtnEventListener = () => {
        restartBtn.addEventListener("click", _restartGameFromModal)
    }

    startBtn.addEventListener("click", gameBoard.renderGame)


    // functions
    const hide = (type) => {
        const modal = document.getElementById(type)
        modal.classList.remove("show");
    }

    const displayEndModal = (result,xturn) => {
        endModal.classList.add("show");

        if (result) {
            let player = gameBoard.getPlayers(xturn);
            modalTitle.textContent = `${player.name} WINS!`;
            modalMessage.textContent = _randomVictoryMessages();
        } else {
            modalTitle.textContent = "IT'S A TIEEE";
            modalMessage.textContent = "I know you can play better than this"
        }
        _setRestartModalBtnEventListener();  
    }

    const _restartGameFromModal = () => {
        hide("end-modal");
        gameFlow.restartGame();
    }

    const _randomVictoryMessages = () => {
        const messages = [
            '"The harder the battle, the sweeter the victory"',
            '"Those who try their best, shall have victory, while those who tried without effort don\'t deserve it."',
            '"The person that said winning isn\'t everything never won anything."',
            '"Pain is temporary, but winning is forever!"',
            '"If you win, you need not have to explain… If you lose, you should not be there to explain!"',
            '"There is no elevator to success you must take the steps"',
            '"No sacrifice no victory."',
            '"Winning isn\'t everything. But it sure feels good."',
            '"Victory belongs to the most persevering."',
            '"There are no free rides on the rode to Victory!"'
        ]
        let randNum = Math.floor(Math.random()*10);
        return messages[randNum];
    }


    return {displayEndModal,hide}
})();


// GAME FLOW MODULE
const gameFlow = (() => {

    const winCombos = [
        [0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]
    ]


    // DOM elements
    const turnMessage = document.querySelector(".turn");
    const arrowDiv = document.querySelector(".icon");


    //functions
    const _setTurn = () => Math.floor(Math.random()*2);
    let xTurn = (_setTurn()) ? true : false;

    const handleClick = (e) => {
        let numCell = e.currentTarget.classList[1];
        if (_verifyMove(numCell)) {
            _markCell(e);
            _addToGameBoardArray(e);

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
        let icon = document.createElement("i");
        icon.classList.add("fa-solid");
        (xTurn) ? icon.classList.add("fa-arrow-left-long") : icon.classList.add("fa-arrow-right-long");
        arrowDiv.firstChild.remove()
        arrowDiv.appendChild(icon);
        let player = gameBoard.getPlayers(xTurn).name;
        turnMessage.textContent = `is ${player} turn`;
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
        let marker = (xTurn) ? "X" : "O";
        let playerArray = [];

        gameBoard.movesArray.forEach((mark,i) => (mark === marker) ? playerArray.push(i) : 0)
        return winCombos.some(combo => {
            return combo.every(index => {
                return playerArray.includes(index)
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
        xTurn = (_setTurn()) ? true : false; 
        indicateTurn();
    }

    return {handleClick,restartGame,indicateTurn}
})();

