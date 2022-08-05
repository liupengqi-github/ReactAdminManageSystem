import React, { Component } from 'react'
import {
    Card,
    Icon,
    List
} from 'antd'
import LinkButton from "../../components/link-button";
import { BASE_IMG_URL } from '../../utils/constants'
import { reqCategory } from "../../api";

const Item = List.Item

/*
    Product 的详情子路由组件
*/
export default class ProductDetail extends Component {

    state = {
        // 一级分类名称
        cName1: '',
        // 二级分类名称
        cName2: ''
    }

    async componentDidMount() {
        // 得到当前商品的分类 ID
        const { categoryId, pCategoryId } = this.props.location.state.product
        if (pCategoryId === '0') {
            // 一级分类下的商品
            const result = await reqCategory(categoryId)
            const cName1 = result.data.name
            // 只更新一级分类的数据就可以了
            this.setState({cName1})
        } else {  // 二级分类下的商品
            /*
               // 通过多个 await 方式发多个请求：后面一个请求是在前一个请求成功返回之后才发送
                const result1 = await reqCategory(pCategoryId)  // 获取一级分类列表
                const result2 = await reqCategory(categoryId)   // 获取二级分类列表
                const cName1 = result1.data.name
                const cName2 = result2.data.name
            */

            // 一次性发送多个请求，只有都成功了，才正常处理：Promise.all(里面传递的是多个 Promise 的数组),这样的做法比上面的效率要高一些，虽然效果一样
            const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
            console.log(results);
            // 返回的是一个数组
            const cName1 = results[0].data.name
            const cName2 = results[1].data.name
            this.setState({
                cName1,
                cName2
            })
        }
    }

    render() {
        // 读取携带过来的 state 数据
        const { name, desc, price, detail, imgs } = this.props.location.state.product
        const { cName1, cName2 } = this.state

        const title = (
            <span>
                <LinkButton>
                        <Icon
                            type={'arrow-left'}
                            style={{marginRight: 10, fontSize: 20}}
                            onClick={() => this.props.history.goBack()}
                        >
                        </Icon>
                </LinkButton>
                <span>商品详情</span>
            </span>
        )
        return (
            <Card title={title} className={'product-detail'}>
                <List>
                    <Item>
                        <span className={'left'}>商品名称：</span>
                        <span className={'right'}>{ name }</span>
                    </Item>
                    <Item>
                        <span className={'left'}>商品描述：</span>
                        <span className={'right'}>{ desc }</span>
                    </Item>
                    <Item>
                        <span className={'left'}>商品价格：</span>
                        <span className={'right'}>{ price }元</span>
                    </Item>
                    <Item>
                        <span className={'left'}>所属分类：</span>
                        <span className={'right'}>{cName1} { cName2 ? '-->' + cName2 : '' }</span>
                    </Item>
                    <Item>
                        <span className={'left'}>商品图片：</span>
                        <span className={'right'}>
                            {
                                imgs.map(img => (
                                    <img
                                        key={img}
                                        className={'product-img'}
                                        src={ BASE_IMG_URL + img }
                                        alt="img"
                                    />
                                ))
                            }
                        </span>
                    </Item>
                    <Item>
                        <span className={'left'}>商品详情：</span>
                        <span className={'right'} dangerouslySetInnerHTML={{ __html: detail}}>

                        </span>
                    </Item>
                </List>
            </Card>
        );
    }
}
