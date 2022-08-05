import React, {Component, PureComponent} from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Input,
    Tree
} from 'antd'
import menuList from "../../config/menuConfig";

const Item = Form.Item
const { TreeNode } = Tree;

/*
    添加分类的 form 组件
*/
export default class AuthForm extends PureComponent {

    static propTypes = {
        role: PropTypes.object
    }

    constructor(props) {
        super(props);
        // 根据传入角色的 menus 生成初始状态
        const { menus } = this.props.role
        this.state = {
            checkedKeys: menus
        }
    }

    /*
        为父组件提交获取最新 menus 数据的方法
    */
    getMenus = () => this.state.checkedKeys

    getTreeNodes = (menuList) => {
        return menuList.reduce((pre, item) => {
            pre.push(
                <TreeNode title={item.title} key={item.key}>
                    { item.children ? this.getTreeNodes(item.children) : null }
                </TreeNode>
            )
            return pre
        },[])
    }

    /*
        选中某个 node 时的回调
    */
    onCheck = checkedKeys => {
        // checkedKeys：选中项的数组
        console.log('onCheck', checkedKeys);
        this.setState({ checkedKeys });
    };

    componentWillMount() {
        this.treeNodes = this.getTreeNodes(menuList)
    }

    /*
        根据新传入的 role 来更新 checkedKeys 状态
         componentWillReceiveProps：当组件接收到新的属性时自动调用(render 之前)
    */
    componentWillReceiveProps(nextProps, nextContext) {
        console.log('componentWillReceiveProps', nextProps);
        const menus = nextProps.role.menus
        this.setState({
            checkedKeys: menus
        })

        // 正常情况下，调用 setState 界面视图才会更新, 但是在这个函数中，下面的写法也可以
       // this.state.checkedKeys = menus
    }

    render() {
        console.log('render');
        // 取到的 role.name 是在 render 每次更新时取的，每次更新斗会重新获取，所以 name 是最新的，但是 menuList 不是这样的
        const { role } = this.props
        const { checkedKeys } = this.state
        // 指定 Item 布局的配置对象
        const formItemLayout = {
            // 左侧 label 的宽度
            labelCol: { span: 4 },
            // 指定右侧包裹(内容)的宽度
            wrapperCol: { span: 15 },
        };

        return (
            <div>
                <Item label={'角色名称'} {...formItemLayout}>
                    <Input value={ role.name } disabled></Input>
                </Item>

                <Tree
                    checkedKeys={ checkedKeys }
                    onCheck={this.onCheck}
                    defaultExpandAll
                    checkable
                >
                    <TreeNode title="平台权限" key="all">
                        { this.treeNodes }
                    </TreeNode>
                </Tree>
            </div>
        );
    }
}
