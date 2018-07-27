<template>
  <div class="w5 color_body">
    <div class="pv6" :style="{'background': panel_color}">
          <p class="ma0 white o-80 tc color_text">{{color.h + ", " + color.s + "%, " + color.b + "%"}}</p>
          <!-- <p class="ma0 white o-80 tc color_text">{{gradientH}}</p> -->
    </div>
    <div class="control_set">
      <div class="control">
        <input type="range" min="0" max="360" v-model="color.h" class="pointer" :style="gradientH">
      </div>
      <div class="control">
        <input type="range" min="0" max="100" v-model="color.s" class="pointer" :style="gradientS">
      </div>
      <div class="control">
        <input type="range" min="0" max="100" v-model="color.b" class="pointer" :style="gradientB">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      color: {
        h: 360,
        s: 100,
        b: 50
      }
    }
  },
  methods: {
    hsb_to_hsl(h, s, b) {
      let l = (2 - s) * b / 2;
      let s2 = s;

      if (l != 0){
        if(l == 1){
          s2 = 0;
        } else if (l < 0.5){
          s2 = s * b / (2 * l);
        } else {
          s2 = s * b / (2 - 2 * l);
        }
      }

      s2 *= 100;
      l *= 100;

      return {
        h: h,
        s: s2,
        l: l
      };
    }
  },
  computed: {
    panel_color(){
      let hsl = this.hsb_to_hsl(this.color.h, this.color.s/100, this.color.b/100);

      return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    },
    gradientH() {
      let stops = [];
      for (let i = 0; i < 7; i++) {
        let h = i * 60;
        
        let hsl = this.hsb_to_hsl(parseFloat(h), parseFloat(this.color.s) / 100, parseFloat(this.color.b) / 100)
        let c = hsl.h + ", " + hsl.s + "%, " + hsl.l + "%"

        stops.push("hsl(" + c + ")")
      }
      return {
        backgroundImage: "linear-gradient(to right, " + stops.join(', ') + ")"
      }
    },
    gradientS() {
      let stops = [];
      for (let i = 0; i < 2; i++) {
        let s = i * 100;
        
        let hsl = this.hsb_to_hsl(parseFloat(this.color.h), s / 100, parseFloat(this.color.b) / 100)
        let c = hsl.h + ", " + hsl.s + "%, " + hsl.l + "%"

        stops.push("hsl(" + c + ")")
      }
      return {
        backgroundImage: "linear-gradient(to right, " + stops.join(', ') + ")"
      }
    },
    gradientB() {
      let stops = [];
      for (let i = 0; i < 2; i++) {
        let b = i * 100;
        
        let hsl = this.hsb_to_hsl(parseFloat(this.color.h), parseFloat(this.color.s) / 100, b / 100)
        let c = hsl.h + ", " + hsl.s + "%, " + hsl.l + "%"

        stops.push("hsl(" + c + ")")
      }

      return {
        backgroundImage: "linear-gradient(to right, " + stops.join(', ') + ")"
      }
    }
  }
}
</script>

<style scoped>
.color_body{
  border: 0.0625rem #ddd solid;
  border-radius: 0.25rem;
  box-shadow: 0 0.125rem 0.5rem 0 #ddd;
}

.control_set{
  padding: 1.5rem;
}

.control{
  width: 100%;
  height: 12px;
  border-radius: 12px;
  border: 1px solid #ddd;
}

.control + .control {
  margin-top: 1rem;
}

.control input {
  width: 100%;
  margin: 0;
  border-radius: 12px;
}

.control input[type=range] {
  -webkit-appearance: none;
  width: 100%;
  background: transparent;
}

.control input[type=range]:focus {
  outline: none;
}

.control input[type=range]::-ms-track {
  width: 100%;
  cursor: pointer;
  background: transparent;
  border-color: transparent;
  color: transparent;
}

.control input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  border: 1px solid #ddd;
  height: 20px;
  width: 20px;
  border-radius: 50px;
  background: #ffffff;
  cursor: pointer;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.12);
  margin-top: -4px;
}

.color_text{
  text-shadow:0 0.0625rem 0.0625rem rgba(0,0,0);
}
</style>
