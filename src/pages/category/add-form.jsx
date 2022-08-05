import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Select,
    Input
} from 'antd'
import category from "./category";

const Item = Form.Item
const Option = Select.Option

/*
    添加分类的 form 组件
*/
class AddForm extends Component {

    static propTypes = {
        // 一级分类的数组
        categorys: PropTypes.array.isRequired,
        // 父分类 ID
        parentId: PropTypes.string.isRequired,
        // 用来传递 form 对象的函数
        setForm: PropTypes.func.isRequired
    }

    componentWillMount() {
        this.props.setForm(this.props.form)
    }

    render() {
        const { categorys, parentId } = this.props
        // 内部的 render 可以得到一个 form 对象
        const { getFieldDecorator } = this.props.form
        return (
            <Form>
               <Item>
                   {
                       getFieldDecorator('parentId', {
                           initialValue: parentId
                       })(
                           <Select>
                               <Option value={'0'}>一级分类</Option>
                               {
                                   categorys.map(c => <Option key={c._id} value={c._id}>{c.name}</Option>)
                               }
                           </Select>
                       )
                   }
               </Item>
                <Item>
                    {
                        getFieldDecorator('categoryName', {
                            initialValue: '',
                            rules: [
                                { required: true, message: '分类名称必须输入'}
                            ]
                        })(
                            <Input placeholder='请输入分类名称'></Input>
                        )
                    }
                </Item>
            </Form>
        );
    }
}


export default Form.create()(AddForm)
