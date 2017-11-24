<template>
   <div id="map">
   </div>
   
</template>
<script>
import {mapState,mapActions} from 'vuex'  

import ol from "openlayers";
import ol_Map from "ol/map";
import ol_View from "ol/view";

import ol_proj from "ol/proj";
import ol_proj_Projection from "ol/proj/projection";

import ol_source_Vector from "ol/source/vector";
import ol_source_OSM from "ol/source/osm";

import ol_layer_Vector from "ol/layer/vector";
import ol_layer_Tile from "ol/layer/tile";

import ol_format_EsriJSON from "ol/format/esrijson";

import ol_style_style from "ol/style/style";
import ol_style_fill from "ol/style/fill";
import ol_style_stroke from "ol/style/stroke";
import ol_style_circle from "ol/style/circle";

import ol_geom_point from "ol/geom/point";

import ol_feature from "ol/feature";

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
      mapserverUrl:
        "http://125.70.9.221:8020/cdmap/rest/services/mobile/mobile_metro/MapServer/0/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&f=pjson",
      featureUrl:
        "https://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Petroleum/KSFields/FeatureServer/0//query?objectIds=&where=1%3D1&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&outSR=&returnCountOnly=false&returnIdsOnly=false&f=pjson"
    };
  },
  methods: {
    ...mapActions(['initMap2']),
    onLiClick(value) {
      alert(value);
    },
    initMap() {
      let self = this;
      this.$store.state.mapObj = new ol_Map({
        target: "map",
        layers: [
          new ol_layer_Tile({
            source: new ol_source_OSM()
          })
        ],
        view: new ol_View(this.mapoptions || {})
      });
      this.$store.state.mapObj.on("click", function(evt) {
        console.log(evt.coordinate);
        console.log(this.methods)
        self.initMap2();
      });
    },
    addSubwayStation() {
      var url = this.mapserverUrl;
      this.$http.jsonp(url).then(
        response => {
          if (response.ok) {
            var vectorSource = new ol_source_Vector();
            var esrijsonFormat = new ol_format_EsriJSON();
            var features = esrijsonFormat.readFeatures(response.body, {
              dataProjection: "EPSG:3857"
            });

            // features = features.map(feature => {
            //   var coors = ol_proj.transform('')
            // });
            // vectorSource.addFeatures(features);

            // var point = new ol_geom_point([
            //   11585500.144589726,
            //   3588447.192817837
            // ]);

            // var pointFeature = new ol_feature({
            //   geometry: point
            // });

            proj4.defs("EPSG:4490", "+proj=longlat +ellps=GRS80 +no_defs");
            console.log(proj4("EPSG:4490"));

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

            var coors = ol_proj.transform(
              [104.04775654679611, 30.667707160968234],
              "EPSG:4490",
              "EPSG:3857"
            );

            var point = new ol_geom_point(coors);
            console.log(coors);
            var pointFeature = new ol_feature({
              geometry: point
            });

            vectorSource.addFeature(pointFeature);

            var vectorlayer = new ol_layer_Vector({
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
                  image: new ol_style_circle({
                    radius: 5,
                    fill: new ol_style_fill({
                      color: "yellow"
                    }),
                    stroke: new ol_style_stroke({ color: "red", width: 1 })
                  })
                });
              }
            });
            this.$store.state.mapObj.addLayer(vectorlayer);
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  },
  mounted() {
    this.initMap();
    console.log(this.$store.dispatch)
    this.addSubwayStation();
    console.log(this.$store.state.mapObj.getLayers())
  }
};
</script>

