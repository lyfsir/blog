import Vue from 'vue'
import Vuex from 'vuex'
import cookie from 'vue-cookies'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    userInfo: cookie.get("userInfo")
  },
  mutations: {
    // set
    SET_TOKEN: (state, token) => {
      state.token = token
      localStorage.setItem("token", token)
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
      cookie.set("userInfo", JSON.stringify(userInfo))
    },
    REMOVE_INFO: (state) => {
      state.token = ''
      state.userInfo = {}
      localStorage.setItem("token", '')
      cookie.set("userInfo", JSON.stringify(''))

    }

  },
  getters: {
    // get
    getUser: state => {
      return state.userInfo
    }

  },
  actions: {
  },
  modules: {
  }
})
