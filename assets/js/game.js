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
var imageSRC = "../Picture_Puzzle/assets/images/earth_img_600x600.jpg";

// stores width and height of tiles
var tileWidth, tileHeight;
// stores tileCount per row and column
var tileCount;
// stores total number to tiles in the puzzle
var totalTiles;
// randomizes which tile will be empty
var randomEmptyTile;

// stores the num of tiles in correct place
var correctTileCount = 0;

// stores difficulty level
var difficulty;

// Tile position
var tileZindex = 1; 
var imgZindex = tileZindex + 1;
var tileSequence = [];

// grabs width and height of game image
var imgWidth = 0;
var imgHeight = 0;

// stores reference to time
var minuteRecord;
var secondRecord;
var timeRecord;
var minute = 0;
var second = 0;
var secondInterval;

// boolean that checks whether game start or not           
var gameStarted = false;

// stores hints and steps used during game
var numHint = 5;
var initialStep = 0;
var stepCount = initialStep;
var correctTileCount = 0;
var stepRecord = 0;

// stores puzzle image src
// var puzzleImage = "../images/img_1000x600.jpg";
// var defaultPuzzle = $("<img id='hiddenImg' alt='hidden'>").attr("src", puzzleImage);
// $("#msgBoard").append(defaultPuzzle);

// text Selector for time and steps
secondText.text("0" + second);
minuteText.text("0" + minute);
stepsText.text(stepCount);
$("#hiddenImg").attr("src", imageSRC);
$("#hiddenImg").hide();

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
    imgWidth = parseInt(hiddenImage.css("width"));
    imgHeight = parseInt(hiddenImage.css("height"));
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
    $("#board").css({ position:'absolute', width: imgWidth, height: imgHeight});
        for (var i = 0; i < totalTiles; i++){
            $("#board").append("<div data-sequence = " + tileSequence[i] + " style = 'position: absolute; left: " + ((i % tileCount) * tileWidth) + "px; top: " + Math.floor(i / tileCount) * tileHeight + "px; width: " + tileWidth + "px; height: " + tileHeight + "px; text-align: center; line-height: " + tileHeight + "px; background: #ffffff url(" + imageSRC + ") " + (-(tileSequence[i] % tileCount) * tileWidth) + "px " + -Math.floor(tileSequence[i] / tileCount) * tileHeight + "px no-repeat !important'></div>");
        }
    }
});

$.fn.extend({ createGame:function(pieces){
    target.empty();
    imgWidth = parseInt(hiddenImage.css("width"));
    imgHeight = parseInt(hiddenImage.css("height"));
    stepCount = initialStep;
    secondInterval = setInterval(timerSecond, 1000);
    gameStarted = true;
    $(".btn-primary").hide();
    var giveupBTN = $("<button class='newButtonSpacing btn-primary delete' id='giveUp'>I GIVE UP!</button>");
    var hintBTN = $("<button class='newButtonSpacing btn-primary delete' id='hint'>" + numHint + " hints</button>");
    var restartBTN = $("<button class='btn-primary delete' id='restart'>Restart</button>")
    $("#btns").append(restartBTN, hintBTN, giveupBTN);
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
    $("#board").css({ position:'absolute', width: imgWidth, height: imgHeight});
        tileSequence.sort(function(a, b){return 0.5 - Math.random()});
        for (var i = 0; i < totalTiles; i++){
            $("#board").append("<div class='tiles' data-sequence = " + tileSequence[i].tileNumber + " positionleft = " + tileSequence[i].left + " positiontop = " + tileSequence[i].top  + "  style = 'position: absolute; left: " + ((i % tileCount) * tileWidth) + "px; top: " + Math.floor(i / tileCount) * tileHeight + "px; width: " + tileWidth + "px; height: " + tileHeight + "px; text-align: center; line-height: " + tileHeight + "px; background: #ffffff url(" + imageSRC + ") " + (-(tileSequence[i].tileNumber % tileCount) * tileWidth) + "px " + -Math.floor(tileSequence[i].tileNumber / tileCount) * tileHeight + "px no-repeat !important'></div>");
        }
    $("#board").children("div:nth-child(" + randomEmptyTile + ")").css({backgroundImage: "", background: "#ffffff"});
    $("#board").children("div").click(function(){
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
    var oldx = $("#board").children("div:nth-child(" + randomEmptyTile + ")").css("left");
    var oldy = $("#board").children("div:nth-child(" + randomEmptyTile + ")").css("top");
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
        $("#hiddenImg").css("z-index", imgZindex++);
        $(clicked_square).css("z-index", tileZindex++);
        $(clicked_square).animate({ left: oldx, top: oldy }, 200, function(){
            $("#board").children("div:nth-child(" + randomEmptyTile + ")").css("left", newx);
            $("#board").children("div:nth-child(" + randomEmptyTile + ")").css("top", newy);
            setTimeout(completionChecker, 100);
        });
        stepCount ++;
        $("#steps").text(stepCount);
    };
};

function completionChecker(){
    correctTileCount = 0;
    for (var i = 0; i < $('#board').children().length; i++) {
        if ($('#board').children()[i].attributes[2].value === $('#board').children()[i].style.left && $('#board').children()[i].attributes[3].value === $('#board').children()[i].style.top) {
            correctTileCount ++;
        }
        if (correctTileCount == totalTiles){
            alert("Finally! That took you a while...");
            clearInterval(secondInterval);            
            if (minute = minuteRecord && second < secondRecord){
                database.ref("/timeRecord").set({
                    bestSecondRecord : second,
                    bestMinuteRecord : minute
                });
            }else if (minute < minuteRecord){
                database.ref("/timeRecord").set({
                    bestSecondRecord : second,
                    bestMinuteRecord : minute
                });
            };
            if (stepCount < stepRecord){
                stepRecord = stepCount;
                database.ref("/stepRecord").set({
                    bestStepRecord : stepRecord
                });
            };
            gameStarted = false;
            setTimeout($("#target").sortedTiles(tileCount),1000);
            // $("#target").sortedTiles(tileCount);
        }
    }
};

database.ref("/stepRecord").on("value", function(snapshot){
    if(snapshot.child("bestStepRecord").exists()){
        stepRecord = snapshot.val().bestStepRecord;
        $("#stepRecord").text(stepRecord);
    }
})

database.ref("/timeRecord").on("value", function(snapshot){
    if(snapshot.child("bestMinuteRecord").exists() && snapshot.child("bestSecondRecord").exists()){
        minuteRecord = snapshot.val().bestMinuteRecord;
        secondRecord = snapshot.val().bestSecondRecord;
        $("#timeRecord").text(minuteRecord + " : " + secondRecord);
    }
});

function timerSecond(){
    second ++;
    if(second < 10){
        $("#second").text("0" + second);
    }else if(second<60){
        $("#second").text(second);
    }else{
        minute ++;
        second = 0;
        $("#second").text("0" + second);
        if(minute < 10){
            $("#minute").text("0" + minute);
        }else{
            $("#minute").text(minute);
        };    
    };
};

$(document).on("click", ".difficulty", function(){
    event.preventDefault();
    difficulty = $(this).text();
    $("#difficulty").remove();
    var newP = $("<p class='msg' id='difficulty'>").text("Difficulty Level - " + difficulty);
    $("#msgBoard").prepend(newP);
    tileCount = parseInt($(this).attr("data-tileCount"));
    $("#target").sortedTiles(tileCount);
    return tileCount;
});

$(document).on("click", "#start", function(){
    event.preventDefault();
    if(tileCount != undefined && gameStarted === false){
        target.createGame(tileCount);
    }else if(tileCount == undefined){
        alert("Select a difficulty!!!");
    }
});

$(document).on("click", "#restart", function(){
    event.preventDefault();
    if(confirm("Are you sure?")){
        clearInterval(secondInterval);
        second = 0;
        minute = 0;
        $("#second").text("0" + second);
        $("#minute").text("0" + minute);
        stepCount = initialStep;
        stepsText.text(stepCount);
        target.createGame(tileCount);
    }
});

$(document).on("click", "#giveUp", function(){
    event.preventDefault();
    clearInterval(secondInterval);
    database.ref("/lastRecordedTime").push({
        lastRecordedTime : minute + " : " + second
    });
    database.ref("/lastRecordedStep").push({
        lastRecordedStep : stepCount
    });
    gameStarted = false;
    $("#target").sortedTiles(tileCount);
    $(".btn").show();
    $(".delete").remove();
});

$(document).on("click", "#hint", function (){
    event.preventDefault();
    if (gameStarted == true){
        if(numHint > 1){
            $("#hiddenImg").fadeIn(1000);
            $("#hiddenImg").delay(2000).fadeOut(1000);
            numHint--;
            $("#hint").text(numHint + " hints");
        }else if (numHint > 0){
            $("#hiddenImg").fadeIn(1000);
            $("#hiddenImg").delay(2000).fadeOut(1000);
            numHint--;
            $("#hint").text(numHint + " hint");
        }else{
            alert("Show me your money");
        }
    }
});