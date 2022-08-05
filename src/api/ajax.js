/*
    能发送异步 ajax 请求的函数模块
    封装 axios 库
    函数的返回值是 promise 对象
1.优化1：统一请求处理请求异常？
    在外层包一个自己创建的 promise 对象
    在请求出错时，不去 reject(error)，而是显示错误提示，
2.优化2：异步得到不是 response，而是 response.data
    在请求成功 resolve 时：resolve(response.data)
*/

import axios from 'axios'
import { message } from 'antd'

// 只暴露一个的时候用 default
export default function ajax(url, data = {}, type='GET') {
    return new Promise(((resolve, reject) => {
        let promise
        // 1.执行 异步 ajax 请求
        if (type === 'GET') { // 发 GET 请求
            promise = axios.get(url, {
                params: data  // 指定请求参数
            })
        } else { // 发 POST 请求
            promise =  axios.post(url, data)
        }
        // 2.如果成功，调用 resolve(value)
        promise.then(response => {
            resolve(response.data)
        }).catch(error => {
            // 3. 如果失败了，不调用 reject(reason)，而是提示异常信息
            message.error('请求出错：' + error.message)
        })
    }))
}

// 请求登录接口
// ajax('http://localhost:5000/login', {
//     username: 'Tom',
//     password: '123'
// }, 'POST')
//     .then()
// // 添加用户
// ajax('http://localhost:5000/login', {
//     username: 'Tom',
//     password: '123',
//     phone: '1584963634'
// }, 'POST')
//     .then()
