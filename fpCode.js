//API Key
const yelpFapi = 'kQQ3Dy3v-RVd04b-R8fM34Ll4L7FirFdUEzNkAs6G0AvfZF6higN_-ckOn4aZAKd0Y80ysYQJ-r4dTzZKifihd0W2hOXtFWS_edYVFKgw2rWLzkiARalSkz5q3oUYXYx';
const yelp_search_url = ''


function prepQuery() {

    var city = 'boston';  // get this from user input
    var term = 'burger';  // get this from user input
    var search_url = yelp_search_url.replace("CITY", city);
    search_url = search_url.replace("TERM", term);
    seek(search_url, mycallbackfunc);
}


function mycallbackfunc(info) {
    console.log(info);// do whatever you want with your info in the browser here
}


function seek(search_url, mycallbackfunc) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', search_url, true);
    // bearer token is evaluated and sent off immediately in our query request to Yelp
    xhr.setRequestHeader("Authorization", "Bearer " + yelpFapi);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            mycallbackfunc(xhr.responseText);
        }
    };
    xhr.send();
}

//prepQuery();
//runSearch();

/**
 * pulls information from the form and build the query URL
 * @returns {string} URL for NYT API based on form inputs
 */
function buildQueryURL() {
    // queryURL is the url we'll use to query the API

    var cors_anywhere_url = 'https://cors-anywhere.herokuapp.com/';
    var queryURL = cors_anywhere_url + "https://api.yelp.com/v3/businesses/search?";


    // Begin building an object to contain our API call's query parameters
    // Set the API key
    var queryParams = {
        'location' : 'boston',
        'term': 'burger',
    };



    // Grab text the user typed into the search input, add to the queryParams object
    /* queryParams.q = $("#search-term")
         .val()
         .trim();
         */

    // If the user provides a startYear, include it in the queryParams object
    /* var startYear = $("#start-year")
        .val()
        .trim();
        */



    // Logging the URL so we have access to it for troubleshooting
    console.log("---------------\nURL: " + queryURL + "\n---------------");
    console.log(queryURL + $.param(queryParams));
    return queryURL + $.param(queryParams);
}

/**
 * takes API data (JSON/object) and turns it into elements on the page
 * @param {object} NYTData - object containing NYT API data
 */
function updatePage(NYTData) {
    // Get from the form the number of results to display
    // API doesn't have a "limit" parameter, so we have to do this ourselves
    var numArticles = $("#article-count").val();

    // Log the NYTData to console, where it will show up as an object
    console.log(NYTData);
    console.log("------------------------------------");

    // Loop through and build elements for the defined number of articles
    for (var i = 0; i < numArticles; i++) {
        // Get specific article info for current index
        var article = NYTData.response.docs[i];

        // Increase the articleCount (track article # - starting at 1)
        var articleCount = i + 1;

        // Create the  list group to contain the articles and add the article content for each
        var $articleList = $("<ul>");
        $articleList.addClass("list-group");

        // Add the newly created element to the DOM
        $("#article-section").append($articleList);

        // If the article has a headline, log and append to $articleList
        var headline = article.headline;
        var $articleListItem = $("<li class='list-group-item articleHeadline'>");

        if (headline && headline.main) {
            console.log(headline.main);
            $articleListItem.append(
                "<span class='label label-primary'>" +
                articleCount +
                "</span>" +
                "<strong> " +
                headline.main +
                "</strong>"
            );
        }

        // If the article has a byline, log and append to $articleList
        var byline = article.byline;

        if (byline && byline.original) {
            console.log(byline.original);
            $articleListItem.append("<h5>" + byline.original + "</h5>");
        }

        // Log section, and append to document if exists
        var section = article.section_name;
        console.log(article.section_name);
        if (section) {
            $articleListItem.append("<h5>Section: " + section + "</h5>");
        }

        // Log published date, and append to document if exists
        var pubDate = article.pub_date;
        console.log(article.pub_date);
        if (pubDate) {
            $articleListItem.append("<h5>" + article.pub_date + "</h5>");
        }

        // Append and log url
        $articleListItem.append("<a href='" + article.web_url + "'>" + article.web_url + "</a>");
        console.log(article.web_url);

        // Append the article
        $articleList.append($articleListItem);
    }
}

// Function to empty out the articles
function clear() {
    $("#article-section").empty();
}

// CLICK HANDLERS
// ==========================================================

// .on("click") function associated with the Search Button
$("#run-search").on("click", function(event) {
    // This line allows us to take advantage of the HTML "submit" property
    // This way we can hit enter on the keyboard and it registers the search
    // (in addition to clicks). Prevents the page from reloading on form submit.
    event.preventDefault();
  
    // Empty the region associated with the articles
    clear();
  
    // Build the query URL for the ajax request to the NYT API
    var queryURL = buildQueryURL();
  
    // Make the AJAX request to the API - GETs the JSON data at the queryURL.
    // The data then gets passed as an argument to the updatePage function
    $.ajax({
      url: queryURL,
      method: "GET",
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization','Bearer '+ yelpFapi);
    },
    }).then(updatePage);
  });

//  .on("click") function associated with the clear button
$("#clear-all").on("click", clear);
