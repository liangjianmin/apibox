import Vue from 'vue'
import Vuex from 'vuex'
import mutations from  './mutations'
import actions from './actions'
import api from './modules/api'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        mutations,
        api
    },
    actions
})
