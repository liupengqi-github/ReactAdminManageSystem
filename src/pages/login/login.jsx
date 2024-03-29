import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import { Form, Icon, Input, Button, message } from 'antd';

import './login.less'

// 在 react 中要这么导入图片
import logo from '../../assets/images/logo.png'
// 通过解构的方式拿到登录请求的函数
import { reqLogin } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

// 不能写在 import 之前
const Item = Form.Item

/*
   登录的路由组件
*/
class Login extends Component {
    handleSubmit = (event) => {
        // 阻止事件的默认行为
        event.preventDefault()

        // 对所有的表单字段进行验证
        this.props.form.validateFields(async (err, values) => {
            // 校验成功
            if (!err) {
                // console.log('提交登录的 ajax 请求', values);
                // 请求登录
                const { username, password} = values
                const result = await reqLogin(username, password)
                // console.log(response.data);
                if (result.status === 0) {  // 登录成功
                    // 提示登录成功
                    message.success('登录成功')

                    // 保存 user
                    const user = result.data
                    // 保存在内存中
                    memoryUtils.user = user
                    // 保存到 local 中
                    storageUtils.saveUser(user)

                    // 跳转到后台管理界面（history：push、replace、goback）不需要再回退到登录，所以使用 replace
                    this.props.history.replace('/')
                } else { // 登录失败
                    // 提示错误信息
                    message.error(result.msg)
                }
            } else {
                console.log('校验失败');
            }
        });

        // 得到 form 对象
        // const form = this.props.form
        // // 获取表单项的输入数据
        // const values = form.getFieldsValue()
        // console.log(values);
    }

    // 对 密码 进行自定义验证
    validatorPwd = (rule, value, callback) => {
        if (!value) {
            callback('密码必须输入！')
        } else if (value.length < 4) {
            callback('密码长度不能小于4位')
        } else if (value.length > 12) {
            callback('密码长度不能大于12位')
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            callback('密码必须是英文、数字、或下划线组成')
        } else {
            // callback 不传递参数就代表验证通过（如果里面传递东西，就代表验证失败，要提示什么文本）
            callback()
        }
    }

    render() {
        // 如果用户已经登录，自动跳转到管理页面
        const user = memoryUtils.user
        if (user._id) {
            return <Redirect to={'/'}></Redirect>
        }

        // 得到具有强大功能的 form 对象
        // const form = this.props.from
        const { getFieldDecorator } = this.props.form;

        return (
            <div className={'login'}>
                <header className={'login-header'}>
                    <img src={logo} alt="logo"/>
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className={'login-content'}>
                    <h2>用户登录</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Item>
                            {
                                getFieldDecorator('username', { // 配置对象：属性名是特定的一些名称
                                    // 声明式验证：直接使用别人定义好的验证规则进行验证
                                    rules: [
                                        /* whitespace：表示输了空格跟没输一样 */
                                        { required: true, whitespace: true, message: '用户名必须输入' },
                                        { min: 4, message: '用户名至少四位'},
                                        { max: 12, message: '用户名最多12位'},
                                        { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字、或下划线组成'}
                                    ],
                                    // 指定初始值
                                    initialValue: 'admin'
                                })(
                                    <Input
                                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder="用户名"
                                    />,
                                )
                            }
                        </Item>
                        <Form.Item>
                            {
                                getFieldDecorator('password', {
                                    rules: [
                                        {
                                            validator: this.validatorPwd
                                        }
                                    ],
                                })(
                                    <Input
                                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        type="password"
                                        placeholder="密码"
                                    />,
                                )
                            }
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        );
    }
}

/*
    1.高阶函数
        ① 一类特别的函数
            接收函数类型的参数
            返回值是函数
        ② 常见的高阶函数
            定时器: setTimeout() / setInterval()
            Promise：Promise(() => {})  then(value => {}), catch(err => {})
            数组遍历相关的方法：forEach、filter、map、reduce、find、findIndex
            函数对象的 bind() 方法，返回一个新的函数
        ③ 高阶函数更加动态，更加具有扩展性
        ④ Form.create()() / getFieldDecorator()()
    2.高阶组件
        ① 本质就是一个函数
        ② 接收一个组件（被包装组件），返回一个新的组件（包装组件），包装组件会向被包装组件传入特定属性
        ③ 作用：扩展组件的功能
        ④ 高阶组件也是高阶函数：接收一个组件函数，返回是一个新的组件函数
*/
/*
    简单得表达就是包装了 Form 组件，生成一个新的组件：Login Form，新组件会向 Form 组件传递一个强大的对象属性：form（父组件给子组件传递了 form 属性）
*/
const WrapLogin = Form.create()(Login)
export default WrapLogin

/*
    async 和 await
      1.作用
        简化 promise 对象的使用：不要再使用 then() 来指定成功/失败的回调函数
        以同步编码（没有回调函数了）方式实现异步编程
      2.哪里写 await
        在返回 promise 的表达式左侧写 await：不要想 promise，想要 promise 异步执行成功的 response 数据
      3.哪里写 async
        await 所在函数（最近的）定义的左侧写 async
*/
