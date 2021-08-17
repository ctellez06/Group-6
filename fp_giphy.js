
 $("button").on("click", function() {

    var card = $(this).attr("card-body");

 var restaurants = ["Italian Food", "American Food", "Thai Food", "Vegetarian Food", "Chinese Food", "Mexican Food", "Vietnamese Food", "Vegan Food"];
 var queryURL = "https://api.giphy.com/v1/gifs/search?" + card + "&api_key=lvN82xG516W7mKdMxC0iR2JkZmx2J7dK&limit=10";


 $.ajax({
  url: queryURL,
  method: "GET"
 })

 .then(function(response) {

    var results = response.data;

 for (var i = 0; i < results.length; i++) {

 if ( button[i].restaurants !== "b" && results [i] .restaurants !== "restaurants") {

    var buttonDiv = $("<div>");

    var rating = results[i].rating;

    var p = $("<p>").text("rating: "+ restaurants);

    var restaurantImage = $("<img>");

    restaurantImage.attr("src", results[i].images.fixed_height.url);

    buttonDiv.append(p);
    buttonDiv.append(restaurantImage);

    $("#gifs-appear-here").prepend(gifDiv);




 }




 }

 });

});




