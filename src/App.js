import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Login from './pages/login/login'
import Admin from './pages/admin/admin'



/*
    应用的根组件
*/

export default class App extends Component {

    render() {
        // 一旦有嵌套的标签，最好用小括号括起来
        return (
            <BrowserRouter>
                {/* Switch：在某一个时间点，只去匹配某一个，如果匹配到某一个，其他的就不会再看了 */}
                <Switch>
                    <Route path={'/login'} component={Login}></Route>
                    <Route path={'/'} component={Admin}></Route>
                </Switch>
            </BrowserRouter>
        );
    }
}
