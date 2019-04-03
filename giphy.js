$(document).ready(function(){
    var app = {
        // default of the number of gifs per row
        defaultNumGifs: 4,
        // default of the number of rows used to display the gifs
        defaultNumRows: 3,
        // number of gifs to be displayed per row
        gifsPerRow: 4,
        // number of rows to be used to display the gifs
        displayRows: 3,
        // holder for the ajax call response
        gifObject: {},
        // initial button array
        buttons: ["Better Off Dead", "The Goonies", "Vacation", "The Princess Bride", "Back to the Future", "Ghostbusters", "Ferris Bueller's Day Off", "Beetlejuice", "Scrooged", "Real Genius", "Airplane!", "Fast Times at Ridgemont High", "Weird Science", "Caddyshack", "Trading Places", "Spaceballs", "Weekend at Bernie's", "Big Trouble in Little China", "One Crazy Summer", "A Christmas Story"],
        // method to display the button in the button array
        displayButtons: function(){
            // clears the button location
            $("#buttons").empty();
            // loops through the button array and adds buttons to the DOM
            app.buttons.forEach(function(item){
                // button with label
                var bttn = $("<button>").text(item);
                // add classes to the buttons
                bttn.addClass("btn btn-default gifButtons");
                // add data to the buttons (replaces spaces with "+")
                bttn.attr("data", item.replace(/\s/g, "+"))
                // appends the finished buttons
                $("#buttons").append(bttn);
            });
            app.displaySettings();
        },
        // method to display the settings in the form text boxes
        displaySettings: function(){
            $("#numGifs-input").val(app.gifsPerRow);
            $("#numRows-input").val(app.displayRows);
        },
        // method to reset the gifs
        resetGifs: function(){
            // empty the gif location
            $("#gifLocation").empty();
            // remove active styling from any previously selected category button
            $(".act").removeClass("act");
        },
        // method to display the gifs
        displayGifs: function(){
            // declare local variables
            var category = $(this).attr("data");
            var apiKey = "7rSO11KnqXxXvu2uymZBS0hR77yFRh9E";
            var numberOfGifs = app.gifsPerRow * app.displayRows;
            var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + category + "+movies&api_key=" + apiKey + "&limit=" + numberOfGifs;
            // call the method to reset the gifs
            app.resetGifs();
            // force active styling for the currently seleted category
            $(this).addClass("act");
            // create the rows to house the gifs and ratings
            for (var i = 1; i < (app.displayRows + 1); i += 1){
                var gifRow = $("<div>").addClass("row");
                gifRow.attr("id", "row" + i);
                $("#gifLocation").append(gifRow);
            };
            // ajax call to get the gif object
            $.ajax({
                url: queryURL,
                method: "GET"
            }).done(function(response) {
                // store the gif object for later use
                app.gifObject = response;
                // local variable to keep track of the row number
                var x = 1;
                // for loop to get the arguments for and to call the gifAppend method
                for (var i = 0; i < response.data.length; i += app.gifsPerRow){
                    // variable to set the endpoint of the gifAppend method
                    var end = i + app.gifsPerRow;
                    // call the gifAppend method to append the specified number of gifs onto each row
                    app.gifAppend(i, end, x, response);
                    // increment the row number
                    x += 1;
                };
            });
        },
        // method to create divs to house the ratings and gifs and append them to the appropriate row
        gifAppend: function(start, stop, rowNumber, obj){
            for (var j = start; j < stop; j += 1){
                // local variable to calculate the bootstrap grid width
                var numCols = 12 / app.gifsPerRow;
                // create div to house the rating and gif
                var gifDiv = $("<div>").addClass("col-sm-" + numCols + " still gif");
                gifDiv.attr("id", j);
                // create the paragraph element to house the rating
                var rating = $("<p>").text("Rating: " + obj.data[j].rating);
                // create the image element to house the gif
                var gif = $("<img>").attr("src", obj.data[j].images.original_still.url);
                gif.attr("alt", obj.data[j].title);
                // append the paragraph and image elements onto the div
                gifDiv.append(rating, gif);
                // append the div with the rating and gif onto the appropriate row div
                $("#row" + rowNumber).append(gifDiv);
            };
        },
        // method to toggle the gif animation on and off
        toggleGifAnimation: function(){
            // if - else to determine if the gif is moving or still
            if ($(this).hasClass("still")){
                // changes class from still to motion
                $(this).removeClass("still");
                $(this).addClass("motion");
                // gets the id of the div selected (cooresponds to the array index of the original item)
                var sel = parseInt($(this).attr("id"));
                // changes the image source to the animated gif
                var ani = app.gifObject.data[sel].images.original.url;
                $("#" + sel + " img").attr("src", ani);
            }
            else{
                // changes class from motion to still
                $(this).removeClass("motion");
                $(this).addClass("still");
                // gets the id of the div selected (cooresponds to the array index of the original item)
                var sel = parseInt($(this).attr("id"));
                // changes the image source to the still picture
                var ani = app.gifObject.data[sel].images.original_still.url;
                $("#" + sel + " img").attr("src", ani);
            };
        },
        // method to add a gif category button
        addButton: function(event){
            event.preventDefault();
            // gets the input from the textbox
            var newButton = $("#button-input").val().trim();
            //makes sure the input value is not already in the array
            if (app.buttons.indexOf(newButton) === -1){
              app.buttons.push(newButton);
            };
            $("#button-input").val("");
            // calls the displayButtons method to display the buttons (gif categories) array in a series of buttons
            app.displayButtons();
        },
        // method to change the display settings
        changeSettings: function(event){
            event.preventDefault();
            // local variable to store id of the button that was clicked
            var settingsClicked = $(this).attr("id");
            // call the method to reset the gifs
            app.resetGifs();
            // if the default settings button is clicked set the number of gifs per row and the number of display rows to the default values
            if (settingsClicked === "reset-button"){
                app.gifsPerRow = app.defaultNumGifs;
                app.displayRows = app.defaultNumRows;
            }
            else{
                // changes the values entered into numbers and takes the absolute value (no negative numbers)
                app.gifsPerRow = parseInt($("#numGifs-input").val());
                var newNumRows = Math.abs(parseInt($("#numRows-input").val().trim()));
                // if one of the values is either NaN or 0, will reset to the default value; otherwise uses the entered number
                if (isNaN(newNumRows) || newNumRows === 0){
                    app.displayRows = app.defaultNumRows;
                }
                else{
                    app.displayRows = newNumRows;
                }
            };
            // call the display settings method to display the new settings in the form text boxes
            app.displaySettings();
        }
    };
    // calls the displayGifs method on clicking one of the gif category buttons to display the specified number of gifs
    $(document).on("click", ".gifButtons", app.displayGifs);
    // calls the toggleGifAnimation method on clicking one of the gifs to turn the animationon and off
    $(document).on("click", ".gif", app.toggleGifAnimation);
    // calls the addButton method to add a gif category when using the form
    $("#add-button").on("click", app.addButton);
    // calls the changesSettings method to update the display settings (both the Change and Default buttons call the same function)
    $("#reset-button").on("click", app.changeSettings);
    $("#settings-button").on("click", app.changeSettings);
    // the value in the text box disappears when the box is selected (don't have to delete the value before changing)
    $("#numRows-input").on("focus", function(){
        $(this).val("");
    });
    // initial display of the gif buttons
    app.displayButtons();
});