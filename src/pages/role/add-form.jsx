import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Select,
    Input
} from 'antd'

const Item = Form.Item

/*
    添加分类的 form 组件
*/
class AddForm extends Component {

    static propTypes = {
        // 用来传递 form 对象的函数
        setForm: PropTypes.func.isRequired
    }

    componentWillMount() {
        this.props.setForm(this.props.form)
    }

    render() {
        // 内部的 render 可以得到一个 form 对象
        const { getFieldDecorator } = this.props.form
        // 指定 Item 布局的配置对象
        const formItemLayout = {
            // 左侧 label 的宽度
            labelCol: { span: 4 },
            // 指定右侧包裹(内容)的宽度
            wrapperCol: { span: 15 },
        };

        return (
            <Form>
                <Item label={'角色名称'} {...formItemLayout}>
                    {
                        getFieldDecorator('roleName', {
                            initialValue: '',
                            rules: [
                                { required: true, message: '角色名称必须输入'}
                            ]
                        })(
                            <Input placeholder='请输入角色名称'></Input>
                        )
                    }
                </Item>
            </Form>
        );
    }
}


export default Form.create()(AddForm)
