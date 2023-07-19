<script>
import { RouterView } from "vue-router";
import HomeBoxView from "./components/homeBox.vue"


export default {

  components: {
    RouterView,
    HomeBoxView
  },

}

</script>

<template>
  <RouterView :key="$route.fullPath" />
  <HomeBoxView />
</template>

<style scoped>
</style>
