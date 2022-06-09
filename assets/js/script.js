function lookUpCity() {
    // This capitalizes the city name.
    var cityName = ($("#cityName")
    [0].value.trim().toLowerCase().charAt(0).toUpperCase()) + ($("#cityName")
    [0].value.trim().toLowerCase().slice(1));

    // fix capitalization with two or three word cities
    const currentData = moment().format('M/D/YYYY');

    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + 
    "&units=imperial&appid=71311474f5b26fb7bbfa0bc1985b90cd";

    fetch(apiURL).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {

                $("#city-name")[0].textContent = cityName + " (" + currentData + ")";

                const latitude = data.coord.lat;
                const longitude = data.coord.lon;
                apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + 
                latitude + "&lon=" + longitude + 
                "&exclude=minutely,hourly&units=imperial&appid=71311474f5b26fb7bbfa0bc1985b90cd";

                fetch(apiURL).then(function (newResponse) {
                    if (newResponse.ok) {
                        newResponse.json().then(function (newData) {
                            getCurrentWeather(newData);
                        })
                    }
                })
            })
        } else {
            alert("Cannot find City!");
        }
    })
}

function getCurrentWeather(data) {
    console.log(data);
    
    $(".results-panel").addClass("show-element");

    $("#temperature")[0].textContent = "Temperature: " + data.current.temp.toFixed(1) + " \u2109";
    $("#temperature")[0].textContent = "Humidity: " + data.current.humidity + "% ";
    $("#wind-speed")[0].textContent = "Wind Speed: " + data.current.wind_speed.toFixed(1) + " MPH";
    $("#uv-index")[0].textContent = "UV Index: " + data.current.uvi;

    getCurrentWeather(data);
    // convertUnixTime(data);
}

function getFutureWeather(data) {
    var futureWeatherList = [];
    for (var i = 0; i < 5; i++) {
        var futureWeather = {
            date: convertUnixTime(data, i),
            icon: "http://openweathermap.org/img/wn/" + data.daily[i + 1].weather[0].icon + "@2x.png",
            temp: data.daily[i + 1].temp.day,
            humidity: data.daily[i + 1].humidity
        }
        futureWeatherList.push(futureWeather);
    }
    console.log(futureWeatherList);
}

function convertUnixTime(data, index) {
    const dataObject = new DataTransfer(data.daily[index + 1].dt * 1000);

    return (dataObject.toLocaleDataString());
}

$("#search-button").on("click", function (e) {
    e.preventDefault();

    lookUpCity();
})