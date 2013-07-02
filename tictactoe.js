var board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];

var svgNS = "http://www.w3.org/2000/svg";
var turn = "x";
var gameOver = false;
var boardWidth = 1100;
var boardHeight = 1100;
var parentSvg = "mySvg";

var boardSvgArrayOfArrays = [
		["line", {x1: "400", x2: "400", y1: "100", y2: "1000", stroke: "black", "stroke-width": "3"}],
		["line", {x1: "700", x2: "700", y1: "100", y2: "1000", stroke: "black", "stroke-width": "3"}],
		["line", {x1: "100", x2: "1000", y1: "400", y2: "400", stroke: "black", "stroke-width": "3"}],
		["line", {x1: "100", x2: "1000", y1: "700", y2: "700", stroke: "black", "stroke-width": "3"}]
	];

var placeOSvg = function(x,y) {
  placeSvg('circle', {r: "130", cx: x, cy: y, "stroke":"blue", "stroke-width": "7", "fill": "none"});
}; 

var placeXSvg = function(x,y) {
  placeSvg('line', {x1: x-130, y1: y-130, x2:x+130, y2: y+130, stroke: "red", "stroke-width": "7"});
  placeSvg('line', {x1: x+130, y1: y-130, x2:x-130, y2: y+130, stroke: "red", "stroke-width": "7"});
}; 

var placeClickWatcherSvgMatrix = function(n,m) {
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < m; j++) {
      placeSvg('rect', {
        x: 100 + i*300,
        y: 100 + j*300,
        width: "300",
        height: "300",
        stroke: "white",
        fill: "white",
        opacity:"0",
        id: "cw" + i + '' + j,
        "onclick": "onTileClicked(evt)"
      });
    }
  }
};

var onTileClicked = function (evt) {
  var id = evt.target.getAttribute('id');
  var location = {column: id.charAt(2), row: id.charAt(3)};
  console.log("f onTitleClicked: ", location);

  if (turn === "x") {
      if (placeX(location)) turn = "o";
  } 
  else if (turn === "o") {
      if (placeO(location)) turn = "x";
  }
  displayBoard(board);
  
  if (checkForWin(board)){
      gameOver = true;
  };
};
    



var displayBoard = function (board) {
    for (var i = 0; i < board.length; i++) {
        var newRow = "|";
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j] === -1) {
                newRow = newRow.concat(" O |");
            } else
            if (board[i][j] === 0) {
                newRow = newRow.concat("   |");
            } else
            if (board[i][j] === 1) {
                newRow = newRow.concat(" X |");
            }
        }
        console.log("-------------");
        console.log(newRow);
    }
    console.log("-------------");
};

var checkForWin = function(board) {
    var rowTotal = [0,0,0];
    var columnTotal = [0,0,0];
    var firstDiagonal = 0;
    var secondDiagonal = 0;
    
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            rowTotal[i] += board[i][j];
            columnTotal[j] += board[i][j];
            if (i === j) firstDiagonal += board[i][j];
            if (2 - i === j) secondDiagonal += board[i][j];
        }
    }
    
    var winArray = [].concat(rowTotal, columnTotal, firstDiagonal, secondDiagonal);
    if (winArray.indexOf(3) !== -1) {
        console.log("X wins!");
        onTileClicked = function(){};
        return true;
    }
    if (winArray.indexOf(-3) !== -1){
        console.log("O wins!");
        onTileClicked = function(){};
        return true;
    }
    if ([].concat.apply([], board).indexOf(0) === -1) {
        console.log("It's a draw!");
        onTileClicked = function(){};
        return true;
    }
    
    return false;
};

var placeX = function(location) {
    if (board[location.row][location.column] === 0) {
        board[location.row][location.column] = 1;
        placeXSvg(250+location.column*300, 250+location.row*300);
        console.log("f placeX: " , location);
        console.log(250+location.row*300, 250+location.row*300);
        return true;
    } else {
        console.log("You can't go there! Try again.");
    }
};

var placeO = function(location) {
    if (board[location.row][location.column] === 0) {
        board[location.row][location.column] = -1;
        placeOSvg(250+location.column*300, 250+location.row*300);
        console.log(250+location.row*300, 250+location.row*300);
        return true;
    } else {
        console.log("You can't go there! Try again.");
    }
};

var setSvgAttributes = function(svg, attributes) {
	for (attribute in attributes) {
		svg.setAttribute(attribute, attributes[attribute]);
	}
};

var placeSvg = function(type, attributes) {
	var newSvg = document.createElementNS(svgNS, type);
	setSvgAttributes(newSvg, attributes);
	document.getElementById(parentSvg).appendChild(newSvg);
};

var placeSvgArray = function(svgArray) {
  placeSvg(svgArray[0], svgArray[1]);
};

var placeSvgArrayOfArrays = function(svgGroup) {
	for (var i = 0; i < svgGroup.length; i++) {
		placeSvg(svgGroup[i][0], svgGroup[i][1]);
	}
};

var iterateGame = function() {
    var locationString = prompt("Where to, player " + turn + "?");
    var location = {
        column: parseInt(locationString[0], 10) - 1,
        row: parseInt(locationString[1],10) - 1
    };
    
    if (turn === "x") {
        if (placeX(location)) turn = "o";
    } else
    if (turn === "o") {
        if (placeO(location)) turn = "x";
    }

    displayBoard(board);    

    if (checkForWin(board)){
        gameOver = true;
    }
};

displayBoard(board);

placeSvgArrayOfArrays(boardSvgArrayOfArrays);
placeClickWatcherSvgMatrix(3,3);

