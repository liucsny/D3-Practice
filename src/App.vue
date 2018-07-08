<template>
  <div id="app" class="pb6 sans-serif bg-color">
    <nav class="dt w-100 border-box pa3 ph5-ns bb b--near-white bg-white">
      <router-link class="dtc v-mid mid-gray link dim w-25" to="/" title="Home">
        <img src="./assets/Logo.svg" class="dib w2 h2 br-100" alt="Site Name">
      </router-link>
      <div class="dtc v-mid w-75 tr">
        <a class="link dim dark-gray f6 f5-ns dib" href="#" title="Contact">About</a>
      </div>
    </nav>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
}

.show{
  border: 1px rgb(131, 12, 12) solid;
}

.bg-color{
  background-color: #fdfeff;
}
</style>
