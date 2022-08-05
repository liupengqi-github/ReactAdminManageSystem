import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
// 导入富文本样式
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

/*
    用于指定商品详情的富文本编辑器组件
*/

export default class RichTextEditor extends Component {
    static propTypes = {
        detail: PropTypes.string
    }

    state = {
        // 创建一个没有内容的编辑对象
        editorState: EditorState.createEmpty(),
    }

    constructor(props) {
        super(props);
        const html = this.props.detail
        if (html) {
            // 如果有值，根据 html 格式字符串创建一个对应的编辑对象
            const contentBlock = htmlToDraft(html);
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.state = {
                editorState,
            };
        } else {
            this.setState({
                // 创建一个没有内容的编辑对象
                editorState: EditorState.createEmpty()
            })
        }

    }

    /*
        输入过程中实时的回调
    */
    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    getDetail = () => {
        // 返回输入数据对应的 html 格式的文本
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }

        uploadImageCallBack = (file) => {
        return new Promise(
            (resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', `/manage/img/upload`);
                const data = new FormData();
                data.append('image', file);
                xhr.send(data);
                xhr.addEventListener('load', () => {
                    const response = JSON.parse(xhr.responseText);
                    // 得到图片地址
                    const url = response.data.url
                    resolve({data: {link: url }})
                });
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText);
                    reject(error);
                });
            }
        );
    }

    render() {
        const { editorState } = this.state;
        return (
            <Editor
                editorState={editorState}
                editorStyle={{border: '1px solid #aaa', minHeight: 200, paddingLeft: 10 }}
                onEditorStateChange={this.onEditorStateChange}
                toolbar={{
                    image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
                }}
            />
        );
    }
}
