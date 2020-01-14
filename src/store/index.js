import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import getters from './getters'
import saveInLocal from './plugin/savelnLocal'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission
  },
  state: {
    menu_key: '',
    org_name: '',
    edit_id: {},
    keepaliveArr: [],
    isreload: false,
    pro_unit:'',
    pro_unit_code:''
  },
  mutations: {
    SET_MUC:(state,pmuc) => {
      state.pro_unit_code =pmuc
    },
    SET_MU:(state,pmu) => {
      state.pro_unit =pmu
    },
    SET_MENU_KEY: (state, mkey) => {
      state.menu_key = mkey
    },
    SET_ORG_NAME: (state, name) => {
      state.org_name = name
    },
    SET_EDIT_ID: (state, id) => {
      state.edit_id = { ...state.edit_id, ...id }
    },
    keepaiveARR: (state, id) => {
      state.keepaliveArr = id
    },
    setreload: (state, id) => {
      state.isreload = id
    }
  },
  actions: {

  },
  getters,
  // 插件
  // plugins: [ saveInLocal ]
})
