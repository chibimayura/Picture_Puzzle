var newOption;

var searchRecomArray = ["Animals", "Cars", "Food", "Technology", "Memes"];

var searchSelector

//Selects the area for the drop down option selector
var optionSelector = $("#optionSelector");

for(var i = 0; i < searchRecomArray.length; i++){
	newOption = $("<option>").text(searchRecomArray[i]);

	optionSelector.append(newOption);
}

