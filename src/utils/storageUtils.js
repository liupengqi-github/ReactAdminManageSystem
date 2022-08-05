/*
    进行 Local 数据存储管理的工具模块
*/
import store from 'store'
const USER_KEY = 'user_key'
export default {
    /*
        保存 user
    */
    saveUser (user) {
        // 由于原生 js 的本地存储存在一定的兼容性，所以我们采用 store 这个库
        // localStorage.setItem(USER_KEY, JSON.stringify(user))
        store.set(USER_KEY, user)
    },

    /*
       读取 user
   */
    getUser() {
        // '{}' 用字符串的形式就是因为 JSON.parse 接收的是 JSON 格式的字符串
        // return JSON.parse(localStorage.getItem(USER_KEY) || '{}')

        // 未获取到值会返回一个对象回去
        return store.get(USER_KEY) || {}
    },

    /*
       删除 user
   */
    removeUser () {
        // localStorage.removeItem(USER_KEY)
        store.remove(USER_KEY)
    }
}
