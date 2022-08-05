import React from 'react'
import './index.less'

/*
    外形像链接的按钮
*/
    export default function LinkButton(props) {
        /* 通过 ...props 也把退出这个内容传递进来了，因为它对应的就是 props.children */
    return <button {...props} className={'link-button'}></button>
}
