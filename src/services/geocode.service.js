import Axios from 'axios';
const API_KEY = '2f9iJlU9fWif9MoKnya0E3ayfFehYOYg';

export default {
    getAutoComplete,
    getWeatherCity,
    getWeatherForecast,
    getCurrLocation
}

function getAutoComplete(search) {
    return Axios.get(`http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${API_KEY}&q=${search}`)
}

function getWeatherCity(cityCode) {
    return Axios.get(`http://dataservice.accuweather.com/currentconditions/v1/${cityCode}?apikey=${API_KEY}`)
}

function getWeatherForecast(cityCode, isMetric=true) {
    return Axios.get(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityCode}?apikey=${API_KEY}&metric=${isMetric}`)
}

function getCurrLocation(lat, lon) {
    return Axios.get(`http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${API_KEY}&q=${lat}%2C${lon}`)
}