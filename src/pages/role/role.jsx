import React, { Component } from 'react'
import {
    Card,
    Button,
    Table,
    Modal, message
} from 'antd'
import {PAGE_SIZE} from "../../utils/constants";
import { reqRoles, reqAddRole, reqUpdateRole } from "../../api";
import AddForm from "./add-form";
import AuthForm from './auth-form'
import memoryUtils from "../../utils/memoryUtils";
import { formateDate } from "../../utils/dateUtils";
import storageUtils from "../../utils/storageUtils";

/*
    角色路由
*/
export default class Role extends Component {
    state = {
        // 是否显示添加界面
        isShowAdd: false,
        // 是否显示设置权限界面
        isShowAuth: false,
        // 所有角色的列表
        roles: [],
        // 选中的 role
        role: {}
    }

    constructor(props) {
        super(props);

        this.anth = React.createRef()
    }


    initColumns = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (create_time) => formateDate(create_time)
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                // 上面的简写方式
                render: formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            }
        ]
    }

    getRoles = async () => {
        const result = await reqRoles()
        if (result.status === 0) {
            const roles = result.data
            this.setState({
                roles
            })
        }
    }

    onRow = (role) => {
        return {
            // 点击行
            onClick: event => {
               this.setState({
                   role
               })
            }
        }
    }

    /*
        添加角色
    */
    addRole = () => {
        // 进行表单验证，只有通过了才向下处理
        this.form.validateFields( async (error, values) => {
            if (!error) {
                // 隐藏确认框
                this.setState({
                    isShowAdd: false
                })


                // 收集输入数据
                const { roleName } = values
                // 重置输入的数据，保证下次再打开的时候不会出现上次输入的数据
                this.form.resetFields()
                // 请求添加
                const result = await reqAddRole(roleName)
                // 根据结果更新列表显示
                if (result.status === 0) {
                    message.success('添加角色成功！')
                    // this.getRoles()

                    // 新产生的角色
                    const role = result.data
                    // 更新 roles 状态
                    /*
                        react 建议不要去直接更新状态数据，而是通过 setState 来更新数据
                        (下面做的方式是新产生了一个数组，往新的数组进行添加，而上面是直接想原 state 进行操作数据)
                    */
                    // const roles = this.state.roles
                    // const roles = [...this.state.roles]
                    // roles.push(role)
                    // this.setState({ roles })

                    // 推荐写法: 更新 roles 状态：基于原本数据状态更新
                    this.setState((state, props) => ({
                        // 这个函数返回的对象就是要更新的
                        roles: [...state.roles, role]
                    }))

                    // 对象的方式比较适合 更新的数据跟原数据没一点关系
                    // this.setState({
                    //
                    // })
                } else {
                    message.error('添加角色失败!')
                }
            }
        })
    }

    /*
        更新角色
    */
    updateRole = async () => {
        this.setState({
            isShowAuth: false
        })
        const role = this.state.role
        // 得到最新的 menus
        const menus = this.anth.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = memoryUtils.user.username

        // 请求更新
        const result = await reqUpdateRole(role)
        if (result.status === 0) {

            // 如果当前更新的是自己角色的权限，强制退出
            if (role._id === memoryUtils.user.role_id) {
                memoryUtils.user = {}
                storageUtils.removeUser()
                this.props.history.replace('/login')
                message.info('当前用户角色已修改，请重新登录！')
            } else {
                message.success('设置角色权限成功!')
                this.setState({
                    roles: [...this.state.roles]
                })
            }
        }
    }


    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getRoles()
    }


    render() {

        const { roles, role, isShowAdd, isShowAuth } = this.state

        const title = (
            <span>
                <Button type={'primary'} onClick={() => this.setState({ isShowAdd: true })}>创建角色</Button> &nbsp;&nbsp;
                <Button type={'primary'} disabled={!role._id} onClick={() => this.setState({ isShowAuth: true })}>设置角色权限</Button>
            </span>
        )

        return (

            <Card title={title}>
                <Table
                    bordered
                    rowKey={'_id'}
                    dataSource={ roles }
                    columns={this.columns}
                    pagination={{defaultPageSize: PAGE_SIZE }}
                    /* 选择某个 radio 的回调 */
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: [role._id],
                        onSelect: (role) => {
                            this.setState({
                                role
                            })
                        }
                    }}
                    onRow={this.onRow}
                >
                </Table>

                <Modal
                    title="添加角色"
                    visible={ isShowAdd }
                    onOk={this.addRole}
                    onCancel={() => {
                        this.setState({isShowAdd: false})
                        this.form.resetFields()
                    }}
                >
                    <AddForm
                        setForm={(form) => { this.form = form } }
                    ></AddForm>
                </Modal>

                <Modal
                    title="设置角色权限"
                    visible={ isShowAuth }
                    onOk={this.updateRole}
                    onCancel={() => {
                        this.setState({isShowAuth: false})
                    }}
                >
                    <AuthForm role={role} ref={this.anth}>

                    </AuthForm>
                </Modal>
            </Card>
        );
    }
}
