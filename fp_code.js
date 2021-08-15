//API Key
const yelpFapi = 'kQQ3Dy3v-RVd04b-R8fM34Ll4L7FirFdUEzNkAs6G0AvfZF6higN_-ckOn4aZAKd0Y80ysYQJ-r4dTzZKifihd0W2hOXtFWS_edYVFKgw2rWLzkiARalSkz5q3oUYXYx';

/**
 * pulls information from the form and build the query URL
 * @returns {string} URL for Yelp Fusion API based on form inputs
 */
function buildQueryURL() {
    // queryURL is the url we'll use to query the API

    var cors_anywhere_url = 'https://cors-anywhere.herokuapp.com/';
    var queryURL = cors_anywhere_url + "https://api.yelp.com/v3/businesses/search?";

    // Begin building an object to contain our API call's query parameters
    // Set the API key
    var queryParams = {
        'categories': 'restaurants',
    };

    // Grab text the user typed into the search input, add to the queryParams object
    queryParams.term = $("#search-term")
        .val()
        .trim();

    queryParams.location = $("#search-location")
        .val()
        .trim();

    // Logging the URL so we have access to it for troubleshooting
    console.log("---------------\nURL: " + queryURL + "\n---------------");
    console.log(queryURL + $.param(queryParams));
    return queryURL + $.param(queryParams);
}

/**
 * takes API data (JSON/object) and turns it into elements on the page
 * @param {object} yelpData - object containing Yelp Fusion API data
 */
function updatePage(yelpData) {
    var numBusinesses = yelpData.businesses.length
    // Log the yelpData to console, where it will show up as an object
    console.log(yelpData);
    console.log("------------------------------------");

    // Loop through and build elements for the defined number of businesses
    for (var i = 0; i < numBusinesses; i++) {
        // Get specific business info for current index
        var business = yelpData.businesses[i];
        console.log(business)
        console.log("------------------------------------");

        // Create the  list group to contain the businesses and add the business content for each
        var $businessList = $("<ul>");
        $businessList.addClass("list-group");

        // Add the newly created element to the DOM
        $("#business-section").append($businessList);

        var $businessListItem = $("<li class='list-group-item businessHeadline'>");
        var businessCount = i + 1

        $businessListItem.append(
            "<span class='label label-primary'>" +
            businessCount +
            "</span>" +
            "<strong> " +
            business.name +
            "</strong>"
        );
        for (let addressLine = 0; addressLine < business.location.display_address.length; addressLine++) {
            $businessListItem.append("<h5>" + business.location.display_address[addressLine] + "</h5>");
        }
        if (business.display_phone != '') {
            $businessListItem.append("<h5>" + business.display_phone + "</h5>");
        }
        $businessList.append($businessListItem);
    }
}

// Function to empty out the businesses
function clear() {
    $("#business-section").empty();
}

// CLICK HANDLERS
// ==========================================================

// .on("click") function associated with the Search Button
$("#run-search").on("click", function (event) {
    // This line allows us to take advantage of the HTML "submit" property
    // This way we can hit enter on the keyboard and it registers the search
    // (in addition to clicks). Prevents the page from reloading on form submit.
    event.preventDefault();

    // Empty the region associated with the businesses
    clear();

    // Build the query URL for the ajax request to the Yelp Fusion API
    var queryURL = buildQueryURL();

    // Make the AJAX request to the API - GETs the JSON data at the queryURL.
    // The data then gets passed as an argument to the updatePage function
    $.ajax({
        url: queryURL,
        method: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + yelpFapi);
        },
    }).then(updatePage);
});

//  .on("click") function associated with the clear button
$("#clear-all").on("click", clear);
