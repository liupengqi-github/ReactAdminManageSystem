/*
    要求：能根据接口文档定义接口请求
    包含应用中所有请求函数的模块
    每个函数的返回值都是 promise
*/
import jsonp from 'jsonp'
import ajax from './ajax'
import { message } from 'antd'

/*
    跨域：
        1.协议名不同：http/https
        2.主机名：localhost
        3.端口号
    1. jsonp：但只能处理 get 请求
    2. cors：后台允许跨域
    3. 代理：proxy
*/
// const BASE = 'http://localhost:5000'
// 会考虑到开启其他端口运行，所以前面不指定
const BASE = ''

// 分别暴露
// export function reqLogin(username, password) {   // 登录
//    return ajax('/login', { username, password }, 'POST')
// }

export const reqLogin = (username, password) => ajax(BASE + '/login', { username, password }, 'POST')

// 获取 一级/二级 分类的列表
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', { parentId })
// 添加分类
export const reqAddCategory = (parentId, categoryName) => ajax(BASE + '/manage/category/add', { parentId, categoryName }, 'POST' )
// 更新分类 (可以选择用一个对象参数来接收)
export const reqUpdateCategory = ({ categoryId, categoryName }) => ajax(BASE + '/manage/category/update', { categoryId, categoryName }, 'POST' )
// 获取一个分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId})

// 获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', { pageNum, pageSize })

/*
    搜索商品分页列表（根据商品名称/商品描述）
    searchType：搜索的类型，productName/productDesc
*/
export const reqSearchProducts = ({ pageNum, pageSize, searchName, searchType }) => ajax(BASE + '/manage/product/search', {
    pageNum,
    pageSize,
    // 传递一个搜索的类型，如果是 productName 那么就是按名称搜索，如果是 productDesc 那就是按描述搜索
    [searchType]: searchName,
})

// 更新商品的状态(上架/下架)
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', { productId, status }, 'POST')

// 删除指定名称的图片
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', { name }, 'POST')

// 添加/修改商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + (product._id? 'update' : 'add'), product, 'POST')

// 获取所有角色的列表
export const reqRoles =() => ajax(BASE + '/manage/role/list')

// 添加角色
export const reqAddRole =(roleName) => ajax(BASE + '/manage/role/add', { roleName }, 'POST')

// 添加角色
export const reqUpdateRole =(role) => ajax(BASE + '/manage/role/update', role, 'POST')

// 获取所有用户的列表
export const reqUsers = () => ajax(BASE + '/manage/user/list')
// 删除指定用户
export const reqDeleteUser = (userId) => ajax(BASE + '/manage/user/delete', { userId },  'POST')
// 添加/更新 用户
export const reqAddOrUpdateUser = (user) => ajax(BASE + '/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')

// 修改商品
// export const reqUpdateProduct = (product) => ajax(BASE + '/manage/product/update', product, 'POST')
/*
    jsonp 请求的接口请求函数
    jsonp 解决跨域的原理：
        1. jsonp 只能解决 GET 类型的 ajax 请求跨域问题
        2. jsonp 请求不是 ajax 请求，而是一般的 get 请求
        3. 基本原理
            浏览器端：
                动态生成 <script> 来请求后台接口（src 就是接口的 url）
                定义好用于接收响应数据的函数(fn), 并将函数名通过请求参数提交给后台（如：callback=fn）
            服务器端：
                接收到请求处理产生结果数据后，返回一个函数调用的 js 代码，并将结果数据作为实参传入函数调用
            浏览器端：
                收到响应自动执行函数调用的 js 代码，也就执行了提前定义好的回调函数，并得到了需要的结果数据
*/
// 得到城市对应的编码
export const getCityCode = (city) => {
    return new Promise((resolve, reject) => {
        const url = `https://restapi.amap.com/v3/geocode/geo?address=${city}&output=JSON&key=a4b307bec1cb2a079df4f7f847f7c512`
        jsonp(url, {}, (err, data) => {
            // console.log('jsonp', err, data);
            if (!err && data.status !== 0) {
                resolve(data.geocodes[0].adcode)
            } else {
                message.error(data.info)
            }
        })
    })

}
// 根据城市对应的编码得到城市的天气信息
export const reqWeather = (cityCode) => {
    return new Promise((resolve, reject) => {
        const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=${cityCode}&key=a4b307bec1cb2a079df4f7f847f7c512`
        jsonp(url, {}, (err, data) => {
            // console.log('jsonp', err, data);
            if (!err && data.status !== 0) {
                if (data.lives[0]) {
                    resolve(data.lives[0].weather)
                } else {
                    resolve('晴天')
                }
            } else {
                message.error(data.info)
            }
        })
    })

}
// reqWeather()



// 统一暴露
// export default {
//     xxx () {
//
//     },
//
//     yyy () {
//
//     }
// }

