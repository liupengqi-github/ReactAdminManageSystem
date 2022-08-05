export function changeWeatherImg(bindThis, weather) {
    if (weather === '晴') {
        bindThis.setState({
            dayPictureUrl: 'http://api.map.baidu.com/images/weather/day/qing.png'
        })
    } else if (weather === '多云') {
        bindThis.setState({
            dayPictureUrl: 'http://api.map.baidu.com/images/weather/day/duoyun.png'
        })
    } else if (weather === '阴') {
        bindThis.setState({
            dayPictureUrl: 'http://api.map.baidu.com/images/weather/day/yin.png'
        })
    } else if (weather === '大雨') {
        bindThis.setState({
            dayPictureUrl: 'http://api.map.baidu.com/images/weather/day/dayu.png'
        })
    } else if (weather === '小雨') {
        bindThis.setState({
            dayPictureUrl: 'http://api.map.baidu.com/images/weather/day/xiaoyu.png'
        })
    } else {
        bindThis.setState({
            dayPictureUrl: 'http://api.map.baidu.com/images/weather/day/qing.png'
        })
    }
}
