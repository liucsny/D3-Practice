<template>
  <article class="bt b--black-10">
    <router-link class="db mt4 mb3 ph3 ph0-l no-underline black dim" :to="linkto">
      <div class="w-100 h6 overflow-hidden flex">
        <img :src="dataImgUrl" class="h4 w-20 itemImg ba b--near-white" alt="Photo of a dimly lit room with a computer interface terminal.">
        <div class="ml3 w-100">
          <div class="f3 fw5 mt0 mb1 lh-title black-70">{{title}}</div>
          <div class="flex">
            <div class="pv1 pr2 f7 gray" v-for="(tag, index) in tags" :key="index">{{tag}}</div>
          </div>
        </div>
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
    },
    tags:{
      type: Array,
      default: function () { return [] }
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
