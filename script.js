var board = {

    lines: 0,
    columns: 0,
    numberofMines: 0,
    mineLocations: [],
    numberOfSquares: function() {return this.lines  * this.columns;},
    squares: [],

    cleanBoard: function() {
        $('#board').empty();
        for (var i = 0; i < this.lines; i++) {
            $('#board').append('<div class="line"></div');
        }
        for (i = 0; i < this.columns; i++) {
            $('.line').append('<div class="square"></div');
        }
    },

    askVariables: function() {
        this.lines = Number(prompt('Number of lines', 9));
        this.columns = Number(prompt('Number of columns', 9));
        this.numberOfMines = Number(prompt('Number of mines', 10));
    },

    initSquares: function() {
        for (var i = 0; i < this.numberOfSquares(); i++) {
            this.squares.push("");
        }
    },

    randomMinesLocations: function() {
        this.mineLocations = [];
        var mineLocation = 0;
        while (this.mineLocations.length < this.numberOfMines) {
            mineLocation = Math.floor(Math.random() * 81);
            if (this.mineLocations.indexOf(mineLocation) == -1) {
                this.mineLocations.push(mineLocation);
            }
        }
    },

    putMinesInSquares: function() {
        for (var i in this.mineLocations) {
            this.squares[this.mineLocations[i]] = "mine";
        }
    },

    render: function() {
        for (var square in this.squares) {
            switch (this.squares[square]) {
                case "":
                case "mine":
                    $('#' + square).addClass('square-unclicked');
                    break;
            }
        }
    }

};

var addIDsToSquares = function() {
    for (var square in board.squares) {
        $(".square").eq(square).attr("id", square);
    }
};

var showMines = function() {
    var n = "";
    for (var i in board.mineLocations) {
        n = board.mineLocations[i];
        $('#' + n).removeClass('square-unclicked').addClass('square-clicked').html("<p>B</p>");
    }
};



$(function() {
    board.askVariables();
    board.cleanBoard();
    board.initSquares();
    addIDsToSquares();
    board.randomMinesLocations();
    board.putMinesInSquares();
    board.render();
});
