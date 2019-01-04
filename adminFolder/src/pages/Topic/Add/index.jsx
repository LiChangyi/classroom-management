import React from 'react';
import { Form, Input, Card, Button, message } from 'antd';
import 'braft-editor/dist/index.css'
import BraftEditor from 'braft-editor'
import './index.scss';
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

class TopicAdd extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '添加话题',
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
      const { success, msg } = await axios.api_put_topic(id, data);
      if ( !success ) return;
      message.success(msg);
      setTimeout(() => {
        this.props.history.push('/topic/list');
      }, 2000);
    } else {
      // 添加
      const { success, msg } = await axios.api_post_topic(data);
      if ( !success ) return;
      message.success(msg);
      setTimeout(() => {
        this.props.history.push('/topic/list');
      }, 2000);
    }
  }

  componentDidMount() {
    const { id = false } = this.props.match.params;
    if ( id ) { 
      // 存在id 修改话题
      this.setState( () => ({
        title: '修改话题',
        id
      }))
      // 根据id获取到信息
      this.get_topic(id);
    }
  }

  async get_topic(id){
    const { success, data } = await axios.api_get_topic(id);
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
      <div className="topic-add-page">
        <Card
          title={ this.state.title }
        >
          <Form
            onSubmit={this.handleSubmit}
          >
            <FormItem
              {...formItemLayout}
              label="话题标题"
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
              label="话题内容"
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

export default Form.create()(TopicAdd);
