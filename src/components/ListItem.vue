<template>
  <article class="bt b--black-10">
    <router-link class="db mt4 mb3 ph3 ph0-l no-underline black dim" :to="linkto">
      <div class="w-100 h6 overflow-hidden">
        <img src="http://mrmrs.github.io/photos/cpu.jpg" class="w-100" alt="Photo of a dimly lit room with a computer interface terminal.">
      </div>
      <h1 class="f3 fw4 mt3 mb4 lh-title">{{title}}</h1>
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
    }
  }
}
</script>
