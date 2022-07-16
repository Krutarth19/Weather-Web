// From Document Object Model
const app = document.querySelector('.weather-app');
const temp = document.querySelector('.temp');
const dateOutput = document.querySelector('.date');
const timeOutput = document.querySelector('.time');
const conditionOutput = document.querySelector('.condition');
const nameOutput = document.querySelector('.name');
const icon = document.querySelector('.icon');
const cloudOutput = document.querySelector('.cloud');
const humidityOutput = document.querySelector('.humidity');
const windOutput = document.querySelector('.wind');
const form = document.getElementById('locationInput');
const search = document.querySelector('.search');
const btn = document.querySelector('.submit');
const cities = document.querySelectorAll('.city');

// Setting Default city 
let cityInput = "London";

// Adding event listener
cities.forEach((city) => {
    city.addEventListener('click', (e) => {
        // Change Default city to desired one
        cityInput = e.target.innerHTML;

        // Function for fetch data through weather api
        fetchWeatherData();

        app.style.opacity = "0";
    });
})

// submit event for form
form.addEventListener('submit', (e) => {
    if (search.value.length == 0) {
        alert("Please type city name!");
    } else {
        cityInput = search.value; 
        fetchWeatherData();

        // Remove all search value form the input after search and data fetch
        search.value = "";

        // animation
        app.style.opacity = "0";
    }

    // prevent default behaviour  of form
    e.preventDefault();
});

// A function which will return a day of the week
function dayOfTheWeek(day, month, year) {
    const weekday = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    return weekday[new Date(`${day}/${month}/${year}`).getDay()];
};

// Function that fetches and collect data from whether api
function fetchWeatherData() {
    fetch(`http://api.weatherapi.com/v1/current.json?key=ce80fa1c1c7d4031bdb82502220807&q=${cityInput}`)

        // API returns data into json format so we need to convert it into regular js object
        .then(response => response.json())
        .then(data => {
            console.log(data);

            // adding data to index.html
            temp.innerHTML = data.current.temp_c + "&#176;"
            conditionOutput.innerHTML = data.current.condition.text;

            // Get data and time from the city and extract the day,month,year and time
            const date = data.location.localtime;
            const y = parseInt(date.substr(0, 4));
            const m = parseInt(date.substr(5, 2));
            const d = parseInt(date.substr(8, 2));
            const time = date.substr(11);

            // reformating data of data
            dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}, ${m} ${y}`;
            timeOutput.innerHTML = time;

            // adding name of city into main page
            nameOutput.innerHTML = data.location.name;

            // get corresponding icon from icons folder
            const iconId = data.current.condition.icon.substr("//cdn.weatherapi.com/weather/64x64/".length);

            // reformating icon usr
            icon.src = "icons/" + iconId;

            // adding weather details to this page
            cloudOutput.innerHTML = data.current.cloud + "%";
            humidityOutput.innerHTML = data.current.humidity + "%";
            windOutput.innerHTML = data.current.wind_kph + "km/h";

            // setting default time of day
            let timeOfDay = "day";
            // get usique id for each weather condition
            const code = data.current.condition.code;

            // change night id its night
            if (!data.current.is_day) {
                timeOfDay = "night";
            }

            if (code == 1000) {
                // set bg image vlear if weather is clear
                app.style.backgroundImage = `url(images/${timeOfDay}/clear.jpg)`
                // change button to night mode
                btn.style.background = "#e5ba92";
                if (timeOfDay == "night") {
                    btn.style.background = "#181e27";
                }
            }
            // something weather is cloudy
            else if (code == 1003 || code == 1006 || code == 1009 || code == 1030 || code == 1069 || code == 1087 || code == 1135 || code == 1273 || code == 1276 || code == 1279 || code == 1282) {
                app.style.backgroundImage = `url(images/${timeOfDay}/cloud.jpg)`;
                btn.style.background = "#fa6d1b";
                if (timeOfDay == "night") {
                    btn.style.background = "#181e27";
                }
            }
            // weather is rainy
            else if (code == 1063 || code == 1069 || code == 1072 || code == 1150 || code == 1153 || code == 1180 || code == 1183 || code == 1186 || code == 1189 || code == 1192 || code == 1195 || code == 1204 || code == 1207 || code == 1240 || code == 1243 || code == 1246 || code == 1249 || code == 1252) {
                app.style.backgroundImage = `url(images/${timeOfDay}/rainy.jpg)`;
                btn.style.background = "#647d75";
                if (timeOfDay == "night") {
                    btn.style.background = "#325c80";
                }
            }

            // finally snow
            else {
                app.style.backgroundImage = `url(images/${timeOfDay}/snow.jpg)`;
                btn.style.background = "#4d72aa";
                if (timeOfDay == "night") {
                    btn.style.background = "#1b1b1b";
                }
            }

            // fade in the page once all is done
            app.style.opacity = "1";
        })

        // If the user types a city that doesn't exits,throw an alert!
        .catch(() => {
            alert("City not found, Please try again");
            app.style.opacity = "1";
        });
}

// call  the function one load page
fetchWeatherData();

// Fade in page
app.style.opacity = "1";



