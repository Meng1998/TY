import axios from 'axios'
// import qs from 'qs'
import {message} from 'antd';

// 创建axios实例
const service = axios.create({
  timeout: 60 * 1000 // 请求超时时间
})
// 添加请求拦截器)
service.interceptors.request.use(
  config => {
    // 给请求加上请求头
    if(sessionStorage.token && sessionStorage.token !== 'undefined') {
      config.headers.Authorization = sessionStorage.token
    }
    // 在发送请求之前做某件事，譬如这里可以把参数序列化
    if (config.method === 'post') { 
      // config.data = qs.stringify(config.data);
    }
    return config
  },
  error => {
    console.log('错误的传参')
    // Do something with request error
    return Promise.reject(error)
  }
)
// respone拦截器，返回状态判断(添加响应拦截器)
service.interceptors.response.use(
  response => {
    if(response.statusText !== "OK"){
      message.error(response.data.data || '接口异常');
      return '';
    }else{
      return response.data;
    }
  },
  error => {
    // if (error.response.status === 504 || error.response.status === 404) {
    //     message.error('"服务器失去响应！');
    // } else if (error.response.status === 401) {
    //     message.error("登录信息已经失效！");
    // } else if (error.response.status === 500) {
    //     message.error("服务器不可用！");
    // }else {
    //   message.error("接口位置错误");
    // }
    return Promise.reject(error)
  }
)
export default service;