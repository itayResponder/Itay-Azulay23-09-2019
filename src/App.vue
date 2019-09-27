<template>
  <div id="app">
    <my-header />
    <router-view />
    <div class="field toggleButton">
      <b-switch @input="changeToggle" v-model="isSwitchedCustom" true-value="Metric" false-value="Imperial">{{ isSwitchedCustom }}</b-switch>
    </div>
  </div>
</template>

<script>
import MyHeader from "@/components/MyHeader.vue";
import Main from "@/assets/css/Main.css";
export default {
  data() {
    return {
      isSwitched: false,
      isSwitchedCustom: "Metric"
    };
  },
  methods: {
    async changeToggle() {
      await this.$store.dispatch({type: 'toggleDegree', toggleValue: this.isSwitchedCustom})
    }
  },
  components: {
    MyHeader
  }
};
</script>
<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

@media only screen and (max-width: 400px) {
  .toggleButton {
    position: fixed;
    top:100px;
    right:150px;
  }
}
</style>
