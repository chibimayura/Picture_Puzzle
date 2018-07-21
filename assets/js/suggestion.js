var suggestedArray =
   [
   "../Picture_Puzzle/assets/images/numbers_9_pieces.jpg",
   "../Picture_Puzzle/assets/images/numbers_16_pieces.jpg",
   "../Picture_Puzzle/assets/images/numbers_25_pieces.jpg",
   "../Picture_Puzzle/assets/images/numbers_36_pieces.jpg",
   "../Picture_Puzzle/assets/images/spring.jpg",
   "../Picture_Puzzle/assets/images/summer.jpg",
   "../Picture_Puzzle/assets/images/Fall_700x400.jpg",
   "../Picture_Puzzle/assets/images/Winter.jpg",
   "../Picture_Puzzle/assets/images/daisies.jpg",
   "../Picture_Puzzle/assets/images/summerseason1.jpg",
   "../Picture_Puzzle/assets/images/beach.jpg",
   "../Picture_Puzzle/assets/images/Pembroke-Welsh-Corgi-MP.jpg",
   "../Picture_Puzzle/assets/images/img_800x480.jpg",
   "../Picture_Puzzle/assets/images/img_800x600.jpg",
   "../Picture_Puzzle/assets/images/earth_img_600x600.jpg",
   "../Picture_Puzzle/assets/images/sunset.jpg",
   "../Picture_Puzzle/assets/images/gradient-pixel-background.jpg"
   ]

for (var j = 0; j < suggestedArray.length; j++) {
   var suggestedImg = $("<img class='thumbnail'>").attr("src", suggestedArray[j]);
   $('#nav-suggestion').append(suggestedImg);
}

$(document).on('click', '.thumbnail', function(event){
    event.preventDefault();
    if (gameStarted == false){
    	imageSRC = $(this).attr("src");
    	if (imageSRC.indexOf('numbers_16') > -1) {
    		tileCount = 4;
    		difficulty = "Medium";
    	}else if (imageSRC.indexOf('numbers_25') > -1) {
    		tileCount = 5;
    		difficulty = "Hard";
    	}else if (imageSRC.indexOf('numbers_36') > -1) {
    		tileCount = 6;
    		difficulty = "Insane";
    	}else {
    		tileCount = 3;
    		difficulty = "Easy";
    	}

    	stepRecordRef.on("value", function(snapshot){
    	    stepRecord = snapshot.val()[difficulty].bestStepRecord;
    	    $("#stepRecord").text(stepRecord);
    	})
    	
    	timeRecordRef.on("value", function(snapshot){
    	    minuteRecord = snapshot.val()[difficulty].bestMinuteRecord;
    	    secondRecord = snapshot.val()[difficulty].bestSecondRecord;
    	    if(minuteRecord < 10 && secondRecord < 10){
    	        $("#timeRecord").text("0" + minuteRecord + " : 0" + secondRecord);
    	    }else if (minuteRecord >= 10 && secondRecord < 10){
    	        $("#timeRecord").text(minuteRecord + " : 0" + secondRecord);
    	    }else{
    	        $("#timeRecord").text(minuteRecord + " : " + secondRecord);
    	    };
    	});

    	$("#difficulty").remove();
    	var newP = $("<p class='msg' id='difficulty'>").text("Difficulty Level - " + difficulty);
    	$("#msgBoard").prepend(newP);

        $("#hiddenImg").attr("src", imageSRC);
        $("#target").sortedTiles(tileCount);
        $(".btn").show();
        $(".delete").remove();
        second = 0;
        minute = 0;
        $("#second").text("0" + second);
        $("#minute").text("0" + minute);
        stepCount = initialStep;
        stepsText.text(stepCount);
    }
});

$(document).on('click', '.play', function(event){
    event.preventDefault();
    if (gameStarted == false){
        tileCount = 3;
    	difficulty = "Easy";

        imageSRC = $(this).parent().siblings().attr("data-still");
        var imgDataAnimate = $(this).parent().siblings().attr("data-animate");
        $(this).parent().parent().hide();

        stepRecordRef.on("value", function(snapshot){
            stepRecord = snapshot.val()[difficulty].bestStepRecord;
            $("#stepRecord").text(stepRecord);
        })
        
        timeRecordRef.on("value", function(snapshot){
            minuteRecord = snapshot.val()[difficulty].bestMinuteRecord;
            secondRecord = snapshot.val()[difficulty].bestSecondRecord;
            if(minuteRecord < 10 && secondRecord < 10){
                $("#timeRecord").text("0" + minuteRecord + " : 0" + secondRecord);
            }else if (minuteRecord >= 10 && secondRecord < 10){
                $("#timeRecord").text(minuteRecord + " : 0" + secondRecord);
            }else{
                $("#timeRecord").text(minuteRecord + " : " + secondRecord);
            };
        });

        $("#difficulty").remove();
        var newP = $("<p class='msg' id='difficulty'>").text("Difficulty Level - " + difficulty);
        $("#msgBoard").prepend(newP);

        $("#hiddenImg").attr({
            "src": imageSRC,
            "data-state" : "still",
			"data-still" : imageSRC,
			"data-animate" : imgDataAnimate,
        });
        $("#target").sortedTiles(tileCount);
        $(".btn").show();
        $(".delete").remove();
        second = 0;
        minute = 0;
        $("#second").text("0" + second);
        $("#minute").text("0" + minute);
        stepCount = initialStep;
        stepsText.text(stepCount);
    }
});

$(document).on('click', '.completed', function(event) {
	event.preventDefault();

    $('#containerForDisplay').show();
    $('#displayFullSize').attr('src', $(this).attr('src'));

    $('#download').empty();
    var download = $("<a download target='_blank'>").attr('href', $(this).attr('src'));

    if (download.attr('href').indexOf('giphy') == -1) {
    	var downloadButton = $('<button>').text('Download Image');
    	download.append(downloadButton);
    	$('#download').append(download);
    }else {
    	var downloadButton = $('<button>').text('View image in a new tab');
    	download.append(downloadButton);
    	$('#download').append(download);
    }
    
});

$(document).on('click', '.close', function() {
	$('.modal').hide();
});