// =========================================
// ESTADO DEL JUEGO
// =========================================

let board = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
];


let currentPlayer = "X";

let gameActive = true;

let gameMode = "local";

let difficulty = "easy";


/*
    MARCADOR

    IMPORTANTE:
    Estas variables NO se reinician
    cuando termina una ronda.

    Solamente se reinician cuando
    se pulsa "Reiniciar Juego".
*/

let scoreX = 0;

let scoreO = 0;

let scoreTies = 0;


let nextRoundTimer = null;

let computerTimer = null;


const HUMAN = "X";

const COMPUTER = "O";


/*
    Combinaciones ganadoras
*/

const winningCombinations = [

    [0, 1, 2],

    [3, 4, 5],

    [6, 7, 8],

    [0, 3, 6],

    [1, 4, 7],

    [2, 5, 8],

    [0, 4, 8],

    [2, 4, 6]

];


// =========================================
// ELEMENTOS HTML
// =========================================

const cells =
    document.querySelectorAll(".cell");


const boardElement =
    document.getElementById("board");


const statusElement =
    document.getElementById("status");


const roundMessageElement =
    document.getElementById("round-message");


const scoreXElement =
    document.getElementById("score-x");


const scoreOElement =
    document.getElementById("score-o");


const scoreTiesElement =
    document.getElementById("score-ties");


const modeLocalButton =
    document.getElementById("mode-local");


const modePCButton =
    document.getElementById("mode-pc");


const difficultyContainer =
    document.getElementById(
        "difficulty-container"
    );


const difficultyEasyButton =
    document.getElementById(
        "difficulty-easy"
    );


const difficultyNormalButton =
    document.getElementById(
        "difficulty-normal"
    );


const difficultyHardButton =
    document.getElementById(
        "difficulty-hard"
    );


const restartButton =
    document.getElementById(
        "restart-button"
    );


// =========================================
// EVENTOS DEL TABLERO
// =========================================

cells.forEach(cell => {

    cell.addEventListener(
        "click",
        handleCellClick
    );

});


// =========================================
// MODO 1 VS 1
// =========================================

modeLocalButton.addEventListener(
    "click",
    () => {

        cancelTimers();

        gameMode = "local";

        difficultyContainer.classList.add(
            "d-none"
        );

        updateModeButtons();

        resetBoardOnly();

    }
);


// =========================================
// MODO VS PC
// =========================================

modePCButton.addEventListener(
    "click",
    () => {

        cancelTimers();

        gameMode = "pc";

        difficultyContainer.classList.remove(
            "d-none"
        );

        updateModeButtons();

        resetBoardOnly();

    }
);


// =========================================
// DIFICULTAD FÁCIL
// =========================================

difficultyEasyButton.addEventListener(
    "click",
    () => {

        cancelTimers();

        difficulty = "easy";

        updateDifficultyButtons();

        resetBoardOnly();

    }
);


// =========================================
// DIFICULTAD NORMAL
// =========================================

difficultyNormalButton.addEventListener(
    "click",
    () => {

        cancelTimers();

        difficulty = "normal";

        updateDifficultyButtons();

        resetBoardOnly();

    }
);


// =========================================
// DIFICULTAD DIFÍCIL
// =========================================

difficultyHardButton.addEventListener(
    "click",
    () => {

        cancelTimers();

        difficulty = "hard";

        updateDifficultyButtons();

        resetBoardOnly();

    }
);


// =========================================
// REINICIAR TODO
// =========================================

restartButton.addEventListener(
    "click",
    resetEverything
);


// =========================================
// CLICK EN UNA CASILLA
// =========================================

function handleCellClick(event) {

    const index =
        Number(
            event.currentTarget.dataset.index
        );


    // Si la ronda terminó,
    // no se puede jugar.
    if (!gameActive) {
        return;
    }


    // No permitir sobrescribir
    // una casilla ocupada.
    if (board[index] !== "") {
        return;
    }


    // En modo PC solamente puede
    // jugar el humano.
    if (
        gameMode === "pc" &&
        currentPlayer !== HUMAN
    ) {

        return;
    }


    // Realizar movimiento.
    makeMove(
        index,
        currentPlayer
    );


    // Revisar resultado.
    const result =
        checkGameResult();


    if (result.finished) {

        finishGame(result);

        return;
    }


    // =====================================
    // MODO VS PC
    // =====================================

    if (gameMode === "pc") {

        currentPlayer = COMPUTER;

        updateStatus();


        /*
            Pequeña pausa para que
            la PC no parezca instantánea.
        */

        computerTimer =
            setTimeout(
                () => {

                    computerTimer = null;

                    computerTurn();

                },
                350
            );

    }


    // =====================================
    // MODO 1 VS 1
    // =====================================

    else {

        currentPlayer =
            currentPlayer === "X"
                ? "O"
                : "X";


        updateStatus();

    }

}


// =========================================
// COLOCAR MOVIMIENTO
// =========================================

function makeMove(
    index,
    player
) {

    board[index] = player;


    const cell = cells[index];


    cell.textContent = player;


    cell.classList.add(
        "occupied"
    );


    cell.classList.add(
        player === "X"
            ? "x"
            : "o"
    );


    cell.classList.add(
        "symbol-animation"
    );


    cell.setAttribute(
        "aria-label",
        `Casilla ${index + 1}: ${player}`
    );

}


// =========================================
// TURNO DE LA COMPUTADORA
// =========================================

function computerTurn() {

    if (
        !gameActive ||
        gameMode !== "pc" ||
        currentPlayer !== COMPUTER
    ) {

        return;
    }


    let move = null;


    // =====================================
    // FÁCIL
    // =====================================

    if (difficulty === "easy") {

        move = getRandomMove();

    }


    // =====================================
    // NORMAL
    // =====================================

    else if (
        difficulty === "normal"
    ) {

        move = getBlockingMove();


        if (move === null) {

            move = getRandomMove();

        }

    }


    // =====================================
    // DIFÍCIL
    // =====================================

    else {

        move = getBestMove();

    }


    if (
        move === null ||
        move === undefined
    ) {

        return;

    }


    makeMove(
        move,
        COMPUTER
    );


    const result =
        checkGameResult();


    if (result.finished) {

        finishGame(result);

        return;
    }


    currentPlayer = HUMAN;

    updateStatus();

}


// =========================================
// MOVIMIENTO ALEATORIO
// =========================================

function getRandomMove() {

    const emptyCells = [];


    for (
        let i = 0;
        i < board.length;
        i++
    ) {

        if (
            board[i] === ""
        ) {

            emptyCells.push(i);

        }

    }


    if (
        emptyCells.length === 0
    ) {

        return null;

    }


    const randomIndex =
        Math.floor(
            Math.random() *
            emptyCells.length
        );


    return emptyCells[randomIndex];

}


// =========================================
// BLOQUEO — DIFICULTAD NORMAL
// =========================================

function getBlockingMove() {

    for (
        let i = 0;
        i < board.length;
        i++
    ) {

        if (
            board[i] !== ""
        ) {

            continue;

        }


        // Simular movimiento X.
        board[i] = HUMAN;


        const playerCanWin =
            getWinner(board) === HUMAN;


        // Deshacer simulación.
        board[i] = "";


        if (playerCanWin) {

            return i;

        }

    }


    return null;

}


// =========================================
// MINIMAX — DIFICULTAD DIFÍCIL
// =========================================

function getBestMove() {

    let bestScore = -Infinity;

    let bestMove = null;


    for (
        let i = 0;
        i < board.length;
        i++
    ) {

        if (
            board[i] !== ""
        ) {

            continue;

        }


        // Simular O.
        board[i] = COMPUTER;


        const score =
            minimax(
                board,
                0,
                false
            );


        // Deshacer.
        board[i] = "";


        if (
            score > bestScore
        ) {

            bestScore = score;

            bestMove = i;

        }

    }


    return bestMove;

}


// =========================================
// MINIMAX
// =========================================

function minimax(
    currentBoard,
    depth,
    isMaximizing
) {

    const winner =
        getWinner(currentBoard);


    // PC gana.
    if (
        winner === COMPUTER
    ) {

        return 10 - depth;

    }


    // Jugador gana.
    if (
        winner === HUMAN
    ) {

        return depth - 10;

    }


    // Empate.
    if (
        currentBoard.every(
            cell => cell !== ""
        )
    ) {

        return 0;

    }


    // =====================================
    // MAXIMIZAR — COMPUTADORA
    // =====================================

    if (isMaximizing) {

        let bestScore = -Infinity;


        for (
            let i = 0;
            i < currentBoard.length;
            i++
        ) {

            if (
                currentBoard[i] !== ""
            ) {

                continue;

            }


            currentBoard[i] =
                COMPUTER;


            const score =
                minimax(
                    currentBoard,
                    depth + 1,
                    false
                );


            currentBoard[i] = "";


            bestScore =
                Math.max(
                    bestScore,
                    score
                );

        }


        return bestScore;

    }


    // =====================================
    // MINIMIZAR — JUGADOR
    // =====================================

    let bestScore = Infinity;


    for (
        let i = 0;
        i < currentBoard.length;
        i++
    ) {

        if (
            currentBoard[i] !== ""
        ) {

            continue;

        }


        currentBoard[i] =
            HUMAN;


        const score =
            minimax(
                currentBoard,
                depth + 1,
                true
            );


        currentBoard[i] = "";


        bestScore =
            Math.min(
                bestScore,
                score
            );

    }


    return bestScore;

}


// =========================================
// COMPROBAR RESULTADO
// =========================================

function checkGameResult() {

    for (
        const combination
        of winningCombinations
    ) {

        const [
            a,
            b,
            c
        ] = combination;


        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            return {

                finished: true,

                winner: board[a],

                combination:
                    combination

            };

        }

    }


    // Empate.
    if (
        board.every(
            cell => cell !== ""
        )
    ) {

        return {

            finished: true,

            winner: null,

            combination: []

        };

    }


    return {

        finished: false,

        winner: null,

        combination: []

    };

}


// =========================================
// OBTENER GANADOR
// =========================================

function getWinner(
    currentBoard
) {

    for (
        const combination
        of winningCombinations
    ) {

        const [
            a,
            b,
            c
        ] = combination;


        if (
            currentBoard[a] !== "" &&
            currentBoard[a] === currentBoard[b] &&
            currentBoard[a] === currentBoard[c]
        ) {

            return currentBoard[a];

        }

    }


    return null;

}


// =========================================
// FINALIZAR RONDA
// =========================================

function finishGame(result) {

    gameActive = false;


    // =====================================
    // GANADOR X
    // =====================================

    if (
        result.winner === "X"
    ) {

        scoreX++;


        statusElement.textContent =
            "🎉 ¡Ganó el Jugador 1 (X)!";


        statusElement.className =
            "status-message text-success mb-3";

    }


    // =====================================
    // GANADOR O
    // =====================================

    else if (
        result.winner === "O"
    ) {

        scoreO++;


        if (
            gameMode === "pc"
        ) {

            statusElement.textContent =
                "🤖 ¡Ganó la computadora (O)!";

        }

        else {

            statusElement.textContent =
                "🎉 ¡Ganó el Jugador 2 (O)!";

        }


        statusElement.className =
            "status-message text-danger mb-3";

    }


    // =====================================
    // EMPATE
    // =====================================

    else {

        scoreTies++;


        statusElement.textContent =
            "🤝 ¡Empate!";


        statusElement.className =
            "status-message text-warning mb-3";

    }


    // =====================================
    // RESALTAR GANADOR
    // =====================================

    result.combination.forEach(
        index => {

            cells[index].classList.add(
                "winning-cell"
            );

        }
    );


    // Actualizar marcador.
    updateScore();


    // Bloquear tablero.
    boardElement.classList.add(
        "round-finished"
    );


    // Cuenta regresiva.
    startNextRoundCountdown();

}


// =========================================
// CUENTA REGRESIVA
// =========================================

function startNextRoundCountdown() {

    let secondsLeft = 3;


    roundMessageElement.textContent =
        `Nueva ronda en ${secondsLeft}...`;


    nextRoundTimer =
        setInterval(
            () => {

                secondsLeft--;


                if (
                    secondsLeft > 0
                ) {

                    roundMessageElement.textContent =
                        `Nueva ronda en ${secondsLeft}...`;

                    return;

                }


                clearInterval(
                    nextRoundTimer
                );


                nextRoundTimer = null;


                /*
                    IMPORTANTE:

                    Solamente se reinicia
                    el tablero.

                    El marcador queda intacto.
                */

                resetBoardOnly();

            },
            1000
        );

}


// =========================================
// CANCELAR TEMPORIZADORES
// =========================================

function cancelTimers() {

    if (
        nextRoundTimer !== null
    ) {

        clearInterval(
            nextRoundTimer
        );

        nextRoundTimer = null;

    }


    if (
        computerTimer !== null
    ) {

        clearTimeout(
            computerTimer
        );

        computerTimer = null;

    }

}


// =========================================
// REINICIAR SOLAMENTE EL TABLERO
// =========================================

function resetBoardOnly() {

    cancelTimers();


board = Array(9).fill("");


    // X siempre empieza.
    currentPlayer = "X";


    gameActive = true;


    boardElement.classList.remove(
        "round-finished"
    );


    cells.forEach(
        (cell, index) => {

            cell.textContent = "";


            cell.className =
                "cell";


            cell.setAttribute(
                "aria-label",
                `Casilla ${index + 1}`
            );

        }
    );


    roundMessageElement.textContent =
        "La puntuación se conserva entre rondas.";


    updateStatus();

}


// =========================================
// REINICIAR ABSOLUTAMENTE TODO
// =========================================

function resetEverything() {

    cancelTimers();


    // Borrar marcador.
    scoreX = 0;

    scoreO = 0;

    scoreTies = 0;


    updateScore();


    // Reiniciar tablero.
    resetBoardOnly();


    roundMessageElement.textContent =
        "Juego reiniciado completamente desde cero.";

}


// =========================================
// ACTUALIZAR MARCADOR
// =========================================

function updateScore() {

    scoreXElement.textContent =
        scoreX;


    scoreOElement.textContent =
        scoreO;


    scoreTiesElement.textContent =
        scoreTies;

}


// =========================================
// ACTUALIZAR ESTADO
// =========================================

function updateStatus() {

    if (!gameActive) {
        return;
    }


    // =====================================
    // VS PC
    // =====================================

    if (
        gameMode === "pc"
    ) {

        if (
            currentPlayer === HUMAN
        ) {

            statusElement.textContent =
                "Tu turno — Jugador X";


            statusElement.className =
                "status-message text-primary mb-3";

        }

        else {

            statusElement.textContent =
                "Turno de la computadora — O";


            statusElement.className =
                "status-message text-danger mb-3";

        }


        return;

    }


    // =====================================
    // 1 VS 1
    // =====================================

    if (
        currentPlayer === "X"
    ) {

        statusElement.textContent =
            "Turno del Jugador 1 (X)";


        statusElement.className =
            "status-message text-primary mb-3";

    }

    else {

        statusElement.textContent =
            "Turno del Jugador 2 (O)";


        statusElement.className =
            "status-message text-danger mb-3";

    }

}


// =========================================
// ACTUALIZAR BOTONES DE MODO
// =========================================

function updateModeButtons() {

    const localActive =
        gameMode === "local";


    modeLocalButton.classList.toggle(
        "active",
        localActive
    );


    modePCButton.classList.toggle(
        "active",
        !localActive
    );


    modeLocalButton.setAttribute(
        "aria-pressed",
        String(localActive)
    );


    modePCButton.setAttribute(
        "aria-pressed",
        String(!localActive)
    );

}


// =========================================
// ACTUALIZAR DIFICULTAD
// =========================================

function updateDifficultyButtons() {

    const easyActive =
        difficulty === "easy";


    const normalActive =
        difficulty === "normal";


    const hardActive =
        difficulty === "hard";


    difficultyEasyButton.classList.toggle(
        "active",
        easyActive
    );


    difficultyNormalButton.classList.toggle(
        "active",
        normalActive
    );


    difficultyHardButton.classList.toggle(
        "active",
        hardActive
    );


    difficultyEasyButton.setAttribute(
        "aria-pressed",
        String(easyActive)
    );


    difficultyNormalButton.setAttribute(
        "aria-pressed",
        String(normalActive)
    );


    difficultyHardButton.setAttribute(
        "aria-pressed",
        String(hardActive)
    );

}


// =========================================
// INICIALIZAR
// =========================================

updateModeButtons();

updateDifficultyButtons();

updateScore();

resetBoardOnly();