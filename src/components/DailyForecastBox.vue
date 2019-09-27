<template>
  <div class="card">
    <div class="card-image">
      <figure class="image is-0by1">
        <img :src="getWeatherIcon" alt="Placeholder image" />
      </figure>
    </div>
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <p class="title is-4">{{ forecast.EpochDate | moment("ddd, MMMM Do YYYY") }}</p>
          <p class="subtitle is-6">{{ parseInt(forecast.Temperature.Maximum.Value)}}&deg {{forecast.Temperature.Maximum.Unit}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'dailyForecastBox',
    props: ['forecast'],
    data() {
        return {

        }
    },
created() {
},
    computed: {
        getWeatherIcon() {
            return `https://www.accuweather.com/images/weathericons/${this.forecast.Day.Icon}.svg`
        }
    }
}
</script>