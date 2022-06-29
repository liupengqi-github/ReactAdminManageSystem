/*
    入口 js
*/
import React from 'react'
import ReactDOM from 'react-dom'

// 全局导入 antd 样式
// import 'antd/dist/antd.css'

// 引入第三方模块和自定义模块的区别：自定义模块路径要加  ./ 或 ../ 等等
import App from './App'

// 将 App 组件标签渲染到 index 页面的 div 上
ReactDOM.render(<App></App>, document.getElementById('root'))
