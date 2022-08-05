                                                                                                                                                                                                                                                                                                        import React, { Component } from 'react'
import {
    Card,
    Select,
    Input,
    Button,
    Icon,
    Table,
    message
} from 'antd'

import LinkButton from "../../components/link-button";
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'
const Option = Select.Option

/*
    Product 的默认子路由组件
*/
export default class ProductHome extends Component {

    state = {
        // 商品的总数量
                                                                                                                                                    total: 0,
        // 商品的数组
        products: [],
        // 是否正在加载中
        loading: false,
        // 搜索的关键字
        searchName: '',
        // 根据哪个字段搜索
        searchType: 'productName'
    }

    /*
        初始化 Table 的列的数组
    */
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name'
            },
            {
                title: '商品描述',
                dataIndex: 'desc'
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => '￥' + price   // 当前指定了对应的属性（dataIndex），传入的是对应的属性值
            },
            {
                width: 100,
                title: '状态',
                // dataIndex: 'status',
                render: (product) => {
                    const { status, _id } = product
                    // 因为要修改状态，所以我们重新定义 status 进行取反
                    const newStatus = status === 1? 2 : 1
                    return (
                        <span>
                            <Button
                                type={'primary'}
                                onClick={() => this.updateStatus(_id, newStatus)}
                            >
                                {status === 1 ? '下架' : '上架'}
                            </Button>
                            <span>{status === 1 ? '在售' : '已下架' }</span>
                        </span>
                    )
                }
            },
            {
                width: 100,
                title: '操作',
                render: (product) => {   // 不指定 dataIndex，就可以对整行的数据操作
                    return (
                        <span>
                            {/* 将 product 对象使用 state 传递给目标路由组件 /product/detail/123 在这种后面携带 ID 的方式只支持 BrowserRouter  */}
                            <LinkButton onClick={() => this.props.history.push('/product/detail', {product})}>详情</LinkButton>
                            <LinkButton onClick={() => this.props.history.push('/product/addupdate', product )}>修改</LinkButton>
                        </span>
                    )
                }
            }
        ]
    }

    /*
        获取指定页码的列表数据显示
    */
    getProducts = async (pageNum) => {
        // 每次请求都将 pageNum 保存起来,让其他方法可以看到
        this.pageNum = pageNum
        // 显示 loading
        this.setState({ loading: true })
        const { searchName, searchType } = this.state
        // 如果搜索关键字有值，说明我们要做搜索分页
        let result   // 不管是分页接口 还是获取列表接口 都是将 list 和 total 赋值，所以就可以使用一个 result
        if (searchName) {
            // 放到一个对象中，就不需要关心相关顺序了
            result = await reqSearchProducts({pageNum, pageSize: PAGE_SIZE, searchName, searchType})
        } else {
            // 一般分页请求
            result = await reqProducts(pageNum, PAGE_SIZE)
        }
        // 隐藏 loading
        this.setState({ loading: false })
        if (result.status === 0) {
            // 取出分页数据，更新状态，显示分页列表
            const { total, list } = result.data
            this.setState({
                total,
                products: list
            })
        }
    }

    /*
        更新指定商品的状态
    */
    updateStatus = async (productId, status) => {
        const result = await reqUpdateStatus(productId, status)
        if (result.status === 0) {
            message.success('更新商品成功！')
            console.log(this.pageNum);
            this.getProducts(this.pageNum)
        }
    }

    componentWillMount() {
        this.initColumns()
    }

    // 在 didMount 中去发请求
    componentDidMount() {
        this.getProducts(1)
    }

    render() {

        // 取出状态数据
        const { products, total, loading, searchName, searchType } = this.state

        const title = (
            <span>
                {/* 我们要想实现受控组件自动收集，需要加一个 onChange 事件 */}
                <Select
                    value={searchType}
                    style={{ width: 150}}
                    onChange={value => this.setState({ searchType: value })}
                >
                    <Option value={'productName'}>按名称搜索</Option>
                    <Option value={'productDesc'}>按描述搜索</Option>
                </Select>
                <Input
                    placeholder={'关键字'}
                    style={{ width: 150, margin: '0 15px' }}
                    value={searchName}
                    onChange={event => this.setState({ searchName: event.target.value })    }
                >
                </Input>
                {/* 给事件函数传参 要通过事件回调的方式 */}
                <Button type={'primary'} onClick={ () => this.getProducts(1)}>搜索</Button>
            </span>
        )

        const extra = (
            <Button type={'primary'} onClick={() => this.props.history.push('/product/addupdate')}>
                <Icon type={'plus'}></Icon>
                添加商品
            </Button>
        )

        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    rowKey={'_id'}
                    loading={loading}
                    dataSource={products}
                    columns={this.columns}
                    pagination={{
                        current: this.pageNum,
                        total,
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        onChange: this.getProducts
                    }}
                >
                </Table>
            </Card>
        );
    }
}
