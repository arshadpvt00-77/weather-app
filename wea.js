



const API_KEY = "56efbbd80ba44311b2b94234261811";



const city = document.getElementById("cityinput");
const btn = document.getElementById("Searchbtn");

const loc = document.getElementById("location");
const cond = document.getElementById("WeatherCondition");
const feel = document.getElementById("feelslike");
const temp = document.getElementById("Temperature");
const hl = document.getElementById("high-or-low");

const wind = document.getElementById("wind");
const hum = document.getElementById("humidity");
const uv = document.getElementById("uv");

const rise = document.getElementById("sunrise");
const set = document.getElementById("sunset");

const hours = document.getElementById("hourlycontain");

const favoriteBtn = document.getElementById("favoriteBtn");
const favoritesList = document.getElementById("favoritesList");




let currentCity = "";

let debounceTimer;

let requestNumber = 0;



let favorites = [];

try {

    favorites = JSON.parse(
        localStorage.getItem("favorites")
    ) || [];

} catch (error) {

    favorites = [];

}




async function getWeather(name) {

    name = name.trim();

    if (!name) {
        return;
    }

    const thisRequest = ++requestNumber;

    try {

        const url =
            `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(name)}&days=2&aqi=no&alerts=no`;

        const res = await fetch(url);

        const data = await res.json();

        if (!res.ok) {

            throw new Error(
                data.error?.message || "Weather request failed"
            );

        }

        
        if (thisRequest !== requestNumber) {
            return;
        }



        currentCity = data.location.name;

        loc.textContent =
            `${data.location.name}, ${data.location.country}`;


        

        cond.textContent =
            data.current.condition.text;

        feel.textContent =
            `Feels Like ${data.current.feelslike_c}°C`;

        temp.textContent =
            `${data.current.temp_c}°C`;


        

        const today = data.forecast.forecastday[0];

        hl.textContent =
            `H: ${today.day.maxtemp_c}° | L: ${today.day.mintemp_c}°`;



        const img = document.querySelector(".Weather-image img");

        img.src =
            "https:" + data.current.condition.icon;

        img.alt =
            data.current.condition.text;



        wind.textContent =
            data.current.wind_kph + " km/h";

        hum.textContent =
            data.current.humidity + "%";

        uv.textContent =
            data.current.uv;


        rise.textContent =
            "Sunrise: " + today.astro.sunrise;

        set.textContent =
            "Sunset: " + today.astro.sunset;


    

        const allHours = data.forecast.forecastday.flatMap(
            day => day.hour
        );

        const currentHour =
            Math.floor(data.location.localtime_epoch / 3600) * 3600;

        const nextHours = allHours
            .filter(hour => hour.time_epoch >= currentHour)
            .slice(0, 3);


        hours.innerHTML = "";


        nextHours.forEach(hour => {

            const div = document.createElement("div");

            const time = hour.time.split(" ")[1];

            let h = Number(time.split(":")[0]);

            const m = time.split(":")[1];

            const period = h >= 12 ? "PM" : "AM";

            h = h % 12 || 12;


            div.innerHTML = `
                <p>${h}:${m} ${period}</p>

                <img
                    src="https:${hour.condition.icon}"
                    alt="${hour.condition.text}"
                >

                <p>${hour.temp_c}°C</p>
            `;

            hours.appendChild(div);

        });


        updateFavoriteButton();

    }

    catch (error) {

        if (thisRequest !== requestNumber) {
            return;
        }

        console.log(error);

        alert("Weather Error: " + error.message);

    }

}




city.addEventListener("input", function () {

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(function () {

        getWeather(city.value);

    }, 600);

});




btn.addEventListener("click", function () {

    clearTimeout(debounceTimer);

    getWeather(city.value);

});



city.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        clearTimeout(debounceTimer);

        getWeather(city.value);

    }

});




favoriteBtn.addEventListener("click", function () {

    if (!currentCity) {

        alert("Please search a city first!");

        return;

    }

    const alreadyAdded = favorites.some(
        name => name.toLowerCase() === currentCity.toLowerCase()
    );

    if (alreadyAdded) {

        alert("City already added to favorites!");

        return;

    }


    favorites.push(currentCity);

    saveFavorites();

    displayFavorites();

    updateFavoriteButton();

});




function saveFavorites() {

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

}




function displayFavorites() {

    favoritesList.innerHTML = "";


    if (favorites.length === 0) {

        const message = document.createElement("p");

        message.textContent = "No favorite cities yet.";

        message.className = "empty-message";

        favoritesList.appendChild(message);

        return;

    }


    favorites.forEach(cityName => {

        const div = document.createElement("div");


        
        const cityButton = document.createElement("button");

        cityButton.textContent = cityName;

        cityButton.addEventListener("click", function () {

            city.value = cityName;

            clearTimeout(debounceTimer);

            getWeather(cityName);

        });


        
        const removeButton = document.createElement("button");

        removeButton.textContent = "❌";

        removeButton.className = "remove-btn";

        removeButton.addEventListener("click", function () {

            removeFavorite(cityName);

        });


        div.appendChild(cityButton);

        div.appendChild(removeButton);

        favoritesList.appendChild(div);

    });

}



function removeFavorite(cityName) {

    favorites = favorites.filter(
        name => name.toLowerCase() !== cityName.toLowerCase()
    );

    saveFavorites();

    displayFavorites();

    updateFavoriteButton();

}




function updateFavoriteButton() {

    if (!currentCity) {
        return;
    }

    const alreadyAdded = favorites.some(
        name => name.toLowerCase() === currentCity.toLowerCase()
    );


    if (alreadyAdded) {

        favoriteBtn.textContent = "⭐ Added to Favorites";

    } else {

        favoriteBtn.textContent = "⭐ Add to Favorites";

    }

}




document.getElementById("todayBtn").addEventListener("click", function () {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


document.getElementById("hourlyBtn").addEventListener("click", function () {

    document.querySelector(".hourly-forecast").scrollIntoView({
        behavior: "smooth"
    });

});


document.getElementById("savedBtn").addEventListener("click", function () {

    document.querySelector(".favorites-section").scrollIntoView({
        behavior: "smooth"
    });

});



displayFavorites();




getWeather("Kozhikode");
