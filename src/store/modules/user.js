import { login, logout, getInfo ,mybookstore} from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { phone, pass } = userInfo
    return new Promise((resolve, reject) => {
      login({ phone: phone.trim(), pass: pass }).then(response => {
        const { item } = response
        commit('SET_TOKEN', item.token)
        setToken(item.token)
        localStorage.setItem('roleset',item.roleSet.join(','))
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { item } = response
        console.log(response)
        if (!item) {
          reject('Verification failed, please Login again.')
        }

        const { name, portrait } = item
        // 0 未绑定 1 绑定 2 普通管理 3 门店 4最高
        commit('SET_NAME', name)
        commit('SET_AVATAR', portrait)
        if(localStorage.getItem('roleset').search('2')!='-1'){
          mybookstore().then(res => {
            const { item } = res
            const {  bookStoreId } = item
            localStorage.setItem('bookStoreId',bookStoreId)
          })
        }else{
          localStorage.removeItem('bookStoreId')
        }
        
        resolve(item)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
        localStorage.clear()
        commit('SET_NAME', '')
        commit('SET_AVATAR', '')
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()
        resolve()
      // }).catch(error => {
        // reject(error)
      // })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

