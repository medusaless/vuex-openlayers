import mutation from '../mutations/mapmutation.js'
import actions from '../actions/mapaction.js'

import ol_Map from "ol/map";

export default {
    mutation,
    actions,
    state:{
        mapObj:new ol_Map()
    }
}