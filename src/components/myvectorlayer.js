import ol_layer_vector from "ol/layer/vector";
import ol_interaction_select from "ol/interaction/select";

/*
* 为vectorlayer和图层内的features提供唯一id
*
*/
ol_layer_vector.prototype._getUniqueId = (function () {
  let _id = 1;
  return function () {
    return Date.now() + '___' + _id++;
  }
})();

/**
 * 为矢量图层添加事件回调函数
 * 
 * @param {*} map 地图对象
 * @param {*} eventType 事件类型 
 * @param {*} callback 回调函数
 */
ol_layer_vector.prototype.addFeatureEvent = function (map, eventType, callback) {
  let features = this.getSource().getFeatures();
  if (features) {

    let _id = this._getUniqueId(); // 获取每个矢量图层的唯一id

    features = features.map((feature) => {
      feature._featureLayerId = _id;
    });

    this._featureLayerId = _id;

    // 1. 为图层绑定相应的事件
    // 2. 判断点击的feature是否属于该vectorlayer，如果属于该vectorlayer才调用回调函数
    let select = new ol_interaction_select();
    select.on(eventType, (e) => {
      let featureTargets = e.target.getFeatures();
      if (featureTargets && featureTargets.getLength() > 0) {
        let isInThisLayer = featureTargets.getArray().every(feature => {
          return feature._featureLayerId === _id;
        });
        if (isInThisLayer) {
           callback(e)
        }
      }
    });
    map.addInteraction(select);
  }
}

export default ol_layer_vector;
