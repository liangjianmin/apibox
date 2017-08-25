import axios from 'axios'

const state = {
    apilist: {}
}

const mutations = {
    apilist (state, payload) {
        state.apilist = payload.res;
    }
}

const actions = {
    apilist({commit}, payload){
        axios.get('getapi?p=' + payload.queryStr).then(res => {
            commit({
                type: 'apilist',
                res: res.data
            })
        }, error => {
            console.log('server error')
        });
    }
}

const getters = {}

export default {
    state,
    mutations,
    getters,
    actions
}
