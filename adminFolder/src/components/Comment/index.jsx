import React from 'react';
import './index.scss';
import { List, Avatar, Tag, Modal, Input, message } from 'antd';
import dateFormat from '../../utils/dateFormat';
import axios from '../../axios';

const { TextArea } = Input; 
const { confirm } = Modal;

class Comment extends React.Component {

  state = {
    visible: false,
    id: '',
    content: ''
  }

  changeComment({id, content}) {
    this.setState(() => ({
      visible: true,
      id, content
    }))
  }

  onCancel() {
    this.setState(() => ({
      visible: false
    }))
  }

  // 删除评论
  deleteComment({id, userName}) {
    confirm({
      title: '确定删除评论吗?',
      content: `即将删除${userName}的评论,此操作不能撤回,请谨慎操作!`,
      onOk: async () => {
        const { success, msg } = await axios.api_delete_comment(id);
        if ( !success ) return;
        message.success(msg);
        this.props.deleteOne(id);
      } 
    })
  }

  // 修改评论
  async onOk() {
    const { id, content } = this.state;
    const { success, msg } = await axios.api_put_comment(id, {
      content
    })
    if (!success) return;
    message.success(msg);
    const index = this.props.data.findIndex(item => item.id === id);
    if ( index >= 0 ) {
      this.props.data[index].content = content;
    }
    this.onCancel();
  }
  
  changeContent(content) {
    this.setState(() => ({
      content
    }))
  }

  render() {
    const { pagination = {} } = this.props;
    return (
      <div className="comment">
        <h1 className="title">用户回复</h1>
        <List
          itemLayout="vertical"
          size="large"
          dataSource={this.props.data}
          pagination={{
            onChange: (page) => {
              this.props.paginationChange(page);
            },
            pageSize: pagination.size,
            current: pagination.page,
            total: pagination.count
          }}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar size="large" src={`${item.avatar}`} />}
                title={ item.userName }
                description={ `学号:${item.schoolId} 班级:${item.className}` }
              />
              { item.content }
              <Tag onClick={() => this.changeComment(item) } color="#2db7f5" style={{ marginLeft: '10px'}}>修改</Tag>
              <Tag onClick={() => this.deleteComment(item) } color="#f50" style={{ marginLeft: '10px'}}>删除</Tag>
              <p className="time">{ dateFormat(item.created_at) }</p>
            </List.Item>
          )}
        />
        <MyModal
          visible= { this.state.visible }
          content= { this.state.content }
          onOk= { () => this.onOk() }
          onCancel= { () => this.onCancel() }
          changeContent= { (value) => this.changeContent(value) }
        />
      </div>
    )
  }
}

const MyModal = (props) => (
  <Modal
    title="修改评论"
    visible={ props.visible }
    onOk={ () => props.onOk() }
    onCancel= { () => props.onCancel() }
    maskClosable= { false }
  >
    <TextArea
      autosize={{minRows: 4, maxRows: 4}}
      placeholder="修改评论内容"
      value={ props.content }
      onChange= { (e) => props.changeContent(e.target.value) }
    />
  </Modal>
)

export default Comment;
