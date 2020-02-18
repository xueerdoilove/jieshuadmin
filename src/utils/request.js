import axios from 'axios'
import {
  Message
} from 'element-ui'
import store from '@/store'
import {
  getToken
} from '@/utils/auth'
axios.defaults.headers['Content-Type'] = 'application/json';

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // baseURL: 'https://91huidu.com/book/api/', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout

})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = getToken()
    }
    if (config.method == 'get') {
      config.headers['content-type'] = 'application/x-www-form-urlencoded'
      config.data = true
    } 
    
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    var code = response.status+''
    // if the custom code is not 20000, it is judged as an error.
    if (code[0] != 2) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    if((''+error).search('403')!='-1'){
      Message({
        message: '无权操作,请切换账号',
        type: 'error',
        duration: 5 * 1000
      })
    }else if((''+error).search('401')!='-1'){
      Message({
        message: '登陆过期,请重新登录',
        type: 'error',
        duration: 5 * 1000
      })
    }else if((''+error).search('409')!='-1'){
      console.log(409)
    }else{
      Message({
        message: '操作失败!',
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
