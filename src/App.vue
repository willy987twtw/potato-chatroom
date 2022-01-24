<template>
  <vue100vh class="container" :css="{ height: '100rvh' }">
    <router-view />
  </vue100vh>
</template>

<script>
// import Vue100vh from 'vue-div-100vh';
import vue100vh from 'vue-100vh';
export default {
  components: { vue100vh },
  setup() {},
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.container {
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
