<template>
  <section class="home-container">
    <p class="content"></p>
    <b-field class="search-box">
      <b-autocomplete
        autofocus
        rounded
        v-model="search"
        @keypress.native="checkEnglishLetters($event)"
        @keyup.native.enter="weatherBySearchValue"
        :data="filteredSuggestedCities"
        @input="autoCompleteOptions"
        placeholder="Search City"
        icon="magnify"
      >
        <template slot="empty">No results found</template>
      </b-autocomplete>
      <b-button @click="weatherBySearchValue" type="is-info" class="search-button" rounded>Search</b-button>
    </b-field>
    <section class="wrapper weather-city">
      <daily-weather-box
        @emitNewFavoritesLiked="emitNewFavoritesLiked"
        @emitLikedLoc="emitLikedLoc"
        :weather="weather"
        :selectedCity="selectedCity"
        :favorites="favorites"
      ></daily-weather-box>
    </section>
    <section class="wrapper forecast">
      <daily-forecast-box
        v-for="forecast in weatherForecasts"
        :key="forecast.id"
        :forecast="forecast"
        class="card-wrapper"
      ></daily-forecast-box>
    </section>
  </section>
</template>

<script>
import DailyForecastBox from "@/components/DailyForecastBox.vue";
import DailyWeatherBox from "@/components/DailyWeatherBox.vue";
import { storageService } from "@/services/storage.service.js";
import geocodeService from "@/services/geocode.service";
export default {
  name: "home",
  data() {
    return {
      search: '',
      data: [],
      weatherByLoc: storageService.loadFromStorage("weatherByLoc"),
      weather: storageService.loadFromStorage('weatherByCity'),
      selectedCity: storageService.loadFromStorage('selectedCity'),
      weatherForecasts: storageService.loadFromStorage("forecast"),
      searchWether: null,
    };
  },
  created() {
    if (!this.weather) {
      try {
        navigator.geolocation.getCurrentPosition(position => {
          geocodeService
            .getCurrLocation(
              position.coords.latitude,
              position.coords.longitude
            )
            .then(result => {
              this.weather = result.data;
              this.selectedCity = this.weather.LocalizedName;
              this.weatherByDefaultValue();
              storageService.saveToStorage("defaultWeatherLoc", this.weather);
              storageService.saveToStorage("selectedCity", this.selectedCity);
            });
        });
      } catch (err) {
        console.log(err);
      }
    }
  },

  methods: {
    checkEnglishLetters(ev) {
      if (!/^[a-zA-Z ]+$/.test(ev.key)) {
        ev.preventDefault();
      }
    },

    async emitNewFavoritesLiked(likedFavorite) {
      try {
        return await this.$store.dispatch({ type: "addFavorite", likedFavorite });
      } catch (err) {
        console.log("emitNewFavoritesLiked err:", err);
      }
    },

    async emitLikedLoc(likedLoc) {
      try {
        return await this.$store.dispatch({ type: "removeLikedLoc", likedLoc });
      } catch (err) {
        console.log("Could not remove likedLoc err:", err);
      }
    },

    async weatherForecastByDefault() {
      try {
        this.weatherForecasts = await this.$store.dispatch({
          type: "getWeatherForecast",
          cityCode: this.weather.Key
        });
        storageService.saveToStorage('forecast', this.weatherForecasts)
      } catch (err) {
        console.log("error has accure err:", err);
      }
    },

    async weatherForecastBySearch() {
      try {
        this.weatherForecasts = await this.$store.dispatch({
          type: "getWeatherForecast",
          cityCode: this.weatherByLoc.Key
        });
        storageService.saveToStorage('forecast', this.weatherForecasts)
      } catch (err) {
        console.log("error has accure err:", err);
      }
    },

    async weatherByDefaultValue() {
      this.selectedCity = this.weather.LocalizedName;
      try {
        const weatherByCity = await this.$store.dispatch({type: 'getWeatherCityByCode', cityCode: this.weather.Key})
      } catch (err) {
        console.log("error has accure err:", err);
      }
      storageService.saveToStorage('selectedCity', this.selectedCity)
      this.weatherForecastByDefault();
    },

    async weatherBySearchValue() {
      this.selectedCity = this.searchWether[0].LocalizedName;
      try {
        const weatherByCity = await this.$store.dispatch({type: 'getWeatherCityByCode', cityCode: this.searchWether[0].Key})
        storageService.saveToStorage('weatherByCity', weatherByCity);
      } catch (err) {
        console.log("error has accure err:", err);
      }
      storageService.saveToStorage('selectedCity', this.selectedCity)
      this.weatherForecastBySearch();
    },

    async autoCompleteOptions() {
      try {
        this.searchWether = await this.$store.dispatch({type: "getAutoCompleteSuggestions",search: this.search});
        this.searchWether.forEach(data => {
          this.data.push(data.LocalizedName);
        });
        storageService.saveToStorage('data', this.searchWether)
      } catch (err) {
        console.log("error has accure:", err);
      }
    }
  },

  computed: {
    filteredSuggestedCities() {
      return this.data.filter(option => {
        return (
          option
            .toString()
            .toLowerCase()
            .indexOf(this.search.toLowerCase()) >= 0
        );
      });
    },

    favorites() {
      return this.$store.getters.getFavorites
    },

    WeatherCity() {
      return this.$store.getters.getWeatherCity
    }
  },

  components: {
    DailyForecastBox,
    DailyWeatherBox
  }
};
</script>
