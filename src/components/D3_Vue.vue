<template>
  <div>
    <div class="mw8 center">
      <div class="controls">
        <div>
          <label>Chart width</label>
          <input type="range" v-model="settings.width" min="0" max="1000" />
        </div>
        <div>
          <label>Stroke color</label>
          <input type="color" v-model="settings.strokeColor" />
        </div>
        <div>
          <label>Search…</label>
          <input type="text" v-model="search" />
        </div>
        <!-- <button v-on:click="add">Add node</button> -->
        <div>
          Selected: {{ selected }}
        </div>
    </div>
    <svg v-bind:width="settings.width" v-bind:height="settings.height">
      <transition-group tag="g" name="line" >  
        <path v-for="link in links" class="link" v-bind:key="link.id" v-bind:d="link.d" v-bind:style="link.style"></path>
			</transition-group>
      <transition-group tag="g" name="list">
        <g class="node" v-on:click="select(index, node)" v-for="(node, index) in nodes" v-bind:key="node.id" v-bind:style="node.style" v-bind:class="[node.className, {'highlight': node.highlight}]">
          <circle v-bind:r="node.r" v-bind:style="{'fill': index == selected ? '#ff0000' : '#bfbfbf'}"></circle>
          <text v-bind:dx="node.textpos.x" v-bind:dy="node.textpos.y" v-bind:style="node.textStyle">{{ node.text }}</text>
        </g>
    	</transition-group>
    </svg>
    </div>
  </div>
</template>

<script>
// https://bl.ocks.org/lorenzopub/02ccce43d708919ca7c0b242fe1c93f2
import * as d3 from 'd3';

export default {
  data() {
    return {
      csv: null,
      selected: null,
      search: "force",
      settings: {
        strokeColor: "#19B5FF",
        width: 960,
        height: 2000
      }
    }
  },
  computed: {
    tree() {
      return d3
        .cluster()
        .size([this.settings.height, this.settings.width - 160]);
    },
    root(){
      let that = this;

      if(this.csv){
        let stratify = d3.stratify().parentId(function(d) {
                                      return d.id.substring(0, d.id.lastIndexOf("."));
                                    });
                                              
        return this.tree(
          stratify(that.csv).sort(function(a, b) {
            return a.height - b.height || a.id.localeCompare(b.id);
          })
        );
      }
    },
    nodes() {
      let that = this;

      if (this.root) {
        // console.log(this.root.descendants())

        let descendants = this.root.descendants().map(function(d) {
          return {
            id: d.id,
            r: 2.5,
            className: "node" +
              (d.children ? " node--internal" : " node--leaf"),
            text: d.id.substring(d.id.lastIndexOf(".") + 1),
            highlight: d.id.toLowerCase().indexOf(that.search.toLowerCase()) != -1 && that.search != "",
            style: {
              transform: "translate(" + d.y + "px," + d.x + "px)"
            },
            textpos: {
              x: d.children ? -8 : 8,
              y: 3
            },
            textStyle: {
              textAnchor: d.children ? "end" : "start"
            }
          };
        })
        return descendants;
      }
    },
    links() {
      let that = this;

      if(this.root){
        let links = this.root.descendants().slice(1).map(function(d) {
            return {
              id: d.id,
              d: "M" + d.y + "," + d.x + "C" + (d.parent.y + 100) + "," + d.x + " " + (d.parent.y + 100) + "," + d.parent.x + " " + d.parent.y + "," + d.parent.x,
              style: {
                stroke: that.settings.strokeColor
              }
            };
          });

        return links;
      }
    }
  },
  mounted() {
    let that = this;
    d3.csv('/static/flare.csv', function(d){
      return d
    }).then(function(data){
      that.csv = data;
    })
  },
  methods: {
    add: function () {
      this.csv.push({
        id: "flare.physics.Dummy",
        value: 0
      })
    },
    select: function(index, node) {
      this.selected = index;
    }
  }
}
</script>

<style scoped>
  body {
      width: 100%;
      height: 100%;
      font-family: monospace;
     }
    
    .node {
    	opacity: 1;
    }

    .node circle {
      fill: #999;
      cursor: pointer;
    }

    .node text {
      font: 10px sans-serif;
      cursor: pointer;
    }

    .node--internal circle {
      fill: #555;
    }

    .node--internal text {
      text-shadow: 0 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff;
    }

    .link {
      fill: none;
      stroke: #555;
      stroke-opacity: 0.4;
      stroke-width: 1.5px;
      stroke-dasharray: 1000;
    }

    .node:hover {
      pointer-events: all;
      stroke: #ff0000;
    }

    .node.highlight {
      fill: red;
    }
    
    .controls {
      position: fixed;
      top: 16px; 
      left: 16px;
      background: #f8f8f8;
      padding: 0.5rem;
      display: flex;
      flex-direction: column;
    }
    
    .controls > * + * {
      margin-top: 1rem;
    }
    
    label {
      display: block;
    }
    
    .list-enter-active, .list-leave-active {
      transition: all 1s;
    }
    .list-enter, .list-leave-to /* .list-leave-active for <2.1.8 */ {
      opacity: 0;
      transform: translateY(30px);
    }
    
    .line-enter-active, .line-leave-active {
      transition: all 2s;
      stroke-dashoffset: 0;
    }
    .line-enter, .line-leave-to /* .list-leave-active for <2.1.8 */ {
      stroke-dashoffset: 1000;
    }
</style>
