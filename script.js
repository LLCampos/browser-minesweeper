var board = {

    lines: 0,
    columns: 0,
    numberofMines: 0,
    mineLocations: [],
    flags : 0,
    numberOfSquares: function() {return this.lines  * this.columns;},
    squares: [],

    cleanBoard: function() {
        this.squares = [];
        $('#board').empty();
        for (var i = 0; i < this.lines; i++) {
            $('#board').append('<div class="line"></div');
        }
        for (i = 0; i < this.columns; i++) {
            $('.line').append('<div class="square"></div');
        }
    },

    resetVariables : function() {
        this.flags = 0;
    },

    askVariables: function() {
        this.lines = Number(prompt('Number of lines', 9));
        this.columns = Number(prompt('Number of columns', 9));
        this.numberOfMines = Number(prompt('Number of mines', 10));
    },

    initSquares: function() {
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
        this.mineLocations = [];
        var mineLocation = 0;
        while (this.mineLocations.length < this.numberOfMines) {
            mineLocation = Math.floor(Math.random() * this.numberOfSquares());
            if (this.mineLocations.indexOf(mineLocation) == -1) {
                this.mineLocations.push(mineLocation);
            }
        }
    },

    putMinesInSquares: function() {
        for (var i in this.mineLocations) {
            var lineMine = indexToLine(this.mineLocations[i]);
            var columnMine = indexToColumn(this.mineLocations[i]);
            this.squares[lineMine][columnMine] = "mine";
        }
    },

    render: function() {
        counter = 0;
        for (var line = 0; line < this.lines; line++) {
            for (var column = 0; column < this.columns; column++) {
                switch (this.squares[line][column]) {
                    default:
                        $('#' + counter).addClass('square-unclicked');
                        break;
                }
                counter++;
            }
        }
    },

    putHowManyMinesAround : function() {
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

var checkEndOfGame = function() {
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

var endOfGame = function() {
    end = checkEndOfGame();
    if (end) {
        $('.square').off();
        alert("You won!");
    }
};

var indexToLine = function(index) {
    return Math.floor(index / board.lines);
};

var indexToColumn = function(index) {
    return (index % board.columns);
};

var addIDsToSquares = function() {
    counter = 0;
    for (var line = 0; line < board.lines; line++) {
        for (var column = 0; column < board.columns; column++) {
            $(".square").eq(counter).attr("id", counter);
            counter ++;
        }

    }
};

var showMines = function() {
    var n = "";
    for (var i in board.mineLocations) {
        n = board.mineLocations[i];
        $('#' + n).removeClass('square-unclicked').addClass('square-clicked').html("<p>B</p>");
    }
};

var newBoard = function() {
    board.askVariables();
    board.resetVariables();
    board.cleanBoard();
    board.initSquares();
    addIDsToSquares();
    board.randomMinesLocations();
    board.putMinesInSquares();
    board.putHowManyMinesAround();
    board.render();
};

var newGame = function() {
    $('.square').off();
    newBoard();

    $('.square-unclicked').on('click', function(event) {
        if (event.which === 1) {
            leftClickOnSquare(Number(this.id));
            endOfGame();
        }
    });

    $(document).on("contextmenu", '.square-unclicked', function(event){
        rightClickOnSquare(event.target);
        return false;
    });
};

var clickedOnMine = function() {
    showMines();
    $('.square').off();
    alert('You Lost!');
};

var rightClickOnSquare = function(target) {
    if ($(target).html() == "F") {
        $(target).empty();
        board.flags -= 1;
    } else {
        if (board.flags < board.numberOfMines) {
            $(target).html("<p>F</p>");
            board.flags ++;
        }
    }
};

var leftClickOnSquare  = function(indexSquareClicked) {
    $(".square").eq(indexSquareClicked).removeClass('square-unclicked').addClass('square-clicked');

    var indexLineClicked = indexToLine(indexSquareClicked);
    var indexColumnClicked = indexToColumn(indexSquareClicked);
    var valueSquareClicked = board.squares[indexLineClicked][indexColumnClicked];

    if (valueSquareClicked == 'mine') {
        clickedOnMine();
    } else if (typeof valueSquareClicked == 'number') {
        $(".square").eq(indexSquareClicked).html("<p>" + valueSquareClicked + "</p>");
        board.squares[indexLineClicked][indexColumnClicked] = 'clicked';
    } else if (valueSquareClicked === '') {
        board.squares[indexLineClicked][indexColumnClicked] = 'clicked';
        recursiveClick(indexLineClicked, indexColumnClicked);
    }
};

var recursiveClick = function(line, column) {
    if (column !== 0) {
        if (board.squares[line][column - 1] != "mine") {
            var indexNeighbor1 = board.lines * line + (column - 1);
            leftClickOnSquare(indexNeighbor1);
        }
    }
    if (column !== board.columns - 1) {
        if (board.squares[line][column + 1] != "mine") {
            var indexNeighbor2 = board.lines * line + (column + 1);
            leftClickOnSquare(indexNeighbor2);
        }
    }
    if (line !== 0) {
        if (board.squares[line - 1][column] != "mine") {
            var indexNeighbor3 = board.lines * (line - 1) + (column);
            leftClickOnSquare(indexNeighbor3);
        }
    }
    if (line !== board.lines - 1) {
        if (board.squares[line + 1][column] != "mine") {
            var indexNeighbor4 = board.lines * (line + 1) + (column);
            leftClickOnSquare(indexNeighbor4);
        }
    }
    if (column !== 0 && line !== 0) {
        if (board.squares[line - 1][column - 1] != "mine") {
            var indexNeighbor5 = board.lines * (line - 1) + (column - 1);
            leftClickOnSquare(indexNeighbor5);
        }
    }
    if (column !== board.columns - 1 && line !== 0) {
        if (board.squares[line - 1][column + 1] != "mine") {
            var indexNeighbor6 = board.lines * (line - 1) + (column + 1);
            leftClickOnSquare(indexNeighbor6);
        }
    }
    if (column !== 0 && line !== board.lines - 1) {
        if (board.squares[line + 1][column - 1] != "mine") {
            var indexNeighbor7 = board.lines * (line + 1) + (column - 1);
            leftClickOnSquare(indexNeighbor7);
        }
    }
    if (column !== board.columns - 1 && line !== board.lines - 1) {
        if (board.squares[line + 1][column + 1] != "mine") {
            var indexNeighbor8 = board.lines * (line + 1) + (column + 1);
            leftClickOnSquare(indexNeighbor8);
        }
    }
};


var findWhatsAround = function(line, column) {
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
    var minesAround = findWhatsAround(line, column);
    var ocurrences = 0;
    for (var i in minesAround) {
        if (minesAround[i] == 'mine') {
            ocurrences++;
        }
    }
    return ((ocurrences === 0) ? "" : ocurrences);
};




$(function() {
    newGame();

    $('#new-game-button').on('click', newGame);
});
