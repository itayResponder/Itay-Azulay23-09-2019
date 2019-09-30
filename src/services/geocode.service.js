import Axios from 'axios';
const API_KEY = 'JMUSLpGbNSeB7yqZgYVYSabAT4Ebd7Bw';

export default {
    getAutoComplete,
    getWeatherCity,
    getWeatherForecast,
    getCurrLocation
}

function getAutoComplete(search) {
    return Axios.get(`https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${API_KEY}&q=${search}`)
}

function getWeatherCity(cityCode) {
    return Axios.get(`https://dataservice.accuweather.com/currentconditions/v1/${cityCode}?apikey=${API_KEY}`)
}

function getWeatherForecast(cityCode, isMetric=true) {
    return Axios.get(`https://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityCode}?apikey=${API_KEY}&metric=${isMetric}`)
}

function getCurrLocation(lat, lon) {
    return Axios.get(`https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${API_KEY}&q=${lat}%2C${lon}`)
}