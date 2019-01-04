import React from 'react';
import { Form, Input, Card, Button, message } from 'antd';
import 'braft-editor/dist/index.css'
import BraftEditor from 'braft-editor'
import '../../Topic/Add/index.scss';
import axios from '../../../axios';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

class ShareAdd extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '添加分享',
      id: ''
    }
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.props.form.validateFields((error, values) => {
      if (!error) {
        const submitData = {
          title: values.title,
          content: values.content.toHTML() // or values.content.toHTML()
        }
        this.save_info(submitData);
      }
    })

  }

  // 保存数据
  async save_info(data) {
    const { id } = this.state;
    if ( id !== '' ) {
      // 修改
      const { success, msg } = await axios.api_put_share(id, data);
      if ( !success ) return;
      message.success(msg);
      setTimeout(() => {
        this.props.history.push('/share/list');
      }, 2000);
    } else {
      // 添加
      const { success, msg } = await axios.api_post_share(data);
      if ( !success ) return;
      message.success(msg);
      setTimeout(() => {
        this.props.history.push('/share/list');
      }, 2000);
    }
  }

  componentDidMount() {
    const { id = false } = this.props.match.params;
    if ( id ) { 
      // 存在id 修改分享
      this.setState( () => ({
        title: '修改分享',
        id
      }))
      // 根据id获取到信息
      this.get_share(id);
    }
  }

  async get_share(id){
    const { success, data } = await axios.api_get_share(id);
    if ( !success) return;
    const { title, content } = data;
    this.props.form.setFieldsValue({
      title: title,
      content: BraftEditor.createEditorState(content)
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="share-add-page">
        <Card
          title={ this.state.title }
        >
          <Form
            onSubmit={this.handleSubmit}
          >
            <FormItem
              {...formItemLayout}
              label="分享标题"
            >
              {getFieldDecorator('title', {
                rules: [{
                  required: true,
                  message: '标题不能为空',
                }],
              })(
                <Input size="large" placeholder="请输入标题"/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="分享内容"
            >
              {getFieldDecorator('content', {
              validateTrigger: 'onBlur',
              rules: [{
                required: true,
                validator: (_, value, callback) => {
                  if (value.isEmpty()) {
                    callback('请输入正文内容')
                  } else {
                    callback()
                  }
                }
              }],
            })(
              <BraftEditor
                className="my-editor"
                placeholder="请输入正文内容"
              />
            )}
            </FormItem>
            <FormItem
              style={{textAlign: 'center'}}
            >
              <Button
                className='blue-btn'
                size="large"
                htmlType="submit"
              >保存</Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    )
  }
}

export default Form.create()(ShareAdd);
