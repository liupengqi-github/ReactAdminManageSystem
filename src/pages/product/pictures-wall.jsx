import React from 'react'
import PropTypes from 'prop-types'
import {Upload, Icon, Modal, message} from 'antd';
import { reqDeleteImg } from "../../api";
import {BASE_IMG_URL} from "../../utils/constants";

/*
    用于图片上传的组件
*/
export default class PicturesWall extends React.Component {
    // 相当于 vue 的 props
    static propTypes = {
        imgs: PropTypes.array
    }

    state = {
        // 标识是否显示大图预览 Modal
        previewVisible: false,
        // 大图的 url
        previewImage: '',
        fileList: [],
    };

    constructor(props) {
        super(props);

        let fileList = []

        // 如果传入了 imgs 属性，那么就根据 imgs 来生成 fileList 数组
        const { imgs } = this.props
        if (imgs && imgs.length > 0) {
            fileList = imgs.map((img, index) => ({
                // 文件唯一标识，如果自己指定建议设置为负数，防止和内部产生的 id 冲突
                uid: -index,
                name: img,
                status: 'done',
                url: BASE_IMG_URL + img
            }))
        }

        // 初始化状态
        this.state = {
            // 标识是否显示大图预览 Modal
            previewVisible: false,
            // 大图的 url
            previewImage: '',
            // 所有已上传图片的数组
            fileList
        }
    }


    /*
        获取所有已上传图片文件名的数组
    */
    getImgs = () => {
        return this.state.fileList.map(file => file.name)
    }

    /*
        隐藏 Modal
    */
    handleCancel = () => this.setState({ previewVisible: false });


    handlePreview = async file => {
        console.log('大图', file);
        // 显示 file 指定的大图
        this.setState({
            // 如果没有 url 也就是没上传成功，那么显示图片的 base64(file.preview)
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    /*
        file：当前操作的图片文件(上传/删除)
         fileList: 所有已上传图片文件的数组
    */
    handleChange = async ({ file, fileList }) => {
        console.log('handleChange()', file.status,fileList.length, file);

        // 一旦上传成功，将当前上传的 file 的信息修正(name, url)
        if (file.status === 'done') {
            const result = file.response
            if (result.status === 0) {
                message.success('上传图片成功！')
                const { name, url } = result.data
                file = fileList[fileList.length - 1]
                file.name = name
                file.url = url
            } else {
                message.error('上传图片失败！')
            }
        } else if (file.status === 'removed') { // 删除图片
            // fileList 是不可以的，因为被删除的数组在 fileList 里面已经被删掉了(所以只能用 file 当前操作的文件)
            const result = await reqDeleteImg(file.name)
            if (result.status === 0) {
                message.success('删除图片成功！')
            } else {
                message.error('删除图片失败！')
            }
        }

        // 在操作(上传/删除)过程中更新 fileList 状态
        this.setState({ fileList })
    }

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div>Upload</div>
            </div>
        );
        return (
            <div>
                <Upload
                    /* 上传图片的接口地址 */
                    action="/manage/img/upload"
                    /* 只接收图片格式 */
                    accept={'image/*'}
                    /* 请求参数名 */
                    name={'image'}
                    /* 卡片样式 */
                    listType="picture-card"
                    /* 所有已上传图片文件对象的数组 */
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 3 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}
