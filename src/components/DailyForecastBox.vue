<template>
  <div class="card forecast-wrapper">
    <div class="card-image">
      <figure class="image is-0by1">
        <img :src="getWeatherIcon" alt="Placeholder image" />
      </figure>
    </div>
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <p class="title is-4">{{ forecast.EpochDate | moment("ddd, MMMM Do YYYY") }}</p>
          <p
            v-if="toggle==='Metric'"
            class="subtitle is-6"
          >{{ parseInt(forecast.Temperature.Maximum.Value)}}deg {{forecast.Temperature.Maximum.Unit}}</p>
          <p v-else
            class="subtitle is-6"
          >{{ parseInt(forecast.Temperature.Maximum.Value*1.8 +32)}}deg {{'F'}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "dailyForecastBox",
  props: ["forecast", "toggleDegree"],
  computed: {
    getWeatherIcon() {
      return `https://www.accuweather.com/images/weathericons/${this.forecast.Day.Icon}.svg`;
    },
    toggle() {
      return this.$store.getters.getToggleDegree;
    }
  }
};
</script>