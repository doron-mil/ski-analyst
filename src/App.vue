<script setup lang="ts">
import MainScreen from './components/MainScreen.vue';
</script>

<template>
  <div>
    <MainScreen/>
  </div>
</template>

<style scoped>
div {
  height: 100%;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(2em 04em .5em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
