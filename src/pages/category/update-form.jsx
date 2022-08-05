import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Select,
    Input
} from 'antd'

/* 这是 FormItem */
const Item = Form.Item
const Option = Select.Option

/*
    更新分类的 form 组件
*/
class UpdateForm extends Component {

    static propTypes = {
        categoryName: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }

    /* 同步调用使用 willMount */
    componentWillMount() {
        // 将 form 对象通过 setForm 方法传递给父组件
        this.props.setForm(this.props.form)
    }

    render() {

        const { categoryName }  = this.props

        // 内部的 render 可以得到一个 form 对象
        const { getFieldDecorator } = this.props.form
        return (
            <Form>
                <Item>
                    {
                        getFieldDecorator('categoryName', {
                            initialValue: categoryName,
                            rules: [
                                { required: true, message: '分类名称必须输入'}
                            ]
                        })(
                            <Input placeholder={'请输入分类名称'}></Input>
                        )
                    }
                </Item>
            </Form>
        );
    }
}

export default Form.create()(UpdateForm)
