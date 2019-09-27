<template>
  <div v-if="weather" class="card card-wrapper daily-weather">
    <div class="card-image">
      <figure class="image is-0by1">
        <img :src="getWeatherIcon" alt="Placeholder image" />
      </figure>
    </div>
    <div class="card-content">
      <p class="subtitle">{{selectedCity}}</p>
    </div>
    <img
      v-if="!like"
      src="@/assets/icons/heart-multiple-outline.svg"
      class="like"
      style="width: 20%"
      @click="likedClicked"
    />
    <img
      v-if="like"
      src="@/assets/icons/heart-multiple.svg"
      class="like"
      style="width: 20%"
      @click="likedClicked"
    />
    <footer class="card-footer">
      <p class="card-footer-item">
        <span>{{weather[0].WeatherText}}</span>
      </p>
      <p class="card-footer-item">
        <span v-if="toggle==='Metric'">{{parseInt(weather[0].Temperature.Metric.Value)}}deg{{weather[0].Temperature.Metric.Unit}}</span>
        <span v-else>{{parseInt(weather[0].Temperature.Imperial.Value)}}deg{{weather[0].Temperature.Imperial.Unit}}</span>

      </p>
    </footer>
  </div>
</template>

<script>
export default {
  name: "dailyWeatherBox",
  props: ["weather", "selectedCity", "favorites", "weatherKey","toggleDegree"],
  created() {
    
  },
  methods: {
    likedClicked() {
      let foundLikedFavoriteIdx = this.favorites.findIndex(likedFavorite => {
        return likedFavorite.city === this.selectedCity;
      });
      if (foundLikedFavoriteIdx >= 0) {
        this.$emit("emitLikedLoc", foundLikedFavoriteIdx);
      } else {
        let likedFavorite = {};
        likedFavorite.Key = this.weatherKey;
        likedFavorite.Temperature = { ...this.weather[0].Temperature };
        likedFavorite.city = this.selectedCity;
        likedFavorite.isLiked = true;
        likedFavorite.WeatherIcon = this.weather[0].WeatherIcon;
        likedFavorite.WeatherText = this.weather[0].WeatherText;
        this.$emit("emitNewFavoritesLiked", likedFavorite);
      }
    }
  },
  computed: {
    getWeatherIcon() {
      return `https://www.accuweather.com/images/weathericons/${this.weather[0].WeatherIcon}.svg`;
    },
    like() {
      return this.favorites.find(
        likedLoc => likedLoc.city === this.selectedCity
      );
    },
    toggle() {
      return this.$store.getters.getToggleDegree
    }
  }
};
</script>