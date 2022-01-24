<template>
  <div class="loader"></div>
</template>

<script>
export default {};
</script>

<style>
.loader {
  border: 3px solid #f3f3f3; /* Light grey */
  border-top: 3px solid #777; /* Blue */
  border-radius: 50%;
  width: 2em;
  height: 2em;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
