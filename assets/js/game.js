var config = {
    apiKey: "AIzaSyButUq1u4dRUQGPjDtBJt0j2yQMVmWna7I",
    authDomain: "picture-puzzle-31b40.firebaseapp.com",
    databaseURL: "https://picture-puzzle-31b40.firebaseio.com",
    projectId: "picture-puzzle-31b40",
    storageBucket: "picture-puzzle-31b40.appspot.com",
    messagingSenderId: "480871351650"
};
firebase.initializeApp(config);
var database = firebase.database();
var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");
var playerDataRef = database.ref("/playerData");
var tileZindex = 1; 
var imgZindex = tileZindex + 1;
var tileWidth;
var tileHeight;
var tileCount;
var totalTiles;
var randomEmptyTile;
var tileSequence = [];
var imgWidth = parseInt($("#hiddenImg").css("width"));
var imgHeight = parseInt($("#hiddenImg").css("height"));
var minute = 0;
var second = 0;
var minuteRecord;
var secondRecord;
var secondInterval;            
var gameStarted = false;
var numHint = 5;
var initialStep = 0;
var stepCount = initialStep;

$("#second").text("0" + second);
$("#minute").text("0" + minute);
$("#steps").text(stepCount);        

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
    $("#target").empty();
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
            $("#board").append("<div data-sequence = " + tileSequence[i] + " style = 'position: absolute; left: " + ((i % tileCount) * tileWidth) + "px; top: " + Math.floor(i / tileCount) * tileHeight + "px; width: " + tileWidth + "px; height: " + tileHeight + "px; text-align: center; line-height: " + tileHeight + "px; background: #ffffff url(../Picture_Puzzle/assets/images/img_1000x600.jpg) " + (-(tileSequence[i] % tileCount) * tileWidth) + "px " + -Math.floor(tileSequence[i] / tileCount) * tileHeight + "px no-repeat !important'></div>");
        }
    }
});

$.fn.extend({ createGame:function(pieces){
    $("#target").empty();
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
            $("#board").append("<div class='tiles' data-sequence = " + tileSequence[i].tileNumber + " positionleft = " + tileSequence[i].left + " positiontop = " + tileSequence[i].top  + "  style = 'position: absolute; left: " + ((i % tileCount) * tileWidth) + "px; top: " + Math.floor(i / tileCount) * tileHeight + "px; width: " + tileWidth + "px; height: " + tileHeight + "px; text-align: center; line-height: " + tileHeight + "px; -moz-box-shadow: inset 0 0 20px #555555; -webkit-box-shadow: inset 0 0 20px #555555; box-shadow: inset 0 0 20px #555555; background: #ffffff url(../Picture_Puzzle/assets/images/img_1000x600.jpg) " + (-(tileSequence[i].tileNumber % tileCount) * tileWidth) + "px " + -Math.floor(tileSequence[i].tileNumber / tileCount) * tileHeight + "px no-repeat !important'></div>");
        }
    $("#board").children("div:nth-child(" + randomEmptyTile + ")").css({backgroundImage: " ", background: "#ffffff"});
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
        });
        stepCount ++;
        $("#steps").text(stepCount);

        completionChecker();
    };
};

// ref on the info:
// positionleft:                     
// $('#board').children()["0"].attributes[2].value;
// positiontop:
// $('#board' ).children()["0"].attributes[3].value;

// style left:
// $('#board').children()["0"].style.left;
// style top:
// $('#board').children()["0"].style.top;

function completionChecker () {
    for (var i = 0; i < $('#board' ).children().length; i++) {

        if ($('#board').children()[i].attributes[2].value == $('#board').children()[i].style.left && $('#board').children()[i].attributes[3].value == $('#board').children()[i].style.top) {
            // alert('yay!');
        }
    }
} 

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
    tileCount = parseInt($(this).attr("data-tileCount"));
    $("#target").sortedTiles(tileCount);
    return tileCount;
});

$(document).on("click", "#start", function(){
    event.preventDefault();
    if(tileCount != undefined && gameStarted === false){
        $("#target").createGame(tileCount);
        $(".btn").hide();
        var newBTN = $("<button class='btn-primary' id='giveUp'>I GIVE UP!</button>");
        var hintBTN = $("<button class='btn-primary' id='hint'>" + numHint + " hints</button>");
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
    currentMin = $("#minute").text();
    currentSec = $("#second").text();
    database.ref("/timeRecords").set({
        lastRecordedTime : currentMin + " : " + currentSec
    });
    database.ref("/stepRecords").set({
        lastRecordedStep : stepCount
    });
    gameStarted = false;
    $("#target").sortedTiles(tileCount);
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