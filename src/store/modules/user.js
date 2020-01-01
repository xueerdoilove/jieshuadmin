import { login, mymune, getInfo ,mybookstore} from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
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
        localStorage.setItem('username',item.name)
        if(item.roleSet.join(',').search('4')!=-1){// 如果是最高管理者 那就不去请求权限列表
          resolve()
        }else{
          mymune({}).then(res =>{
            localStorage.setItem('mymenu',JSON.stringify(res.items))
            resolve()
          })
        }
        
        
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      var username = localStorage.getItem('username')
      commit('SET_NAME', username)
      // 0 未绑定 1 绑定 2 普通管理 3 门店 4最高
      if(localStorage.getItem('roleset').search('2')!='-1'){
        mybookstore().then(res => {
          const { item } = res
          const {  bookStoreId } = item
          localStorage.setItem('bookStoreId',bookStoreId)
          localStorage.setItem('bookStoredata',JSON.stringify(item))
        })
      }else{
        localStorage.removeItem('bookStoreId')
        localStorage.removeItem('bookStoredata')
      }
      resolve(username)
    })
  },
  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
        localStorage.clear()
        commit('SET_NAME', '')
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

