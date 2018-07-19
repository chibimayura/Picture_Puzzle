var suggestedArray =
   [
   "../Picture_Puzzle/assets/images/numbers_9_pieces.jpg",
   "../Picture_Puzzle/assets/images/numbers_16_pieces.jpg",
   "../Picture_Puzzle/assets/images/numbers_25_pieces.jpg",
   "../Picture_Puzzle/assets/images/numbers_36_pieces.jpg",
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

$(document).on('click', '.play', function(event){
    event.preventDefault();
    if (gameStarted == false){
        tileCount = 3;
        imageSRC = $(this).parent().siblings().attr("data-still");
        console.log(imageSRC);
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

$(document).on('click', '.completed', function(event) {
	event.preventDefault();
    // Get the modal
    var modal = document.querySelector('#containerForDisplay');

    // Get the image and insert it inside the modal 
    var img = document.querySelector('.completed');
    var modalImg = document.querySelector("#displayFullSize");
   
    modal.style.display = "block";
    modalImg.src = this.src;

    $('#download').empty();
    var download = $("<a download target='_blank'>").attr('href', $(this).attr('src'));
    var downloadButton = $('<button>').text('Download Image');
    download.append(downloadButton);
    $('#download').append(download);
    
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() { 
        modal.style.display = "none";
    }
});