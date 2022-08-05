import React, { Component } from 'react'
import {
    Card,
    Button,
    Table,
    Modal, message
} from 'antd'
import {formateDate} from "../../utils/dateUtils";
import LinkButton from "../../components/link-button";
import {PAGE_SIZE} from "../../utils/constants";
import {reqDeleteUser, reqUsers, reqAddOrUpdateUser } from "../../api";
import UserForm from './user-form'

/*
    用户路由
*/
export default class User extends Component {
    state = {
        // 所有的用户列表
        users: [],
        // 所有角色的列表
        roles: [],
        // 是否显示确认框
        isShow: false
    }

    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username'
            },
            {
                title: '邮箱',
                dataIndex: 'email'
            },
            {
                title: '电话',
                dataIndex: 'phone'
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                // render: (role_id) => this.state.roles.find(role => role_id === role._id).name
                render: (role_id) => this.roleNames[role_id]
            },
            {
                title: '操作',
                render: (user) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
                        <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
                    </span>
                )
            }
        ]
    }

    /*
        根据 role 的数组，生成包含所有角色名的对象(属性名用角色的 id 值)
    */
    initRoleNames = (roles) => {
        // 使用 reduce 进行累计，初始值为空对象
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})
        // 保存
        this.roleNames = roleNames
    }

    /*
        显示添加界面
    */
    showAdd = () => {
        // 去除前面保存的 user
        this.user = null
        this.setState({
            isShow: true
        })
    }

    /*
        显示修改界面
    */
    showUpdate = (user) => {
        // 保存 user
        this.user = user
        this.setState({
            isShow: true
        })
    }

    /*
        删除指定用户
    */
    deleteUser = (user) => {
        Modal.confirm({
            title: `确认删除${user.username}吗？`,
            onOk: async () => {
                const result = await reqDeleteUser(user._id)
                if (result.status === 0) {
                    message.success('删除用户成功！')
                    this.getUsers()
                }
            }
        })
    }

    /*
        添加/更新用户
    */
    addOrUpdateUser = () => {
        this.setState({
            isShow: false
        })
        // 1. 收集输入数据
        // const user = this.form.getFieldsValue()
        this.form.validateFields( async (error, values) => {
            if (!error) {
                this.form.resetFields()
                // 如果是更新，需要给 user 指定 _id 属性
                if (this.user) {
                    values._id = this.user._id
                }
                // 2.提交添加的请求
                const result = await reqAddOrUpdateUser(values)
                if (result.status === 0) {
                    message.success(`${this.user ? '修改' : '添加'}用户成功！`)
                    this.getUsers()
                } else {
                    message.error(result.msg)
                    }
            }
        })


        // 3.更新列表显示
    }

    getUsers = async () => {
        const result = await reqUsers()
        if (result.status === 0) {
            const { users, roles } = result.data
            this.initRoleNames(roles)
            this.setState({
                users,
                roles
            })
        }
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getUsers()
    }

    render() {
        const { users, isShow, roles } = this.state
        const user = this.user || {}
        const title = <Button type={'primary'} onClick={ this.showAdd }>创建用户</Button>

        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey={'_id'}
                    dataSource={ users }
                    columns={this.columns}
                    pagination={{defaultPageSize: PAGE_SIZE}}
                />;

                <Modal
                    title={ user._id ? '修改用户' : '添加用户'}
                    visible={ isShow }
                    onOk={ this.addOrUpdateUser }
                    onCancel={ () => {
                        this.setState({ isShow: false })
                        this.form.resetFields()
                    }}
                >
                    <UserForm
                        setForm={ form => this.form = form }
                        roles={roles}
                        user={user}
                    >
                    </UserForm>
                </Modal>
            </Card>
        );
    }
}
