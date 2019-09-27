<template>
  <div v-if="weather" class="card card-weather">
      <div class="card-image">
      <figure class="image is-0by1">
        <img :src="getWeatherIcon" alt="Placeholder image" />
      </figure>
    </div>
  <div class="card-content">
    <p class="subtitle">
      {{selectedCity}}
    </p>
  </div>
      <img v-if="!like"
      src="@/assets/icons/heart-multiple-outline.svg"
      class="like"
      style="width: 20%"
      @click="likedClicked"
      />
      <img v-if="like"
      src="@/assets/icons/heart-multiple.svg"
      class="like"
      style="width: 20%"
      @click="likedClicked"
      />
  <footer class="card-footer">
    <p class="card-footer-item">
      <span>
        {{weather[0].WeatherText}}
      </span>
    </p>
    <p class="card-footer-item">
      <span>
        {{parseInt(weather[0].Temperature.Metric.Value)}}&deg{{weather[0].Temperature.Metric.Unit}}
      </span>
    </p>
  </footer>
</div>
</template>

<script>
export default {
    name: 'dailyWeatherBox',
    props:['weather', 'selectedCity', 'favorites'],
    data() {
        return {
            isLiked: null
        };
    },
    created() {
      console.log('dailyWeatBox created weather:', this.weather)
      if(!this.favorites.length) {
        console.log(this.favorites)

      }
    },

    methods: {
        likedClicked() {
           let foundLikedFavoriteIdx = this.favorites.findIndex(likedFavorite => {
              return likedFavorite.city === this.selectedCity;
      });
            if(foundLikedFavoriteIdx >= 0) {
                this.$emit('emitLikedLoc', foundLikedFavoriteIdx);
            } else {
              let likedFavorite = {}
                likedFavorite.Temperature = { ...this.weather[0].Temperature}
                likedFavorite.city = this.selectedCity;
                likedFavorite.isLiked = true;
                likedFavorite.WeatherIcon = this.weather[0].WeatherIcon;
                likedFavorite.WeatherText = this.weather[0].WeatherText;
                this.$emit('emitNewFavoritesLiked', likedFavorite)
            }
        }
    },

    computed: {
        getWeatherIcon() {
          console.log('computed weather:', this.weather)
            return `https://www.accuweather.com/images/weathericons/${this.weather[0].WeatherIcon}.svg`
        },

        like() {
            if(this.favorites) {
                return this.favorites.find(likedLoc => likedLoc.city === this.selectedCity)
            }
        }
    }
}
</script>