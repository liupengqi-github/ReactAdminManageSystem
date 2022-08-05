import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import ProductHome from './home'
import ProductAddUpdate from './add-update'
import ProductDetail from './detail'
// 给 product 中引入样式，因为 detail 、home 等是子路由，也是有样式的
import './product.less'

/*
    商品路由
*/
export default class Product extends Component {
    render() {
        return (
           <Switch>
               {/* exact：路径完全匹配 */}
               <Route component={ProductHome} path={'/product'} exact></Route>
               <Route component={ProductAddUpdate} path={'/product/addupdate'}></Route>
               <Route component={ProductDetail} path={'/product/detail'}></Route>
               <Redirect to={'/product'}></Redirect>
           </Switch>
        );
    }
}
