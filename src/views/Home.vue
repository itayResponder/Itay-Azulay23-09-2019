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
      <daily-weather-box v-if="weatherByCode"
        @emitNewFavoritesLiked="emitNewFavoritesLiked"
        @emitLikedLoc="emitLikedLoc"
        :toggleDegree="toggleDegree"
        :weather="weatherByCode"
        :weatherKey="weather.Key"
        :selectedCity="selectedCity"
        :favorites="favorites"
      ></daily-weather-box>
    </section>
    <section class="wrapper forecast">
      <daily-forecast-box 
        :toggleDegree="toggleDegree"
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
import Swal from "sweetalert2";
export default {
  name: "home",
  data() {
    return {
      search: '',
      data: [],
      weather: null,
      selectedCity: '',
      weatherForecasts: [],
      searchWether: null,
      weatherByCode: null,
      toggleDegree: this.$store.getters.getToggleDegree
    };
  },
  async created() {
    this.favorites = this.$store.getters.getFavorites;
    if(this.$route.params.id) {
      const favorites = storageService.loadFromStorage('favorites')
      const favorite = favorites.find(favorite => {
        return favorite.Key === this.$route.params.id;
      })
      this.weather = favorite
      this.weatherByDefaultValue();
      this.selectedCity = favorite.city;
    }
    if (!this.weather) {
      try {
        navigator.geolocation.getCurrentPosition(position => {
          geocodeService
            .getCurrLocation(
              position.coords.latitude,
              position.coords.longitude
            )
            .then(async (result) => {
              this.weather = await this.$store.dispatch({type: 'setWather',result: result.data})
              let selectedCity = result.data.LocalizedName;
              this.selectedCity = await this.$store.dispatch({type: 'setSelectedCity', selectedCity})
              this.weatherByDefaultValue();         
            });
        });
      } catch (err) {
        await Swal.fire('Sorry','Could not get coords', err)
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
        await Swal.fire('Sorry','Could not add favorite', err)
      }
    },

    async emitLikedLoc(likedLoc) {
      try {
        return await this.$store.dispatch({ type: "removeLikedLoc", likedLoc });
      } catch (err) {
        await Swal.fire('Sorry','Could not remove favorite', err)
      }
    },

    async weatherForecastByDefault() {
      try {
        this.weatherForecasts = await this.$store.dispatch({
          type: "getWeatherForecast",
          cityCode: this.weather.Key
        });
      } catch (err) {
        await Swal.fire('Sorry','Could not get weather Forecast', err)
      }
    },

    async getWeatherForecast() {
      try {
        this.weatherForecasts = await this.$store.dispatch({
          type: "getWeatherForecast",
          cityCode: this.weather.Key
        });
      } catch (err) {
        await Swal.fire('Sorry','Could not get weather Forecast', err)
      }
    },

    async weatherByDefaultValue() {
      try {
        this.weatherByCode = await this.$store.dispatch({type: 'getWeatherCityByCode', cityCode: this.weather.Key})
      } catch (err) {
        await Swal.fire('Sorry','Could not get weather By City Code', err)
      }
      this.getWeatherForecast();
    },

    async weatherBySearchValue() {
      const result = this.searchWether[0]
      this.selectedCity = result.LocalizedName;
      await this.$store.dispatch({type: 'setSelectedCity', selectedCity: this.selectedCity})
      try {
        this.weather = await this.$store.dispatch({type: 'setWather', result})
        this.weatherByCode = await this.$store.dispatch({type: 'getWeatherCityByCode', cityCode: this.weather.Key})
      } catch (err) {
        await Swal.fire('Sorry','Could not get weather by Search value', err)
      }
      this.getWeatherForecast();
    },

    async autoCompleteOptions() {
      try {
        this.searchWether = await this.$store.dispatch({type: "getAutoCompleteSuggestions",search: this.search});
        this.searchWether.forEach(data => {
          this.data.push(data.LocalizedName);
        });
      } catch (err) {
        await Swal.fire('Sorry','Could not get auto Complete searches', err)
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
    // favorites() {
    //   return this.$store.getters.getFavorites
    // },
  },

  components: {
    DailyForecastBox,
    DailyWeatherBox
  }
};
</script>
