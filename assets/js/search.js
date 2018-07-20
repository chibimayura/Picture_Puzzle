var newOption, newTopic, stillGif, animateGif, newDiv, newImage, newImageOptions, saveBtn, playGifPuzzleBtn, gifWidth, gifHeight;

var searchRecomArray = ["Select a category...", "Animals", "Cars", "Food", "Technology", "Memes"];
var currentTopic = searchRecomArray[0];

var blackListGIFs = ["https://media1.giphy.com/media/6o6TxEn995BTi/giphy_s.gif", "https://media3.giphy.com/media/HcxRu2lennQsM/giphy_s.gif", "https://media1.giphy.com/media/qyjQsUt0p0TT2/giphy_s.gif"]

//Selects the area for the drop down option selector
var optionSelector = $("#optionSelector");
//Selects the area where the gifs are generated
var generateGifSelector = $("#generatedSearch");
// Selects the Save Area where gifs are saved
var saveGifSelector = $("#savedSearch");

//checks if anything is generated
var generated = false;
var numGenerated = 0;

var	queryURL = "https://api.giphy.com/v1/gifs/search?api_key=7BXBSU13rlvIsFioVjPJN1Tzd8FimNGN&limit=1000&q=";

for(var i = 0; i < searchRecomArray.length; i++){
	newOption = $("<option>").attr("value", searchRecomArray[i]).text(searchRecomArray[i]);

	optionSelector.append(newOption);
}


//allows user to enter a tag to search which automatically goes into the category dropdown
$("form").on("click", "#searchGIF",function(){
	event.preventDefault();

	if($("input").val() != ""){
		// push new topic into search option array
		newTopic = $("input").val().trim();
		searchRecomArray.push(newTopic);

		newOption = $("<option>").attr("value", newTopic).text(newTopic);
		optionSelector.append(newOption);

		currentTopic = newTopic;
		generated = true;
	}else if(optionSelector.val() !== searchRecomArray[0]){
		currentTopic = optionSelector.val();
		generated = true;
	}else {
		generated = false;
		alert("Pick a category!");
	}

	//resets input field
	$("input").val("");
	optionSelector.val(currentTopic);
	if(generated){
		numGenerated = 0;
		generateGiphys();
	}
});

//When mouse enters and leaves the img in the generatedSearch
$(document).on("mouseenter", ".gifContainer", function(){
	$(this).children("img").attr("src", $(this).children("img").attr("data-animate"));
	$(this).children("div").fadeIn(1000);
	$(this).children("img").fadeTo("opacity", "0.3");
}).on("mouseleave", ".gifContainer", function(){
	$(this).children("img").attr("src", $(this).children("img").attr("data-still"));
	$(this).children("div").fadeOut(10);
	$(this).children("img").fadeTo("opacity", "1");
});

//Gifs Refresh when Refresh button is pressed
//It runs generateGiphy() as long as the currentTopic is not the first array and if the input is not empty
$("form").on("click", "#refresh", function(){
	event.preventDefault();
	if(currentTopic != searchRecomArray[0] || $("input").val() !=""){
		numGenerated = 0;
		generateGiphys();
	}else{
		alert("Pick a category!");
	}
});

function generateGiphys(){
	generateGifSelector.empty();
	$.ajax({
		url: queryURL + currentTopic,
		method: "GET"
	}).then(function(response){
		while(numGenerated < 3){
			newDiv = $("<div class='gifContainer'>");

			//storing retrieved data response and randomizing which array in the data to get
			randomGif = Math.floor(Math.random()*response.data.length);
			stillGif = response.data[randomGif].images.original_still.url;
			animateGif = response.data[randomGif].images.original.url;
			gifStillWidth = response.data[randomGif].images.original_still.width;
			gifStillHeight = response.data[randomGif].images.original_still.height;
			gifWidth = response.data[randomGif].images.original.width;
			gifHeight = response.data[randomGif].images.original.height;

			if (gifWidth >= "500" && gifHeight >= "500" && gifStillWidth >= "500" && gifStillHeight >= "500" && blackListGIFs.indexOf(stillGif) == -1 && blackListGIFs.indexOf(animateGif) == -1){
				//all of the image attr
				newImage = $("<img>").attr({
					"src" : stillGif,
					"data-state" : "still",
					"data-still" : stillGif,
					"data-animate" : animateGif,
					"class" : "gif"
				});

				//create save and play btn overlayed on the gif image, append to a div
				saveBtn = $("<div>").attr("class", "gifBtn btn btn-dark save").text("Save");
				playGifPuzzleBtn = $("<div>").attr("class", "gifBtn btn btn-dark play").text("Play")
				newImageOptions = $("<div>").attr("class", "gifPlayOption").append(saveBtn, playGifPuzzleBtn).hide();

				newDiv.append(newImage,newImageOptions);

				generateGifSelector.append(newDiv);
				numGenerated ++;
				console.log(gifWidth);

				//fade images into the generated Search area
				generateGifSelector.each(function(i){
					$(this).delay(400*i).fadeIn(2000);
				});				
			}


		}
	});
}

// move Items to Save Area Functions
$(document).on("click", ".save", function(){
	event.preventDefault();
	saveGifSelector.append($(this).parent().parent());
	$(this).remove();
});