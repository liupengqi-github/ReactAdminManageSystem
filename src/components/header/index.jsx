import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import LinkButton from '../link-button'
import { getCityCode, reqWeather } from '../../api'
import menuList from '../../config/menuConfig'
// 引入日期格式化
import { formateDate } from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import { changeWeatherImg } from './chanegWeatherImg'
import { Modal } from 'antd'
import storageUtils from "../../utils/storageUtils";

import './index.less'
/*
    左侧导航的组件
*/
class Header extends Component {
    state = {
        // Date.now()：返回自 1970 年 1 月 1 日 到当前时间的毫秒数
        currentTime: formateDate(Date.now()),   // 当前时间字符串
        dayPictureUrl: 'http://api.map.baidu.com/images/weather/day/qing.png',   // 天气图片 url
        weather: '', // 天气的文本
    }

    getTime = () => {
        // 每隔 1s 获取当前时间，并更新状态数据：currentTime
        this.intervalId = setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        }, 1000)
    }

    getWeather = async () => {
        const infoCode = await getCityCode('青岛')
        const weather = await reqWeather(infoCode)
        this.setState({
            weather
        })
        changeWeatherImg(this, weather)
    }

    getTitle = () => {
        // 得到当前请求路径
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            // 如果当前 item 对象的 key 与 path一样，item 的 title 就是需要显示的 title
            if (item.key === path) {
                title = item.title
            } else if (item.children) {
                // 在所有的子 item 中查找匹配的
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                // 如果有值，说明匹配成功
                if (cItem) {
                    // 取出它的 title
                    title = cItem.title
                }
            }
        })

        return title
    }

    /*
        退出登录
    */
    logout = (e) => {
        // 显示确认框
        Modal.confirm({
            content: '确定退出吗？',
            onOk: () =>  {
                // 删除保存的 user 数据(local 和 内存中的都要删除)
                storageUtils.removeUser()
                memoryUtils.user = {}

                // 跳转到 login 页面
                this.props.history.replace('/login')
            }
        })
        e.preventDefault()
    }

    // 此函数用来做异步操作：发 ajax 请求/启动定时器（在第一次 render 之后执行一次）
    componentDidMount() {
        // 获取当前的时间
        this.getTime()
        // 获取当前的天气
        this.getWeather()
    }

    /*
    // 不能这么做：因为不能更新显示
    componentWillMount() {
        this.title = this.getTitle()
    }
    */

    /*
        当前组件卸载之前调用
    */
    componentWillUnmount() {
        // 清除定时器
        clearInterval(this.intervalId)
    }

    render() {

        const { currentTime, dayPictureUrl, weather } = this.state

        const username = memoryUtils.user.username

        // 得到当前需要显示的 title
        const title = this.getTitle()

        return (
            <div className={'header'}>
                <div className={'header-top'}>
                    <span>欢迎， {username}</span>
                    {/* 虽然我们使用了 a 标签，但是却没有使用它链接的功能，所以脚手架就会报警告，我们可以使用 button 封装一个组件来使用就可以了 */}
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className={'header-bottom'}>
                    <div className={'header-bottom-left'}>{ title }</div>
                    <div className={'header-bottom-right'}>
                        <span>{currentTime}</span>
                        {/*<img src="http://api.map.baidu.com/images/weather/day/qing.png" alt="weather"/>*/}
                        <img src={dayPictureUrl} alt="weather"/>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Header)
