import geocodeService from "@/services/geocode.service";
import {storageService}  from '@/services/storage.service.js';

export default {
    state: {
        forecast: [],
        favorites: storageService.loadFromStorage('favorites'),
        weather: [],
        selectedCity: '',
        dataFromService: [],
        toggleDegree: null
    },
    mutations: {
        setWather(state, context) {
            state.weather =  context.result
        },
        setDataFromServer(state, context) {
            state.dataFromService = context.dataFromService.data;
        },
        removeFavorite({favorites}, {likedLoc}) {
            favorites.splice(likedLoc, 1);
            storageService.saveToStorage('favorites', favorites)
        },
        addFavorite({favorites}, {likedFavorite}) {
            favorites.push(likedFavorite);
            storageService.saveToStorage('favorites', favorites);
        },
        setSelectedCity(state, context) {
            state.selectedCity = context.selectedCity;
        },
        setForecast(state, context) {
            state.forecast = context.dailyForecast;
        },
        setToggleDegree(state, context) {
            state.toggleDegree = context.toggleValue;
        }
    },

    getters: {
        getWeather({weather}) {
            return weather;
        },
        getDataFromServer({dataFromService}) {
            return dataFromService;
        },
        getWeatherCity({weatherSelectedCity}) {
            return weatherSelectedCity;
        },
        getWeatherForecast({forecast}) {
            return forecast;
        },
        getFavorites({favorites}) {
            return favorites;
        },
        getSelectedCity({selectedCity}) {
            return selectedCity;
        },
        getToggleDegree({toggleDegree}) {
            return toggleDegree;
        }
    },

    actions: {
        async getAutoCompleteSuggestions({commit}, {search}) {
            try {
                const dataFromService = await geocodeService.getAutoComplete(search)
                commit({type: 'setDataFromServer', dataFromService})
                return dataFromService.data;
            } catch (err) {
                console.log('weatherStore error:',err)
                return err;
            }
        },

        async setSelectedCity({commit}, {selectedCity}) {
            try {
                storageService.saveToStorage('selectedCity', selectedCity)
                commit({type: 'setSelectedCity', selectedCity})
                return selectedCity;
            } catch (err) {
                console.log('error with selectedCity:', err)
            }
        },

        async setWather({commit}, {result}) {
            storageService.saveToStorage("currWather", result);
            commit({type: 'setWather', result})
            return result;
        },

        async getWeatherCityByCode({commit}, {cityCode}) {
            try {
                const weatherData = await geocodeService.getWeatherCity(cityCode)
                return weatherData.data;
            } catch (err) {
                console.log('weatherStore weather error:',err)
                return err;
            }
        },

        async getWeatherForecast({commit}, {cityCode}) {
            try {
            const weatherForecast = await geocodeService.getWeatherForecast(cityCode)
            storageService.saveToStorage('forecast', weatherForecast.data.DailyForecasts)
            const dailyForecast = weatherForecast.data.DailyForecasts
            commit({type: 'setForecast', dailyForecast})
            return dailyForecast;
            } catch (err) {
                console.log('weatherStore forcast error:',err)
                return err;
            }
        },

        async removeLikedLoc({commit}, {likedLoc}) {
            try {
                commit({type: 'removeFavorite', likedLoc})
            } catch (err) {
                console.log('weatherstore err:', err)
                return err;
            }
        },

        async addFavorite({commit}, {likedFavorite}) {
            try {
                commit({type: 'addFavorite', likedFavorite})
            } catch(err) {
                console.log('weatherStore err:', err)
                return err;
            }
        },

        async toggleDegree({commit}, {toggleValue}) {
            try {
                commit({type: 'setToggleDegree', toggleValue})
            } catch (err) {
                console.log('weatherStore toggleDegre error:', err)
            }
        }
    }
}