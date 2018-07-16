// firebase APIkey config
var config = {
    apiKey: "AIzaSyButUq1u4dRUQGPjDtBJt0j2yQMVmWna7I",
    authDomain: "picture-puzzle-31b40.firebaseapp.com",
    databaseURL: "https://picture-puzzle-31b40.firebaseio.com",
    projectId: "picture-puzzle-31b40",
    storageBucket: "picture-puzzle-31b40.appspot.com",
    messagingSenderId: "480871351650"
};
firebase.initializeApp(config);

// reference to firebase database
var database = firebase.database();
var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");
var playerDataRef = database.ref("/playerData");

// html selectors
var puzzleBoard = $("#board");
var target = $("#target");
var minuteText = $("#minute");
var secondText = $("#second");
var stepsText = $("#steps");
var hiddenImage = $("#hiddenImg");

// stores width and height of tiles
var tileWidth, tileHeight;
// stores tileCount per row and column
var tileCount;
// stores total number to tiles in the puzzle
var totalTiles;
//randomizes which tile will be empty
var randomEmptyTile;

// stores the num of tiles in correct place
var correctTileCount = 0;

// Tile position
var tileZindex = 1; 
var imgZindex = tileZindex + 1;
var tileSequence = [];
var imgWidth = parseInt(hiddenImage.css("width"));
var imgHeight = parseInt(hiddenImage.css("height"));

// stores reference to time
var minuteRecord, secondRecord;
var minute = 0;
var second = 0;
var secondInterval;

// boolean that checks whether game start or not           
var gameStarted = false;

// stores hints and steps used during game
var numHint = 5;
var initialStep = 0;
var stepCount = initialStep;

// stores puzzle image src
var puzzleImage = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Hamster_057eue.jpg/1200px-Hamster_057eue.jpg";
var defaultPuzzle = $("<img id='hiddenImg' alt='hidden'>").attr("src", puzzleImage);
$("#msgBoard").append(defaultPuzzle);

// text Selector for time and steps
secondText.text("0" + second);
minuteText.text("0" + minute);
stepsText.text(stepCount);

connectedRef.on("value", function(snap) {
    if (snap.val()) {
        var con = connectionsRef.push(true);
        con.onDisconnect().remove();
    }
});

connectionsRef.on("value", function(snap) {
    $("#numPlayers").text(snap.numChildren());
});

$.fn.extend({ sortedTiles:function(pieces){
    target.empty();
    var targetElement = "#" + $(this).attr("id");
    tileWidth = Math.floor(imgWidth / pieces);
    tileHeight = Math.floor(imgHeight / pieces);
    totalTiles = tileCount*tileCount;
    tileSequence = [];
    for (var i=0; i<totalTiles; i++){
        tileSequence.push(i);
    }
    randomEmptyTile = Math.ceil(Math.random() * totalTiles);
    $(targetElement).html("<div id = 'board'></div>");
    puzzleBoard.css({ position:'absolute', width: imgWidth, height: imgHeight});
        for (var i = 0; i < totalTiles; i++){
            puzzleBoard.append("<div data-sequence = " + tileSequence[i] + " style = 'position: absolute; left: " + ((i % tileCount) * tileWidth) + "px; top: " + Math.floor(i / tileCount) * tileHeight + "px; width: " + tileWidth + "px; height: " + tileHeight + "px; text-align: center; line-height: " + tileHeight + "px; background: #ffffff url("+ puzzleImage +") " + (-(tileSequence[i] % tileCount) * tileWidth) + "px " + -Math.floor(tileSequence[i] / tileCount) * tileHeight + "px no-repeat !important'></div>");
        }
    }
});

$.fn.extend({ createGame:function(pieces){
    target.empty();
    var targetElement = "#" + $(this).attr("id");
    tileWidth = Math.floor(imgWidth / pieces);
    tileHeight = Math.floor(imgHeight / pieces);
    totalTiles = tileCount*tileCount;
    tileSequence = [];
    for (var i=0; i<totalTiles; i++){
        tileSequence.push({"tileNumber" : i, "left" : ((i % tileCount) * tileWidth) + "px", "top" : Math.floor(i / tileCount) * tileHeight + "px"});
    }
    randomEmptyTile = Math.ceil(Math.random() * totalTiles);
    $(targetElement).html("<div id = 'board'></div>");
    puzzleBoard.css({ position:'absolute', width: imgWidth, height: imgHeight});
        tileSequence.sort(function(a, b){return 0.5 - Math.random()});
        for (var i = 0; i < totalTiles; i++){
            puzzleBoard.append("<div class='tiles' data-sequence = " + tileSequence[i].tileNumber + " positionleft = " + tileSequence[i].left + " positiontop = " + tileSequence[i].top  + "  style = 'position: absolute; left: " + ((i % tileCount) * tileWidth) + "px; top: " + Math.floor(i / tileCount) * tileHeight + "px; width: " + tileWidth + "px; height: " + tileHeight + "px; text-align: center; line-height: " + tileHeight + "px; background: #ffffff url(" + puzzleImage + ") " + (-(tileSequence[i].tileNumber % tileCount) * tileWidth) + "px " + -Math.floor(tileSequence[i].tileNumber / tileCount) * tileHeight + "px no-repeat !important'></div>");
        }
    puzzleBoard.children("div:nth-child(" + randomEmptyTile + ")").css({backgroundImage: " ", background: "#ffffff"});
    puzzleBoard.children("div").click(function(){
        if (gameStarted = true){
            Move(this, tileWidth, tileHeight);
        }else{
            return gameStarted = false;
        }
    });
    }
});

function Move(clicked_square, tileWidth, tileHeight){
   var movable = false;
   var oldx = puzzleBoard.children("div:nth-child(" + randomEmptyTile + ")").css("left");
   var oldy = puzzleBoard.children("div:nth-child(" + randomEmptyTile + ")").css("top");
   var newx = $(clicked_square).css("left");
   var newy = $(clicked_square).css("top");
   if (oldx == newx && newy == (parseInt(oldy) - tileHeight) + 'px'){
       movable = true;
   };
   if (oldx == newx && newy == (parseInt(oldy) + tileHeight) + 'px'){
       movable = true;
   };
   if ((parseInt(oldx) - tileWidth) + 'px' == newx && newy == oldy){
       movable = true;
   };
   if ((parseInt(oldx) + tileWidth) + 'px' == newx && newy == oldy){
       movable = true;
   };
   if (movable){
       hiddenImage.css("z-index", imgZindex++);
       $(clicked_square).css("z-index", tileZindex++);
       $(clicked_square).animate({ left: oldx, top: oldy }, 200, function(){
           puzzleBoard.children("div:nth-child(" + randomEmptyTile + ")").css("left", newx);
           puzzleBoard.children("div:nth-child(" + randomEmptyTile + ")").css("top", newy);
           setTimeout(completionChecker, 100);
       });
       stepCount ++;
       stepsText.text(stepCount);
   };
};

function completionChecker () {
   correctTileCount = 0;
   for (var i = 0; i < puzzleBoard.children().length; i++) {
       if (puzzleBoard.children()[i].attributes[2].value === puzzleBoard.children()[i].style.left && puzzleBoard.children()[i].attributes[3].value === puzzleBoard.children()[i].style.top) {
           correctTileCount ++;
       }
       if (correctTileCount == totalTiles){
           alert("yay!");
       }
   }
} 

function timerSecond(){
    second ++;
    if(second < 10){
        secondText.text("0" + second);
    }else if(second<60){
        secondText.text(second);
    }else{
        minute ++;
        second = 0;
        secondText.text("0" + second);
        if(minute < 10){
            minuteText.text("0" + minute);
        }else{
            minuteText.text(minute);
        };    
    };
};

$(document).on("click", ".difficulty", function(){
    event.preventDefault();
    tileCount = parseInt($(this).attr("data-tileCount"));
    target.sortedTiles(tileCount);
    return tileCount;
});

$(document).on("click", "#start", function(){
    event.preventDefault();
    if(tileCount != undefined && gameStarted === false){
        target.createGame(tileCount);
        $(".btn").hide();
        var newBTN = $("<button class='newButtonSpacing btn btn-primary' id='giveUp'>I GIVE UP!</button>");
        var hintBTN = $("<button class='newButtonSpacing btn btn-primary' id='hint'>" + numHint + " hints</button>");
        $("#btns").append(hintBTN, newBTN);
        stepCount = initialStep;
        secondInterval = setInterval(timerSecond, 1000);
        gameStarted = true;
    }else if(tileCount == undefined){
        alert("Select a difficulty!!!");
    }
});

$(document).on("click", "#giveUp", function(){
    event.preventDefault();
    clearInterval(secondInterval);
    currentMin = minuteText.text();
    currentSec = secondText.text();
    database.ref("/timeRecords").set({
        lastRecordedTime : currentMin + " : " + currentSec
    });
    database.ref("/stepRecords").set({
        lastRecordedStep : stepCount
    });
    gameStarted = false;
    target.sortedTiles(tileCount);
});

$(document).on("click", "#hint", function (){
   event.preventDefault();
   if (gameStarted == true){
       if(numHint > 1){
           hiddenImage.fadeIn(1000);
           hiddenImage.delay(2000).fadeOut(1000);
           numHint--;
           $("#hint").text(numHint + " hints");
       }else if (numHint > 0){
           hiddenImage.fadeIn(1000);
           hiddenImage.delay(2000).fadeOut(1000);
           numHint--;
           $("#hint").text(numHint + " hint");
       }else{
           alert("Show me your money");
       }
   }
});