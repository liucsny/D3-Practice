<template>
  <div id="canvas">
    <p>{{msg}}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: 'Hello World!'
    }
  },
  mounted() {
    let input = document.createElement('input');
    let text = document.createElement('p');
    let btn = document.createElement('button')

    input.setAttribute('v-model','msg');
    text.innerHTML = '{{msg}}';
    btn.innerText = 'Change Msg'

    // btn.setAttribute('@click',this.change_msg)

    document.querySelector('#canvas').appendChild(input);
    document.querySelector('#canvas').appendChild(text);
    document.querySelector('#canvas').appendChild(btn);
  },
  methods: {
    change_msg() {
      this.msg = 'I have been chnaged!'
    }
  }
}
</script>

<style scoped>

</style>
