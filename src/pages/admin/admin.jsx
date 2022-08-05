import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Layout } from 'antd';

import memoryUtils from '../../utils/memoryUtils'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'

const { Footer, Sider, Content } = Layout;

/*
   后台管理的路由组件
*/
export default class Admin extends Component {
    render() {
        const user = memoryUtils.user
        // 如果内存中没有存储 user，就表示当前没有登录
        if (!user || !user._id) {
            // 自动跳转到登录（在 render 中, 在事件函数中，我们就可以使用 history 对象了） 一旦渲染此标签，就会自动跳转
            return <Redirect to={'/login'}></Redirect>
        }
        return (
            <Layout style={{ minHeight: '100%' }}>
                <Sider>
                    <LeftNav></LeftNav>
                </Sider>
                <Layout>
                    <Header>Header</Header>
                    <Content style={{ backgroundColor: '#fff', margin: 20 }}>
                        {/* 用 switch 来包裹路由，表示只匹配一个 */}
                        <Switch>
                            <Route path={'/home'} component={Home}></Route>
                            <Route path={'/category'} component={Category}></Route>
                            <Route path={'/product'} component={Product}></Route>
                            <Route path={'/role'} component={Role}></Route>
                            <Route path={'/user'} component={User}></Route>
                            <Route path={'/charts/bar'} component={Bar}></Route>
                            <Route path={'/charts/line'} component={Line}></Route>
                            <Route path={'/charts/pie'} component={Pie}></Route>
                            {/* 默认匹配的都不对，就会渲染 下面指定的 home */}
                            <Redirect to={'/home'}></Redirect>
                        </Switch>
                    </Content>
                    <Footer style={{ textAlign: 'center', color: '#ccc' }}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
                </Layout>
            </Layout>
        );
    }
}
