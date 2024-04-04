let inputBox = document.getElementById("input-box");
let searchButton = document.getElementById("search-button");
let isLocation = document.getElementById("location-available");
let container = document.getElementById("weather-box");
let description = document.getElementById("description");
let notFoundContainer = document.getElementById("NotFound");
let notFoundImg = document.getElementById("notFoundImg");
let notFoundDesc = document.getElementById("notfoundDesc");
let loader = false;
let cityName = "";
const APIKEY = "82005d27a116c2880c8f0fcb866998a0";
const BASEURL = "http://api.openweathermap.org";

//handle search button on keypress enter
inputBox.addEventListener("keydown", function (e) {
  if (e.code === "Enter") {
    searchClick();
  }
});

if (inputBox.length === 0) {
  searchButton.disabled = true;
}

//Fetching weather details according to location name
const fetchData = async (city) => {
  //loader true when fetching start
  loader = true;
  isLoader();

  //Find latitude and longitude base on the city name
  const data = await fetch(
    `${BASEURL}/geo/1.0/direct?q=${city}&limit=${5}&appid=${APIKEY}`
  );
  const jsonData = await data.json();

  //If City name find then proceed further otherwise we jump on else block and update on webpage location not found
  if (jsonData.length > 0) {
    const latitute = jsonData[0].lat;
    const longitude = jsonData[0].lon;
    fetchWeatherDetails(latitute, longitude);
  } else {
    //also location not find then loader false and update on webpages
    loader = false;
    isLoader();

    //Weather-container hide when city not found
    container.style.display = "none";

    //Not found container show when city not found and update details
    notFoundContainer.style.display = "block";
    notFoundImg.src = "/assets/unknown.png";
    notFoundDesc.innerText = "Oops city not found.";
    inputBox.value = "";
  }
};

//Fetching weather details base on Latitude and longitude
const fetchWeatherDetails = async (lat, lon) => {
  const weatherDetails =
    await fetch(`${BASEURL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}
  `);
  const weatherDetailsJson = await weatherDetails.json();
  if (weatherDetailsJson) {
    //When fetching complete then false loader
    loader = false;
    isLoader();

    //Pass weather details in UpdateDom Function
    updateWeatherDetails(weatherDetailsJson);
  }
};

//This function invoke when Search button click
const searchClick = async () => {
  isLocation.style.display = "none";

  //If user input nothing we will not do nothing
  if (inputBox.value === "") {
    return;
  }

  //Get location from input box
  const city = inputBox.value;

  //call fetch function base location
  fetchData(city);
};

//Update element on weatherdetails
const updateWeatherDetails = (details) => {
  cityName = cityName.length === 0 ? details.name : inputBox.value;

  //Weather container display block when start updating value
  container.style.display = "block";

  //Not Found Box display hide
  notFoundContainer.style.display = "none";

  //Update icon accroding to recieve icon
  document.getElementById(
    "weatherImg"
  ).src = `./assets/${details.weather[0].icon}.png`;
  //Update value of temprature
  document.getElementById("temp").innerText = `${(
    details.main.temp - 273.15
  ).toFixed(0)}`;

  //update value of description
  description.innerText = details.weather[0].description;

  //update value of city name and country name
  document.getElementById("location").innerText = `${
    cityName[0].toLocaleUpperCase() + cityName.substring(1)
  },${details.sys.country}`;

  //update humidity and wind
  document.getElementById("humidity").innerText = `${details.main.humidity}%`;
  document.getElementById("wind").innerText = `${details.wind.speed}km/hr`;

  //update background image on basis of weather condition
  const imagesObject = {
    Clouds: "url('/assets/cloudBg.png')",
    Clear: "url('/assets/clearBG.webp')",
    Rain: "url('/assets/rainBg.jpg')",
    Mist: "url('/assets/cloudBg.png')",
    Snow: "url('/assets/snowBg.jpg')",
    Haze: "url('/assets/clearBG.webp')",
  };
  document.body.style.backgroundImage = imagesObject[details.weather[0].main];
  //After click input box clear
  inputBox.value = "";
};

//Find auto detect location with the help of buit in navigator object
if ("geolocation" in navigator) {
  //GetCurrentPosition
  navigator.geolocation.getCurrentPosition(
    geolocationSuccess,
    geolocationError
  );
} else {
  alert("Geolocation is not Available.");
}

//If location not found update on webpages
function geolocationError() {
  container.style.display = "none";
  notFoundContainer.style.display = "block";
  notFoundImg.src = "/assets/unknown.png";
  notFoundDesc.innerText = "Current location not found.";
}

//To find latitude and longitude of current location
async function geolocationSuccess(position) {
  //Get latitude and longitude from position which is built in Geolocation
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  // Fetch city name according to latitude and longitude
  fetchWeatherDetails(latitude, longitude);
}

//Create loader function
function isLoader() {
  if (loader) {
    searchButton.innerHTML = `<div id="loader"></div>`;
  } else {
    searchButton.innerText = "Search";
  }
}
