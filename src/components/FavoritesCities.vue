<template>
  <div class="card card-wrapper">
    <div class="card-content">
      <p class="title">{{favorite.city}}</p>
      <p
        class="subtitle"
      >{{parseInt(favorite.Temperature.Metric.Value)}}&deg{{favorite.Temperature.Metric.Unit}}</p>
    </div>
      <p class="card-footer-item">
        <span>{{favorite.WeatherText}}</span>
      </p>
  </div>
</template>

<script>
export default {
  props: ["favorite"],
  data() {
    return {};
  }
};
</script>