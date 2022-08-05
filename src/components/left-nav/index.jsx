import React, { Component } from 'react'
// 通过 withRouter 将不是路由组件的包装成路由组件
import { Link, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd';

import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
import './index.less'
import memoryUtils from "../../utils/memoryUtils";
const { SubMenu } = Menu;
/*
    左侧导航的组件
*/
class LeftNav extends Component {

    /*
        判断当前登录用户对 item 是否有权限
    */
    hasAuth = (item) => {
        const { key, isPublic } = item
        const menus = memoryUtils.user.role.menus
        const username = memoryUtils.user.username
        /*
            1.如果当前用户是 admin
            2.如果当前 item 是公开的
            3.当前用户有此 item 的权限：key 有没有在 menus 中
        */
        if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
            return true
        } else if (item.children) {
           // 4. 如果当前用户有此 item 的某个子 item 的权限   !! 强制转换成布尔值
            return !!item.children.find(child => menus.indexOf(child.key) !== -1)
        }

        return  false
    }

    /*
        根据 menu 的数据数组生成对应的标签数组
        使用 map() + 递归调用
    */
    getMenuNodes_map = (menuList) => {
        return menuList.map(item => {
            if (!item.children) {
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            } else {
                return  (
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </span>
                        }
                    >
                        {
                            this.getMenuNodes(item.children)
                        }
                    </SubMenu>
                )
            }
        })
    }

    /*
        根据 menu 的数据数组生成对应的标签数组
        使用 reduce() + 递归调用：reduce 用来做累计累加的
    */
    getMenuNodes = (menuList) => {
        // 得到当前请求的路由路径（因为当前组件不是路由组件，所以直接通过 props 取是 取不到 location 的）
        const path = this.props.location.pathname

        // reduce 的第二个参数为初始值，初始值为空数组，会向里面添加标签
        return menuList.reduce((pre, item) => { // 第一个参数为回调函数，为上一次统计的结果（不断地通过 pre 进行加东西）

            // 如果当前用户有 item 对应的权限，才需要显示对应的菜单项
            if (this.hasAuth(item)) {
                if (!item.children) {
                    // 向 pre 中添加 <Menu.Item>
                    pre.push((
                        <Menu.Item key={item.key}>
                            <Link to={item.key}>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    ))
                } else {
                    // 查找一个与当前请求路径匹配的子 Item(因为我们的 path 路径有可能包含子路径，所以只要让 path 里面包含了 cItem.key 就可以)
                    const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                    // 如果存在，说明当前 Item 的子列表需要展开
                    if (cItem) {
                        this.openKey = item.key
                    }

                    // 向 pre 中添加 <Menu.SubMenu>
                    pre.push((
                        <SubMenu
                            key={item.key}
                            title={
                                <span>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </span>
                            }
                        >
                            {
                                this.getMenuNodes(item.children)
                            }
                        </SubMenu>
                    ))
                }
            }

            return pre
        }, [])
    }

    /*
        第一次渲染之前会执行一次
            为第一个 render() 准备数据（必须同步的）
    */
    componentWillMount() {
        this.menuNodes = this.getMenuNodes(menuList)
    }

    render() {
        // 得到当前请求的路由路径（因为当前组件不是路由组件，所以直接通过 props 取是 取不到 location 的）
        let path = this.props.location.pathname
        console.log('render', path);
        if (path.indexOf('/product') === 0) {
            path = '/product'
        }
        // 得到需要打开菜单项的 key
        const openKey = this.openKey
        return (
            <div className={'left-nav'}>
                <Link to={'/'} className={'left-nav-header'}>
                    <img src={logo} alt="logo"/>
                    <h1>React 后台</h1>
                </Link>

                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    mode="inline"
                    theme="dark"
                >
                    {
                        this.menuNodes
                    }
                </Menu>
            </div>
        );
    }
}

/*
    withRouter 高阶组件：
        包装非路由组件，返回一个新的组件
        新的组件向非路由组件传递三个属性：history/location/match
*/
export default withRouter(LeftNav)
