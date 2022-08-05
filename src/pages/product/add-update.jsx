import React, {Component, PureComponent} from 'react'
import {
    Card,
    Form,
    Input,
    Icon,
    Cascader,
    Upload,
    Button,
    message
} from 'antd'
import PicturesWall from "./pictures-wall";
import RichTextEditor from "./rich-text-editor";
import LinkButton from "../../components/link-button";
import { reqCategorys, reqAddOrUpdateProduct } from "../../api";

const { Item } = Form
const { TextArea } = Input;

/*
    Product 的 添加和修改的子路由组件
*/
class ProductAddUpdate extends Component {
    state = {
        options: [],
    };

    constructor(props) {
        super(props);

        // 1.创建用来保存 ref 标识的标签对象的容器
        this.pw = React.createRef()
        this.editor = React.createRef()
    }


    initOptions = async (categorys) => {
        // 根据 categorys 生成 options 数组
        const options = categorys.map(c => ({   // 返回一个新的对象要加上小括号
            value: c._id,
            label: c.name,
            isLeaf: false, // 不是叶子(代表有下一级)
        }))

        // 如果是一个二级分类商品的更新
        const { isUpdate, product } = this
        const { pCategoryId } = product
        if (isUpdate && pCategoryId !== 0) {
            // 获取对应的二级分类列表
            const subCategorys = await this.getCategorys(pCategoryId)
            // 生成二级下拉列表的 options
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            // 找到当前商品对应的一级 option 对象
            const targetOption = options.find(option => option.value === pCategoryId)

            // 关联对应的一级 option 上
            targetOption.children = childOptions
        }

        // 更新 options 状态
        this.setState({
            // PureComponent 中 这样写没事是因为我们是请求接口创建了一个新的 options(这样就不需要解构了)
            options
        })
    }

    /*
        异步获取一级/二级分类列表，并显示
         async 函数的返回值是一个新的 promise 对象，promise 的结果和值由 async 的结果决定
    */
    getCategorys = async (parentId) => {
        const result = await reqCategorys(parentId)
        if (result.status === 0) {
            const categorys = result.data
            // 如果是一级分类列表
            if (parentId === '0') {
               this.initOptions(categorys)
            } else {
                // 二级列表 =》 当前 async 函数返回的 promise 就会成功且 value 为 categorys (将 二级列表返回出去，来让外界点击一级列表的时候，动态添加 option)
                return categorys
            }
        }
    }

    /*
        验证价格的自定义验证函数
    */
    validatePrice = (rule, value, callback) => {
        // value 是一个字符串
        console.log(value, typeof value);
        if (value * 1 > 0) {
            // 验证通过
            callback()
        } else {
            // 验证未通过
            callback('价格必须大于0')
        }
    }

    /*
        用于加载下一集列表的回调函数
    */
    loadData = async selectedOptions => {
        console.log('www', selectedOptions);
        // 得到选择的 option 对象
        const targetOption = selectedOptions[0];
        // 显示 loading
        targetOption.loading = true;

        // 根据选中的分类，请求获取二级分类列表
        const subCategorys = await this.getCategorys(targetOption.value)
        // 隐藏 loading
        targetOption.loading = false;
        // 二级分类数组有数据
        if (subCategorys && subCategorys.length > 0) {
            // 生成一个二级列表的 options
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            // 关联到当前 option 上
            targetOption.children = childOptions
        } else {
            // 当前选中的分类没有二级分类(就把叶子置为 true )
            targetOption.isLeaf = true
        }

        // 更新 options 状态
        this.setState({
            // 这样改的话，options 没有改变，只是内部的数据改变
            // options: this.state.options,
            // 如果不去解构 就会看成为同一个 options
            options: [...this.state.options],
        });
    };

    submit = () => {
        // 进行表单验证，如果通过了，才发送请求
        this.props.form.validateFields( async (error, values) => {
            if (!error) {
                // 1. 收集数据, 并封装成 product 对象
                const { name, desc, price, categoryIds } = values
                let pCategoryId, categoryId
                if (categoryIds.length === 1) {
                    pCategoryId = '0'
                    categoryId = categoryIds[0]
                } else {
                    pCategoryId = categoryIds[0]
                    categoryId = categoryIds[1]
                }
                const imgs = this.pw.current.getImgs()
                const detail = this.editor.current.getDetail()

                const product = { name, desc, price, pCategoryId, categoryId, imgs, detail }
                // 如果是更新，需要添加下划线 Id
                if (this.isUpdate) {
                    product._id = this.product._id
                }

                // 2. 调用接口请求函数，去 添加/更新
                const result = await reqAddOrUpdateProduct(product)
                if (result.status === 0) {
                    message.success(`${this.isUpdate ? '更新' : '添加' }商品成功！`)
                    this.props.history.goBack()
                } else {
                    message.error(`${this.isUpdate ? '更新' : '添加' }商品失败！`)
                }
            }
        })
    }

    componentDidMount() {
        this.getCategorys('0')
    }

    // willMount 在 render 之前执行，为第一次 render 的数据做准备
    componentWillMount() {
        // 取出携带的 state(如果是添加没值，否则有值)
        const product = this.props.location.state
        // !! 强制转换为布尔类型(保存是否是更新的标识，有值就为 true，否则为 false)
        this.isUpdate = !!product
        // 保存商品(如果没有，保存的是一个 {} 来避免报错 )
        this.product = product || {}
    }

    render() {

        const {isUpdate, product} = this
        const {pCategoryId, categoryId, imgs, detail } = product
        // 用来接收级联分类ID的数组
        const categoryIds = []
        if(isUpdate) {
            // 商品是一个一级分类的商品
            if(pCategoryId==='0') {
                categoryIds.push(categoryId)
            } else {
                // 商品是一个二级分类的商品
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }


        // 指定 Item 布局的配置对象
        const formItemLayout = {
            // 左侧 label 的宽度
            labelCol: { span: 2 },
            // 指定右侧包裹(内容)的宽度
            wrapperCol: { span: 8 },
        };

        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack() }>
                    <Icon type={'arrow-left'} style={{ fontSize: 20 }}></Icon>
                </LinkButton>
                <span>{ isUpdate ? '修改商品' : '添加商品' }</span>
            </span>
        )

        const { getFieldDecorator } = this.props.form

        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label={'商品名称'}>
                        {
                            getFieldDecorator('name', {
                                initialValue: product.name,
                                rules: [
                                    { required: true, message: '必须输入商品名称' }
                                ]
                            })(<Input placeholder={'请输入商品名称'}></Input>)
                        }
                    </Item>
                    <Item label={'商品描述'}>
                        {
                            getFieldDecorator('desc', {
                                initialValue: product.desc,
                                rules: [
                                    { required: true, message: '必须输入商品描述' }
                                ]
                            })(<TextArea placeholder="请输入商品描述" autoSize={{ minRows: 2, maxRows: 6 }} />)
                        }
                    </Item>
                    <Item label={'商品价格'}>
                        {
                            getFieldDecorator('price', {
                                initialValue: product.price,
                                rules: [
                                    { required: true, message: '必须输入商品描述' },
                                    { validator: this.validatePrice }
                                ]
                            })(<Input type={'number'} addonAfter={'元'} placeholder={'请输入商品名称'}></Input>)
                        }
                    </Item>
                    <Item label={'商品分类'}>
                        {
                            getFieldDecorator('categoryIds', {
                                initialValue: categoryIds,
                                rules: [
                                    { required: true, message: '必须指定商品分类' }
                                ]
                            })(<Cascader
                                placeholder={'请指定商品分类'}
                                /* 需要显示的列表数据 */
                                options={this.state.options}
                                // 指定当选择某个列表项加载下一级列表的监听回调
                                loadData={this.loadData}
                            />)
                        }
                    </Item>
                    <Item label={'商品图片'}>
                        <PicturesWall ref={this.pw} imgs={imgs}></PicturesWall>
                    </Item>
                    <Item label={'商品详情'} labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
                        <RichTextEditor ref={this.editor} detail={detail}></RichTextEditor>
                    </Item>
                    <Item>
                        <Button type={'primary'} onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        );
    }
}

export default Form.create()(ProductAddUpdate)

/*
    1. 子组件调用父组件的方法：将父组件的方法以函数属性的形式传递给子组件，子组件就可以调用
    2. 父组件调用子组件的方法：在父组件中通过 ref 得到子组件标签对象(也就是组件对象)，调用其方法
*/
