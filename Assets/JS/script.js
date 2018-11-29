var gifButtons = ["elephant", "dog", "cat", "whale", "bird", "snake"];
var hiddenGif;

//section to search for and add gifs
function addGIFs() {
    var topic = $(this).attr("data-topic");
    var searchURL = "https://api.giphy.com/v1/gifs/search?q=" + topic + "&api_key=HfUGjDcXfLgSjemXwyzikpRNZcuWT9Ir&limit=10"; 
    
    clearGIFs();

    $.ajax({
        url: searchURL,
        method: "GET"
    })
    .then(function(response) {               
        var results = response.data;
        var gifList = $("#gifs");

        for (var i =0; i <results.length; i++) {
            var gifDiv = $("<div>");        
            var gifImage = $("<img>");

            //create gifImage elems
            gifImage.attr("src", results[i].images.fixed_height_small_still.url);
            gifImage.attr("data-still", results[i].images.fixed_height_small_still.url);
            gifImage.attr("data-animate", results[i].images.fixed_height.url);
            gifImage.attr("data-rating", results[i].rating);
            gifImage.attr("data-status", "still");
            gifImage.addClass("gif-img");
            gifImage.addClass("gif-cir");
    
            gifDiv.prepend(gifImage);    
            $("#gifs").prepend(gifDiv);

            //create gifItems, append, and call updateLayout to position on circle
            var gifItem = gifDiv;
            gifList.append(gifItem);
            var gifItems = $(".gif-img");
            updateLayout(gifItems);
        }; 
        //calc ofsset and rotate angles for each gif
        function updateLayout (gifItems) {
                for (var i = 0; i < gifItems.length; i++) {
                  var offsetAngle = 360 / gifItems.length;
                  var rotateAngle = offsetAngle * i;
                  $(gifItems[i]).css("transform", "rotate(" + rotateAngle + "deg) translate(0, -200px) rotate(-" + rotateAngle + "deg)")
                };
        };
    });
};

//new gif topic buttons
function addButtons() {
    $("#gif-buttons").empty();

    for (var i = 0; i < gifButtons.length; i++) {
        var newButton = $("<button>");
        newButton.addClass("gif-pop");
        newButton.attr("data-topic", gifButtons[i]);
        newButton.text(gifButtons[i]);
        $("#gif-buttons").append(newButton);
    }
};


//create gif card, assign classes and attrs, append to "play" area
function gifCard(imgSrc, gifRating) {
    var playImg = $("<img>");
    var cardOverlay = $("<div>");
    var cardText = $("<p>");
    var favButton = $("<button>");
    var iconHTML = '<i class="far fa-heart"></>';
    
    playImg.attr("src", imgSrc);
    playImg.removeClass("gif-cir");
    playImg.addClass("gif-img").addClass("card-img");   
    playImg.attr("data-status", "animate");
    playImg.appendTo(play);

    cardOverlay.addClass("card-img-overlay");
    cardOverlay.addClass("gif-img");
    cardOverlay.attr("data-status", "animate");

    cardText.addClass("card-text");
    cardText.text("Rating: " + gifRating);
    cardText.appendTo(cardOverlay);

    favButton.addClass("fav-btn");
    favButton.html(iconHTML);
    favButton.appendTo(cardOverlay);

    cardOverlay.appendTo(play); 
};


//play gifs on click
function gifAnimation() {
    var gifSrc = $(this).attr("data-animate");
    var rating = $(this).attr("data-rating");
    var state = $(this).attr("data-status");
    hiddenGif = $(this); 

    //check data-status attr.  If still, play gif (empty play area, create playing gif card, and adjust classes)
    //if animated, stop gif and return to circle (unhide still div, adjust classes, empty play div)
    if (state === "still") {
        $("#play").empty();
        gifCard(gifSrc, rating);        
        hiddenGif.addClass("hidden");
        $('.gif-cir').addClass("unclickable");
        $('.fav-img').addClass("unclickable");   
    } else if (state === "animate") {
        $("#gifs").find("*").removeClass("hidden");
        $('.gif-cir').removeClass("unclickable");
        $('.fav-img').removeClass("unclickable");
        $(".favorites").find("*").removeClass("hidden");
        $("#play").empty();
    };    
};


//section to add favorites
var favObj = {

    favorites: JSON.parse(localStorage.getItem('favorites')) || [],

    //create a new favorite object, push to favorites array, localstorage.
    addFavorite: function() {   
        var self = favObj;
        console.log(self);
        var lrgSrc = hiddenGif.attr("data-animate");
        var smlSrc = hiddenGif.attr("data-still");
        var rating = hiddenGif.attr("data-rating");

        //new object
        var newFav = {
            dataStill: smlSrc,
            dataAnimate: lrgSrc,
            dataRating: rating
        };    
        
        //check to see if already in array; if not, push to favs and setitem in localstorage
        if ((self.favorites.filter(fav => (fav.dataStill === smlSrc))).length > 0) {
            alert("You already favorited that one.");
        } else {
            self.favorites.push(newFav);
            localStorage.clear();
            localStorage.setItem('favorites', JSON.stringify(self.favorites));
        }

        self.renderFavs();
    
    },

    //add still gifs to favorites
    renderFavs: function() {

        var self = favObj;
        $(".favorites").empty();

        for (var i =0; i < self.favorites.length; i++) {
            var favDiv = $("<div>");        
            var favImage = $("<img>");

            //create favImage elems
            favImage.attr("src", self.favorites[i].dataStill);
            favImage.attr("data-still", self.favorites[i].dataStill);
            favImage.attr("data-animate", self.favorites[i].dataAnimate);
            favImage.attr("data-rating", self.favorites[i].dataRating);
            favImage.attr("data-status", "still");
            favImage.addClass("fav-img"); 

            //construct favDiv and append to favorites
            favDiv.prepend(favImage);    
            $(".favorites").append(favDiv);
        }   
    },

};

//empty gifs div, add play div back;
function clearGIFs() {
    $("#gifs").empty();
    var playDiv = $("<div>"); 
    playDiv.addClass("playingGif");
    playDiv.addClass("card");
    playDiv.attr("id", "play");
    $("#gifs").append(playDiv);
};



//*** event handlers below ***

//search for and add new gif categories
$("#searchBtn").on("click", function(event) {
    event.preventDefault();
    var newGif = $("#gifTerm").val().trim();
    gifButtons.push(newGif);
    addButtons();
    $("#gifTerm").val('');    
});


//favorite gifs on click
$(document).on("click", ".fav-btn", favObj.addFavorite);

//add gifs to circle
$(document).on("click", ".gif-pop", addGIFs);

//play gif
$(document).on("click", ".gif-img", gifAnimation);
$(document).on("click", ".fav-img", gifAnimation);


addButtons();
favObj.renderFavs();



