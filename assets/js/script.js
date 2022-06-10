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

    $("#currentIcon")[0].src = "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png";

    $("#temperature")[0].textContent = "Temperature: " + data.current.temp.toFixed(1) + " \u2109";
    $("#temperature")[0].textContent = "Humidity: " + data.current.humidity + "% ";
    $("#wind-speed")[0].textContent = "Wind Speed: " + data.current.wind_speed.toFixed(1) + " MPH";
    // $("#uv-index")[0].textContent = "UV Index: " + data.current.uvi;
    $("#uv-index")[0].textContent = " " + data.current.uvi;

    checkUVIndex(data.current.uvi);
    getCurrentWeather(data);
}

function checkUVIndex(uvIndex) {
    console.log(uvIndex);

    if (uvIndex < 3) {
        $("#uv-index").removeClass("moderate, severe");
        $("#uv-index").addClass("favorable");
    } else if (uvIndex <6) {
        $("#uv-index").removeClass("favorable, severe");
        $("#uv-index").addClass("moderate");
    } else {
        $("#uv-index").removeClass("favorable, moderate");
        $("#uv-index").addClass("severe");
    }
}

function getFutureWeather(data) {
    for (var i = 0; i < 5; i++) {
        var futureWeather = {
            date: convertUnixTime(data, i),
            icon: "http://openweathermap.org/img/wn/" + data.daily[i + 1].weather[0].icon + "@2x.png",
            temp: data.daily[i + 1].temp.day.toFixed(1),
            humidity: data.daily[i + 1].humidity
        }

        var currentSelector = "#day-" + i;
        $(currentSelector)[0].textContent = futureWeather.date;
        currentSelector = "#img-" + i;
        $(currentSelector)[0].src = futureWeather.icon;
        currentSelector = "#temp-" +i;
        $(currentSelector)[0].textContent = "Temp: " + futureWeather.temp + " \u2109";
        currentSelector = "#hum-" + i;
        $(currentSelector)[0].textContent = "Humidity: " + futureWeather.humidity + "%";
    }
}

function convertUnixTime(data, index) {
    const dataObject = new DataTransfer(data.daily[index + 1].dt * 1000);

    return (dataObject.toLocaleDataString());
}

$("#search-button").on("click", function (e) {
    e.preventDefault();

    lookUpCity();
})