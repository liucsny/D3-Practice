<template>
  <article class="pointer h-100 bg-white br2 card overflow-hidden">
    <router-link class="db mb3 ph3 ph0-l no-underline black" :to="linkto">
      <div class="w-100 h6 overflow-hidden">
        <img :src="dataImgUrl" class="w-100 itemImg" alt="Photo of a dimly lit room with a computer interface terminal.">
        <div class="pa3 w-100">
          <div class="f5 fw5 mt0 mb1 lh-title black-70">{{title}}</div>
          <div class="flex flex-wrap">
            <div class="pv1 pr2 f7 fw3 gray" v-for="(tag, index) in tags" :key="index">{{tag}}</div>
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
  height: 10rem;
}

.card{
  box-shadow:0 2px 8px 0 rgba(218, 218, 223, 0.5 );
  /* border: 1px solid rgba(234, 234, 238, 0.8); */
}

.card:hover{
  box-shadow:0 4px 24px 0 rgba(218, 218, 223, 0.8);
}
</style>
