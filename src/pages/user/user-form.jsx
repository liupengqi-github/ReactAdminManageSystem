import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Select,
    Input
} from 'antd'

const Item = Form.Item
const Option = Select.Option

/*
    添加/修改 用户 form 组件
*/
class UserForm extends PureComponent {

    static propTypes = {
        // 用来传递 form 对象的函数
        setForm: PropTypes.func.isRequired,
        roles: PropTypes.array.isRequired,
        user: PropTypes.object
    }

    componentWillMount() {
        this.props.setForm(this.props.form)
    }

    render() {
        const { roles } = this.props
        const user = this.props.user || {}
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
            <Form {...formItemLayout}>
                <Item label={'用户名'}>
                    {
                        getFieldDecorator('username', {
                            initialValue: user.username,
                            rules: [
                                { required: true, message: '用户名必须输入'}
                            ]
                        })(
                            <Input placeholder='请输入用户名'></Input>
                        )
                    }
                </Item>
                {
                    user._id ? null : (
                        <Item label={'密码'}>
                            {
                                getFieldDecorator('password', {
                                    initialValue: user.password,
                                    rules: [
                                        { required: true, message: '密码必须输入'}
                                    ]
                                })(
                                    <Input type={'password'} placeholder='请输入密码'></Input>
                                )
                            }
                        </Item>
                    )
                }
                <Item label={'手机号'}>
                    {
                        getFieldDecorator('phone', {
                            initialValue: user.phone,
                            rules: [
                                { required: true, message: '手机号必须输入'}
                            ]
                        })(
                            <Input placeholder='请输入手机号'></Input>
                        )
                    }
                </Item>
                <Item label={'邮箱'}>
                    {
                        getFieldDecorator('email', {
                            initialValue: user.email,
                            rules: [
                                { required: true, message: '邮箱必须输入'}
                            ]
                        })(
                            <Input placeholder='请输入邮箱'></Input>
                        )
                    }
                </Item>
                <Item label={'角色'}>
                    {
                        getFieldDecorator('role_id', {
                            initialValue: user.role_id,
                            rules: [
                                { required: true, message: '邮箱必须输入'}
                            ]
                        })(
                            <Select placeholder={'请选择角色'}>
                                {
                                    roles.map(role =>
                                        <Option key={role._id} value={role._id}>
                                            { role.name }
                                        </Option>)
                                }
                            </Select>
                        )
                    }
                </Item>
            </Form>
        );
    }
}


export default Form.create()(UserForm)
