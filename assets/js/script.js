// Global variables for html elements
var searchHistory = document.querySelector(".searchHistory");
var searchIcon = document.querySelector(".search-icon");
var inputBox = document.querySelector(".searchInput");
var currentWeatherBox = document.querySelector(".currentWeather");
currentWeatherBox.setAttribute("style", "display: none");

// Array for user search history
var userHistory = [];

// renderHistory(); 

// Current city value
var cityValue = "";

// Function that stores "userHistory"
function stringify() {
    localStorage.setItem("userHistory", JSON.stringify(userHistory));
}

// Function that renders current weather information
function renderWeather() {
    // Display current date in current weather box
    var today = new Date();
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var monthNum = today.getMonth();
    var currentMonth = months[monthNum];
    var date = ("(" + currentMonth+' '+today.getDate()+', '+today.getFullYear() + ")");

    // Clears divs with each new search
    searchHistory.innerHTML = "";
    currentWeatherBox.innerHTML="";
    currentWeatherBox.setAttribute("style", "display: block");

    // Pushes each new entry into array storing city names
    cityValue = inputBox.value;
    userHistory.push(cityValue);

    // stringify();

    window.localStorage.clear();
    
    // Current weather API URL
    var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q="+ inputBox.value + "&appid=72a3f58b137da7e6c57de0a82c88017a";

    // AJAX call for current weather
    $.ajax({
        url: weatherURL,
        method: "GET"
    }).then(function(response) {
        // Creates variables containing coordinates of searcged city
        var lat = response.coord.lat;
        var lon = response.coord.lon;

        // For loop that creates block for each item in the search history
        for (var i=0; i < userHistory.length; i++) {
            var historyBlock = document.createElement("div");
            historyBlock.setAttribute("class", "historyBlock");
            historyBlock.innerHTML = userHistory[i];
            searchHistory.prepend(historyBlock);
        }

        // HTML div for five day forecast
        var fiveDayDiv = document.querySelector(".fiveDay");
        fiveDayDiv.innerHTML="";

        // Current weather div created elements
        var cityName = document.createElement("h1");
        var currentDate = document.createElement("h5");
        var weatherIcon = document.createElement("img");
        var weatherIconHTML = "http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png";
        var temp = document.createElement("p");
        var humidity = document.createElement("p");
        var wind = document.createElement("p");
        var uvIndex = document.createElement("p");

        // Inner HTML for current weather elements
        cityName.innerHTML = response.name;
        currentDate.innerHTML = date;
        temp.innerHTML = "Temperature: " + ((response.main.temp - 273.15) * (9 / 5) + 32).toFixed(0) + "&#8457";
        humidity.innerHTML = "Temperature: " + response.main.humidity;
        humidity.innerHTML = "Humidity: " + response.main.humidity + "%";
        wind.innerHTML = "Wind Speed: " + response.wind.speed + " MPH";

        // Adding classes to current weather elements
        cityName.setAttribute("class", "cityName");
        weatherIcon.setAttribute("src", weatherIconHTML);
        weatherIcon.setAttribute("class", "weatherIcon");
        currentDate.setAttribute("class", "date");
        uvIndex.setAttribute("class", "uvIndex");

        // Appending elements to current weather div
        currentWeatherBox.appendChild(cityName);
        currentWeatherBox.appendChild(weatherIcon);
        currentWeatherBox.appendChild(currentDate);
        currentWeatherBox.appendChild(temp);
        currentWeatherBox.appendChild(humidity);
        currentWeatherBox.appendChild(wind);

        // UV Index api url
        var uvURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=72a3f58b137da7e6c57de0a82c88017a";

        // AJAX call for 5 day forecasr
        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function(response) {
            // UV Index current value
            uvIndex.innerHTML = "UV Index: " + response.value;

            // Changes background color based on danger of UV levels
            if (response.value <= 2) {
                uvIndex.setAttribute("style", "background-color: #8DE760 ");
                console.log("It works!");
            } else if (response.value > 2 && response.value <= 5) {
                uvIndex.setAttribute("style", "background-color: #E4F06E ");
                console.log("It works!");
            } else if (response.value >= 5 && response.value <= 8) {
                uvIndex.setAttribute("style", "background-color: #EBAC57 ");
                console.log("It works!")
            } else if (response.value >= 8) {
                uvIndex.setAttribute("style", "background-color: #F34343 ");
                console.log("It works!")
            }

            // Appends UV index to current weather box
            currentWeatherBox.appendChild(uvIndex);

            // Five day forecast api url
            var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityValue + "&appid=72a3f58b137da7e6c57de0a82c88017a"

            // Sets day to current day by setting variable equal to zero
            var day=0;

            // AJAX call for five day forecast
            $.ajax({
                url: fiveDayURL,
                method: "GET"
            }).then(function(response) {
                // Five Day Forecast Loop
                for (var k=0; k < 5; k++) {
                    // Creates container for elements
                    var fiveDayBlock = document.createElement("div");
                    fiveDayBlock.setAttribute("class", "fiveDayBlock");
                    fiveDayDiv.appendChild(fiveDayBlock);

                    // Defining API values in variables
                    var forecastDate = (response.list[day].dt_txt.substring(5, 10));
                    var forecastIcon = "https://openweathermap.org/img/wn/" + response.list[day].weather[0].icon + ".png";
                    var forecastKel = (response.list[day].main.temp);
                    var forecastTemp = ((forecastKel - 273.15) * (9 / 5) + 32).toFixed(0);
                    var forecastHumidity = (response.list[day].main.humidity);
                    day += 8;

                    // Creating 5 day block elements
                    var dateP = document.createElement("p");
                    var iconImg = document.createElement("img");
                    var tempP = document.createElement("p");
                    var humidityP = document.createElement("p");

                    // Setting innerHTML and attributes for block elements
                    dateP.innerHTML=forecastDate;
                    dateP.setAttribute("style", "font-size: 18px; font-weight: bold;")
                    iconImg.setAttribute("src", forecastIcon);
                    tempP.innerHTML="Temperature: " + forecastTemp + "&#8457";
                    humidityP.innerHTML="Humidity: " + forecastHumidity + "%";

                    // Appending 5 day block elements
                    fiveDayBlock.appendChild(dateP);
                    fiveDayBlock.appendChild(iconImg);
                    fiveDayBlock.appendChild(tempP).appendChild(humidityP);
                }
            })
        })
        // Event listener for each history block
        $(".historyBlock").on("click", function(event) {
            var cityClicked = event.target.innerHTML;
            inputBox.value = cityClicked;
            cityValue = cityClicked;
            console.log(event.target.innerHTML);
            renderWeather();
        })
        inputBox.value = "";
    }
    )};

// function renderHistory() {
//     var storedCities = JSON.parse(localStorage.getItem("userHistory"));

//     if (storedCities === null) {
//         console.log("Nothing here!");
//     } else {
//         userHistory.push(storedCities);
//         localStorage.setItem("userHistory", JSON.stringify(userHistory));
//     for (var i=0; i < userHistory.length; i++) {
//         var historyBlock = document.createElement("div");
//         historyBlock.setAttribute("class", "historyBlock");
//         historyBlock.innerHTML = storedCities[i];
//         searchHistory.prepend(historyBlock);
//     }
// }
// }

// Click and "enter" button event listeners for rendering weather for city searched
searchIcon.addEventListener("click", renderWeather);
document.addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) { 
        e.preventDefault();
        renderWeather();
    }
});

// Clears search history
var clearBtn = document.querySelector(".clear");

// Event listener for clear button
clearBtn.addEventListener("click", function() {
    window.localStorage.clear();
    window.location.reload();
})


