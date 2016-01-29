var board = {

    lines: 0,
    columns: 0,
    numberofMines: 0,
    mineLocations: [],
    flagsLeft : 0,
    numberOfSquares: function() {return this.lines  * this.columns;},
    squares: [],

    resetBoardVariables : function() {
// reset variables from object board
        this.squares = [];
        this.flagsLeft = this.numberOfMines;
        this.mineLocations = [];
    },

    askVariables: function() {
// ask user new values for variables
        this.lines = Number(prompt('Number of lines', 9));
        this.columns = Number(prompt('Number of columns', 9));
        this.numberOfMines = Number(prompt('Number of mines', 10));
    },

    initSquares: function() {
// fill squares property with empty squares
        counter = 0;
        for (var index_line = 0; index_line < this.lines; index_line ++) {
            var line = [];
            for (var index_column = 0; index_column < this.columns; index_column ++) {
                line.push("");
                counter ++;
            }
            this.squares.push(line);
        }
    },

    randomMinesLocations: function() {
// get the mines locations
        var mineLocation = 0;
        while (this.mineLocations.length < this.numberOfMines) {
            mineLocation = Math.floor(Math.random() * this.numberOfSquares());
            if (this.mineLocations.indexOf(mineLocation) == -1) {
                this.mineLocations.push(mineLocation);
            }
        }
    },

    putMinesInSquares: function() {
// put mines in the adequate location in the squares property
        for (var i in this.mineLocations) {
            var lineMine = indexToLine(this.mineLocations[i]);
            var columnMine = indexToColumn(this.mineLocations[i]);
            this.squares[lineMine][columnMine] = "mine";
        }
    },

    putHowManyMinesAround : function() {
// adds to each square the number of mines it has around
        for (var line = 0; line < board.lines; line++) {
            for (var column = 0; column < board.columns; column++) {
                var square = board.squares[line][column];
                if (square != 'mine') {
                    board.squares[line][column] = countHowManyMinesAround(line, column);
                }
            }
        }
    }
};

var cleanBoard = function() {
// Creates a new html grid
    $('#board').empty();
    for (var i = 0; i < board.lines; i++) {
        $('#board').append('<div class="line"></div');
    }
    for (i = 0; i < board.columns; i++) {
        $('.line').append('<div class="square square-unclicked"></div');
    }
};



var addIDsToSquares = function() {
// add ids to square divs in the html
    counter = 0;
    for (var line = 0; line < board.lines; line++) {
        for (var column = 0; column < board.columns; column++) {
            $(".square").eq(counter).attr("id", counter);
            counter ++;
        }

    }
};

var newBoard = function() {
// prepare a new game
    board.askVariables();
    board.resetBoardVariables();
    cleanBoard();
    board.initSquares();
    addIDsToSquares();
    board.randomMinesLocations();
    board.putMinesInSquares();
    board.putHowManyMinesAround();
};

var checkEndOfGameHelper = function() {
// returns true if the game is over and the player won
    var end = true;
    for (var line = 0; line < board.lines; line++) {
        for (var column = 0; column < board.columns; column++) {
            if (board.squares[line][column] !== 'clicked' && board.squares[line][column] !== 'mine') {
                end = false;
                break;
            }
        }
        if (end === false) {
            break;
        }
    }
    return end;
};

var checkEndOfGame = function() {
// checks if the player won
    end = checkEndOfGameHelper();
    if (end) {
        pauseGame();
        alert("You won! You took " + time.getTime());
    }
};

var indexToLine = function(index) {
// returns the line number of the indexth square
    return Math.floor(index / board.lines);
};

var indexToColumn = function(index) {
// returns the column number of the indexth square
    return (index % board.columns);
};


var findWhatsAround = function(line, column) {
// returns a list of the content of squares around the one in the line and column given in the arguments
    indexOfSquares = [];
    if (column !== 0) {
        indexOfSquares.push(board.squares[line][column - 1]);
    }
    if (column !== board.columns - 1) {
        indexOfSquares.push(board.squares[line][column + 1]);
    }
    if (line !== 0) {
        indexOfSquares.push(board.squares[line - 1][column]);
    }
    if (line !== board.lines - 1) {
        indexOfSquares.push(board.squares[line + 1][column]);
    }
    if (column !== 0 && line !== 0) {
        indexOfSquares.push(board.squares[line - 1][column - 1]);
    }
    if (column !== board.columns - 1 && line !== 0) {
        indexOfSquares.push(board.squares[line - 1][column + 1]);
    }
    if (column !== 0 && line !== board.lines - 1) {
        indexOfSquares.push(board.squares[line + 1][column - 1]);
    }
    if (column !== board.columns - 1 && line !== board.lines - 1) {
        indexOfSquares.push(board.squares[line + 1][column + 1]);
    }
    return indexOfSquares;
};



var countHowManyMinesAround = function(line, column) {
// returns the number of mined squares around the one in the line and column given in the arguments
    var minesAround = findWhatsAround(line, column);
    var ocurrences = 0;
    for (var i in minesAround) {
        if (minesAround[i] == 'mine') {
            ocurrences++;
        }
    }
    return ((ocurrences === 0) ? "" : ocurrences);
};

var showMines = function() {
// show to the user where the bombs are
    var n = "";
    for (var i in board.mineLocations) {
        n = board.mineLocations[i];
        $('#' + n).removeClass('square-unclicked').addClass('square-clicked').html("<p>B</p>");
    }
};


var clickedOnMine = function() {
// actions to be done when user clicked on mine
    showMines();
    pauseGame();
    alert('You Lost!');
};

var rightClickOnSquare = function(target) {
// adds flag to square if there's none and takes flag off if there's none already on the square clicked
    if ($(target).html() == "<p>F</p>") {
        $(target).empty();
        board.flagsLeft += 1;
    } else {
        if (board.flagsLeft > 0) {
            $(target).html("<p>F</p>");
            board.flagsLeft -= 1;
        }
    }
};

var leftClickOnSquare  = function(indexSquareClicked) {
// actions to be taken when user left-clicked a square
    $(".square").eq(indexSquareClicked).removeClass('square-unclicked').addClass('square-clicked');

    var indexLineClicked = indexToLine(indexSquareClicked);
    var indexColumnClicked = indexToColumn(indexSquareClicked);
    var valueSquareClicked = board.squares[indexLineClicked][indexColumnClicked];

    if ($(".square").eq(indexSquareClicked).text()  === 'F') {
        board.flagsLeft += 1;
        updateFlagsLeftScreen();
    }

    if (valueSquareClicked == 'mine') {
        clickedOnMine();

    } else if (typeof valueSquareClicked == 'number') {
        $(".square").eq(indexSquareClicked).html("<p>" + valueSquareClicked + "</p>");
        board.squares[indexLineClicked][indexColumnClicked] = 'clicked';

    } else if (valueSquareClicked === '') {
        $(".square").eq(indexSquareClicked).empty();
        board.squares[indexLineClicked][indexColumnClicked] = 'clicked';
        recursiveClick(indexLineClicked, indexColumnClicked);
    }
};

var recursiveClick = function(line, column) {
// simulates a click on all squares around the one in the line and column given in the arguments
// that are not mined
    if (column !== 0) {
        if (board.squares[line][column - 1] != "mine") {
            var indexNeighbor1 = board.lines * line + (column - 1);
            if ($('.square').eq(indexNeighbor1).text() != 'F') {
                leftClickOnSquare(indexNeighbor1);
            }
        }
    }
    if (column !== board.columns - 1) {
        if (board.squares[line][column + 1] != "mine") {
            var indexNeighbor2 = board.lines * line + (column + 1);
            if ($('.square').eq(indexNeighbor2).text() != 'F') {
                leftClickOnSquare(indexNeighbor2);
            }
        }
    }
    if (line !== 0) {
        if (board.squares[line - 1][column] != "mine") {
            var indexNeighbor3 = board.lines * (line - 1) + (column);
            if ($('.square').eq(indexNeighbor3).text() != 'F') {
                leftClickOnSquare(indexNeighbor3);
            }
        }
    }
    if (line !== board.lines - 1) {
        if (board.squares[line + 1][column] != "mine") {
            var indexNeighbor4 = board.lines * (line + 1) + (column);
            if ($('.square').eq(indexNeighbor4).text() != 'F') {
                leftClickOnSquare(indexNeighbor4);
            }
        }
    }
    if (column !== 0 && line !== 0) {
        if (board.squares[line - 1][column - 1] != "mine") {
            var indexNeighbor5 = board.lines * (line - 1) + (column - 1);
            if ($('.square').eq(indexNeighbor5).text() != 'F') {
                leftClickOnSquare(indexNeighbor5);
            }
        }
    }
    if (column !== board.columns - 1 && line !== 0) {
        if (board.squares[line - 1][column + 1] != "mine") {
            var indexNeighbor6 = board.lines * (line - 1) + (column + 1);
            if ($('.square').eq(indexNeighbor6).text() != 'F') {
                leftClickOnSquare(indexNeighbor6);
            }
        }
    }
    if (column !== 0 && line !== board.lines - 1) {
        if (board.squares[line + 1][column - 1] != "mine") {
            var indexNeighbor7 = board.lines * (line + 1) + (column - 1);
            if ($('.square').eq(indexNeighbor7).text() != 'F') {
                leftClickOnSquare(indexNeighbor7);
            }
        }
    }
    if (column !== board.columns - 1 && line !== board.lines - 1) {
        if (board.squares[line + 1][column + 1] != "mine") {
            var indexNeighbor8 = board.lines * (line + 1) + (column + 1);
            if ($('.square').eq(indexNeighbor8).text() != 'F') {
                leftClickOnSquare(indexNeighbor8);
            }
        }
    }
};


var newGame = function() {
// well, starts a new game
    newBoard();
    time.resetTimeVariables();
    updateTimeScreen();
    updateFlagsLeftScreen();
    timer = setInterval(function(){passOneSecond();}, 1000);

    $('.square-unclicked').on('click', function(event) {
        if (event.which === 1) {
            leftClickOnSquare(Number(this.id));
            checkEndOfGame();
        }
    });

    $(document).on("contextmenu", '.square-unclicked', function(event){
        rightClickOnSquare(this);
        updateFlagsLeftScreen();
        return false;
    });
};

var updateFlagsLeftScreen = function() {
    $('#flags-left').text(board.flagsLeft);
};

var time = {
    seconds: 0,
    minutes: 0,
    updateTime: function() {
        if (this.seconds === 59) {
            this.seconds = 0;
            this.minutes ++;
        } else {
            this.seconds ++;
        }
    },
    getTime: function() {
    // returns string with time in HH:MM format
        minutes = (this.minutes < 10) ? '0' + this.minutes : this.minutes;
        seconds = (this.seconds < 10) ? '0' + this.seconds : this.seconds;
        return minutes + ':' + seconds;
    },
    resetTimeVariables: function() {
        time.seconds = 0;
        time.minutes = 0;
    }
};

var updateTimeScreen = function() {
    $('#time').text(time.getTime());
};

var passOneSecond = function() {
    time.updateTime();
    updateTimeScreen();
};

var pauseGame = function() {
// stops timer and makes stops action on board
    $('.square').off();
    $(document).off();
    clearInterval(timer);
};

$(function() {
    newGame();

    $('#new-game-button').on('click', function() {
        pauseGame();
        newGame();
    });
});
