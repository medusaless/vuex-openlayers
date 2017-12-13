<template>
   <div class="drawingtool-box">
     <ul>
       <li v-for="(drawingItem,index) in drawingItems" :key="index" :data-drawtype="drawingItem.name" @click="activateDraw">
         <a>
           <img :src="drawingItem.icon" :title="drawingItem.name"/>
         </a>
       </li>
     </ul>
   </div>
</template>
<script>
import Vue from "vue";

import DRAWINGTYPES from "./drawingtype.js";

import ol_interaction_draw from "ol/interaction/draw";

import ol_layer_vector from "ol/layer/vector";

import ol_source_vector from "ol/source/vector";

import ol_geom_polygon from "ol/geom/polygon";

import MapUtils from "../../js/map-utils.js";

let _userdraw_layer_vector;

let geometryFunction = function(coordinates, geometry) {
  var type = arguments[2];
  if (!geometry) {
    geometry = new ol_geom_polygon(null);
  }
  switch (type) {
    case "Rectangle":
      geometry = rectangleFunc.apply(this, [coordinates, geometry]);
      break;
  }

  return geometry;
};

let rectangleFunc = function(coordinates, geometry) {
  var startPoint = coordinates[0];
  var endPoint = coordinates[1];

  var maxX = endPoint[0];
  var minY = endPoint[1];
  var minX = startPoint[0];
  var maxY = startPoint[1];

  var newCoordinates = [];
  newCoordinates.push([minX, maxY]);
  newCoordinates.push([maxX, maxY]);
  newCoordinates.push([maxX, minY]);
  newCoordinates.push([minX, minY]);
  newCoordinates.push([minX, maxY]);

  geometry.setCoordinates([newCoordinates]);

  return geometry;
};

let geometryFuncCreator = function(type, func) {
  return function(coordinates, geometry) {
    return func.apply(this, [coordinates, geometry, type]);
  };
};

export default {
  props: {
    types: {
      type: Array,
      required: true
    },
    mapProp: {
      type: Object
    }
  },
  data() {
    return {
      layer: undefined,
      layerSource: undefined,
      interaction: undefined,
      map: undefined
    };
  },
  computed: {
    drawingItems() {
      var _drawingItems = [];
      this.types.forEach(type => {
        DRAWINGTYPES[type] && _drawingItems.push(DRAWINGTYPES[type]);
      });
      _drawingItems.push(DRAWINGTYPES["_CLEAN"]);
      return _drawingItems;
    }
  },
  methods: {
    activateDraw(e) {
      let drawtype = e.currentTarget.getAttribute("data-drawtype");
      if (this.interaction) {
        this.map.removeInteraction(this.interaction);
      }

      switch (drawtype) {
        case "LineString":
        case "Polygon":
          this.interaction = new ol_interaction_draw({
            type: drawtype,
            source: this.layerSource
          });
          break;
        case "Rectangle":
          this.interaction = new ol_interaction_draw({
            type: "Circle",
            source: this.layerSource,
            geometryFunction: geometryFuncCreator(drawtype, geometryFunction)
          });
          break;
        case "Clean":
          if (this.interaction) {
            MapUtils.getLayerById("_userdraw_layer_vector", this.map)
              .getSource()
              .clear();

            return;
          }
          break;
      }

      this.interaction.on("drawend", evt => {
        this.$emit("ondrawend", evt.feature);
        return;
      });
      this.map.addInteraction(this.interaction);
    }
  },
  mounted() {},
  watch: {
    mapProp: function(val, oldVal) {
      if (val) {
        this.map = val;
        this.layer = MapUtils.getLayerById("_userdraw_layer_vector", this.map);
        if (!this.layer) {
          this.layerSource = new ol_source_vector();
          this.layer = new ol_layer_vector({
            source: this.layerSource
          });
          this.layer.layerId = "_userdraw_layer_vector";
          this.map.addLayer(this.layer);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.drawingtool-box {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
  li {
    width: 35px;
    height: 35px;
    margin-left: -1px;
    display: block;
    float: left;
    border: 1px solid #c7c7c7;
    background: white;
    cursor: pointer;
    a {
      text-decoration: none;
    }
    img {
      margin: 5px 0 0 5px;
    }
  }
}
</style>
