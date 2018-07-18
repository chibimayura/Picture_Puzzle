var suggestedArray =
   [
   "../Picture_Puzzle/assets/images/numbers.jpg",
   "../Picture_Puzzle/assets/images/Pembroke-Welsh-Corgi-MP.jpg",
   "../Picture_Puzzle/assets/images/img_1000x600.jpg",
   "../Picture_Puzzle/assets/images/img_800x600.jpg",
   "../Picture_Puzzle/assets/images/earth_img_600x600.jpg",
   "../Picture_Puzzle/assets/images/sunrise.JPG",
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
        tileCount = 3;
        imageSRC = $(this).attr("src");
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

