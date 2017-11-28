import mutations from '../mutations/mapmutation.js'
import actions from '../actions/mapaction.js'

import ol_Map from "ol/map";

export default {
  mutations,
  actions,
  state: {
    mapInstance: undefined
  }
}
