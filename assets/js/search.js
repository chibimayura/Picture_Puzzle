var newOption, newTopic, stillGif, animateGif, newDiv,newImage, newImageOptions, saveBtn, playGifPuzzleBtn;

var searchRecomArray = ["Select a category...", "Animals", "Cars", "Food", "Technology", "Memes"];
var currentTopic = searchRecomArray[0];

//Selects the area for the drop down option selector
var optionSelector = $("#optionSelector");
//Selects the area where the gifs are generated
var generateGifSelector = $("#generatedSearch");
// Selects the Save Area where gifs are saved
var saveGifSelector = $("#savedSearch");

//checks if anything is generated
var generated = false;
var randomGifs = 0;

var	queryURL = "https://api.giphy.com/v1/gifs/search?api_key=7BXBSU13rlvIsFioVjPJN1Tzd8FimNGN&limit=1000&q=";

for(var i = 0; i < searchRecomArray.length; i++){
	newOption = $("<option>").attr("value", searchRecomArray[i]).text(searchRecomArray[i]);

	optionSelector.append(newOption);
}


//allows user to enter a tag to search which automatically goes into the category dropdown
$("form").on("click", "#searchGIF",function(event){
	event.preventDefault();

	if($("input").val() != ""){
		// push new topic into search option array
		newTopic = $("input").val();
		searchRecomArray.push(newTopic);

		newOption = $("<option>").attr("value", newTopic).text(newTopic);
		optionSelector.append(newOption);

		currentTopic = newTopic;
		generated = true;
	} else if(optionSelector.val() !== searchRecomArray[0]){
		currentTopic = optionSelector.val();
		generated = true;
	}else {
		generated = false;
	}

	//resets input and option field
	$("input").val("");
	optionSelector.val(searchRecomArray[0]);
	if(generated){
		generateGiphys();
	}
});

//When mouse enters and leaves the img in the generatedSearch
$(document).on("mouseenter", ".gifContainer", function(){
	$(this).children("img").attr("src", $(this).children("img").attr("data-animate"));
	$(this).children("div").fadeIn(1000);
	$(this).children("img").css("opacity", "0.3");
}).on("mouseleave", ".gifContainer", function(){
	$(this).children("img").attr("src", $(this).children("img").attr("data-still"));
	$(this).children("div").fadeOut(10);
	$(this).children("img").css("opacity", "1");
});

//Gifs Refresh when Refresh button is pressed
//It runs generateGiphy() as long as the currentTopic is not the first array and if the input is not empty
$("form").on("click", "#refresh", function(){
	event.preventDefault();
	if(currentTopic != searchRecomArray[i] || $("input").val() !=""){
		generateGiphys();
	}
});

function generateGiphys(){
	generateGifSelector.empty();
	$.ajax({
		url: queryURL + currentTopic,
		method: "GET"
	}).then(function(response){
		for(var i = 0; i < 3; i++){
			newDiv = $("<div class='gifContainer'>");

			//storing retrieved data response and randomizing which array in the data to get
			randomGif = Math.floor(Math.random()*response.data.length);
			stillGif = response.data[randomGif].images.original_still.url;
			animateGif = response.data[randomGif].images.original.url;

			//all of the image attr
			newImage = $("<img>").attr({
				"src" : stillGif,
				"data-state" : "still",
				"data-still" : stillGif,
				"data-animate" : animateGif,
				"id" : "gif"
			});

			//create save and play btn overlayed on the gif image, append to a div
			saveBtn = $("<div>").attr("class", "gifBtn btn btn-dark").attr("id", "save").text("Save");
			playGifPuzzleBtn = $("<div>").attr("class", "gifBtn btn btn-dark").attr("id", "play").text("Play")
			newImageOptions = $("<div>").attr("class", ".gifPlayOption").append(saveBtn, playGifPuzzleBtn);//.hide();

			newDiv.append(newImage,newImageOptions);

			generateGifSelector.append(newDiv);

			//fade images into the generated Search area
			generateGifSelector.each(function(i){
				$(this).delay(400*i).fadeIn(2000);
			});
		}
	});
}

// move Items to Save Area Functions
$(document).on("click", "#save", function(){
	event.preventDefault();
	saveGifSelector.append($(this).parent().parent());
	$(this).remove();
});