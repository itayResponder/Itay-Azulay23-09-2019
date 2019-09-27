import Vue from 'vue'
import Vuex from 'vuex'
import WeatherStore from '@/modules/WeatherStore'
Vue.use(Vuex)

const store = new Vuex.Store({
  strict: true,
  modules: {
      WeatherStore,
  }
})
export default store;
