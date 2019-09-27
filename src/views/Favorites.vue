<template>
  <div class="favorites">
    <favorites-cities
    v-for="favorite in favorites" :key="favorite.id" :favorite="favorite"
    ></favorites-cities>
  </div>
</template>

<script>
import FavoritesCities from '@/components/FavoritesCities.vue'
export default {
  data() {
    return {
      favorites: this.$store.getters.getFavorites
    }
  },

  components: {
    FavoritesCities
  }
}
</script>