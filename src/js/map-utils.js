var _Map_Utils = {};

_Map_Utils.getLayerById = function (layerId, map) {
  var targetLayer;
  var layers = map.getLayers().getArray();
  if (layers) {
    for (let i = 0; i < layers.length; i++) {
      var layer = layers[i];
      if (layer.layerId && layer.layerId.toString() === layerId) {
        targetLayer = layer;
        break;
      }
    }
  }

  return targetLayer;
}
export default _Map_Utils;
