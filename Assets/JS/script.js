var gifButtons = ["dog", "cat", "bird"];

function addGIFs() {
    var topic = $(this).attr("data-topic");
    var searchURL = "https://api.giphy.com/v1/gifs/search?q=" + topic + "&api_key=HfUGjDcXfLgSjemXwyzikpRNZcuWT9Ir&limit=10"; 
    $.ajax({
        url: searchURL,
        method: "GET"
    })
    .then(function(response) {       
        var results = response.data;
        var list = $("#gifs");


        for (var i =0; i <results.length; i++) {
            var gifDiv = $("<div>");            

            var rating = results[i].rating;    
            var p = $("<p>").text("Rating: " + rating);
    
            var gifImage = $("<img>");
            gifImage.attr("src", results[i].images.fixed_height_small_still.url);
            gifImage.attr("data-still", results[i].images.fixed_height_small_still.url);
            gifImage.attr("data-animate", results[i].images.fixed_height.url);
            gifImage.attr("data-status", "still");
            gifImage.addClass("gif-img");
            gifImage.addClass("gif-cir");
    
            // gifDiv.prepend(p);
            gifDiv.prepend(gifImage);    
            $("#gifs").prepend(gifDiv);

            var listItem = gifDiv;
            list.append(listItem);
            var listItems = $(".gif-img");
            updateLayout(listItems);
    
        function updateLayout (listItems) {
                for (var i = 0; i < listItems.length; i++) {
                  var offsetAngle = 360 / listItems.length;
                  var rotateAngle = offsetAngle * i;
                  $(listItems[i]).css("transform", "rotate(" + rotateAngle + "deg) translate(0, -200px) rotate(-" + rotateAngle + "deg)")
                };
              };
                

        };

    });
};

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

function gifAnimation() {
    var state = $(this).attr("data-status");
    var play = $("#play");
    var hiddenGif = $(this);  

    var playImg = $("<img>");

    if (state === "still") {
        playImg.removeClass("gif-cir");
        playImg.addClass("gif-img");  
        playImg.appendTo(play);
        playImg.attr("src", $(this).attr("data-animate"));
        hiddenGif.addClass("hidden");
        playImg.attr("data-status", "animate");
        $('.gif-cir').addClass("unclickable");  
    } else if (state === "animate") {
        $("#gifs").find("*").removeClass("hidden");
        $('.gif-cir').removeClass("unclickable");  
        playImg.attr("src", playImg.attr("data-still"));
        playImg.attr("data-status", "still");
        $("#play").empty();
    }
}

$("#searchBtn").on("click", function(event) {
    event.preventDefault();
    var newGif = $("#gifTerm").val().trim();
    gifButtons.push(newGif);
    addButtons();
    $("#gifTerm").val('');
    
});

$(document).on("click", ".gif-pop", addGIFs);
$(document).on("click", ".gif-img", gifAnimation);

addButtons();


//clear gifs and repopulate when new topic button selected
//make gifs bootstrap cards w/ rating at bottom
//header
//style search bar and button
//allow user to "favorite" gifs
