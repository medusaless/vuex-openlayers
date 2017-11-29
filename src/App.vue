<template>
   <div id="map">
   </div>
</template>
<script>
import Vue from "vue";

import ol from "openlayers";
import ol_Map from "ol/map";
import ol_View from "ol/view";

import ol_proj from "ol/proj";
import ol_proj_Projection from "ol/proj/projection";

import ol_source_Vector from "ol/source/vector";
import ol_source_OSM from "ol/source/osm";

import myVectorLayer from "./components/myvectorlayer";
import ol_layer_Vector from "ol/layer/vector";
import ol_layer_Tile from "ol/layer/tile";

import ol_format_EsriJSON from "ol/format/esrijson";

import ol_style_style from "ol/style/style";
import ol_style_fill from "ol/style/fill";
import ol_style_stroke from "ol/style/stroke";
import ol_style_circle from "ol/style/circle";
import ol_style_text from "ol/style/text";
import ol_style_icon from "ol/style/icon";

import ol_geom_point from "ol/geom/point";

import ol_feature from "ol/feature";

import ol_overlay from "ol/overlay";

import ol_interaction_select from "ol/interaction/select";

import proj4 from "proj4";

import "ol/ol.css";

export default {
  props: {
    mapoptions: {
      type: Object
    }
  },
  data() {
    return {
      map: undefined,
      stationUrl:
        "http://125.70.9.221:8020/cdmap/rest/services/mobile/mobile_metro/MapServer/0/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&f=pjson",
      featureUrl:
        "https://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Petroleum/KSFields/FeatureServer/0//query?objectIds=&where=1%3D1&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&outSR=&returnCountOnly=false&returnIdsOnly=false&f=pjson"
    };
  },
  methods: {
    defineProjection() {
      proj4.defs("EPSG:4490", "+proj=longlat +ellps=GRS80 +no_defs");

      var projection_4490 = new ol_proj_Projection({
        code: "EPSG:4490",
        units: "degrees"
      });

      ol_proj.addProjection(projection_4490);
      ol_proj.addCoordinateTransforms(
        "EPSG:3857",
        "EPSG:4490",
        function(coordinate) {
          return proj4("EPSG:3857", "EPSG:4490", coordinate);
        },
        function(coordinate) {
          return proj4("EPSG:4490", "EPSG:3857", coordinate);
        }
      );
    },
    initMap() {
      Vue.prototype.mapInstance = new ol_Map({
        target: "map",
        layers: [
          new ol_layer_Tile({
            source: new ol_source_OSM()
          })
        ],
        view: new ol_View(this.mapoptions || {})
      });
      this.map = Vue.prototype.mapInstance;
    },
    addSubwayStation() {
      this.$http.jsonp(this.stationUrl).then(
        response => {
          if (response.ok) {
            var vectorSource = new ol_source_Vector();
            var esrijsonFormat = new ol_format_EsriJSON();
            var features = esrijsonFormat.readFeatures(response.body, {
              featureProjection: "EPSG:3857",
              dataProjection: "EPSG:4490"
            });

            vectorSource.addFeatures(features);

            var vectorlayer = new myVectorLayer({
              source: vectorSource,
              style: function(feature, resolution) {
                return new ol_style_style({
                  fill: new ol_style_fill({
                    color: "red"
                  }),
                  stroke: new ol_style_stroke({
                    color: "red",
                    width: 5
                  }),
                  image: new ol_style_icon({
                    src: require("./assets/station.png")
                  }),
                  text: new ol_style_text({
                    text: feature.get("地铁站点名称"),
                    offsetY: 25,
                    fill: new ol_style_fill({
                      color: "white"
                    }),
                    stroke: new ol_style_stroke({
                      color: "black",
                      width: 3
                    })
                  })
                });
              }
            });

            this.map.addLayer(vectorlayer);
            vectorlayer.addFeatureEvent(this.map, "select", function(e) {
              var station = e.target.getFeatures().item(0);
              station && alert(station.get("地铁站点名称"));
            });
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  },
  mounted() {
    this.defineProjection();
    this.initMap();
    this.addSubwayStation();
  }
};
</script>

