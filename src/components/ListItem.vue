<template>
  <article class="bt b--black-10">
    <router-link class="db mt4 mb3 ph3 ph0-l no-underline black dim" :to="linkto">
      <div class="w-100 h6 overflow-hidden flex">
        <img :src="dataImgUrl" class="h4 w-20 itemImg ba b--near-white" alt="Photo of a dimly lit room with a computer interface terminal.">
        <h1 class="f3 fw5 ml3 mb4 mt0 lh-title black-70">{{title}}</h1>
      </div>
    </router-link>
  </article>
</template>

<script>
export default {
  props: {
    linkto: {
      type: String,
      default: "/"
    },
    title: {
      type: String,
      default: "Title"
    },
    imgUrl: {
      type: String,
      default: require("../../src/assets/thumbnail/default.png")
    }
  },
  data () {
    return {
      dataImgUrl: this.imgUrl
    }
  }
}
</script>

<style scoped>
.itemImg{
  object-fit: cover;
}
</style>
