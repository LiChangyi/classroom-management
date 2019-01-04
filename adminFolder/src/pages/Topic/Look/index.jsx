import React from 'react';
import axios from '../../../axios';
import './index.scss';
import dateFormat from '../../../utils/dateFormat';
import Comment from '../../../components/Comment';

class TopicLook extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: {
        title: '',
        time: '',
        author: '',
        content: ''
      },
      commentData: [],
      commentPagination: {
        page: 1,
        size: 10,
        count: 0
      },
      topicId: ''
    }
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    if ( id !== '' ) {
      this.setState(() => ({
        topicId: id
      }))
      this.get_topic(id);
    }
  }

  async get_topic(id){
    const { success, data } = await axios.api_get_topic(id);
    if ( !success) return;
    this.setState(() => ({
      data
    }))
    // 文章获取成功,获取 评论
    this.get_comment(this.state.commentPagination);
  }

  async get_comment(opts) {
    opts = Object.assign(opts, {
      topicId: this.state.topicId
    });
    const { success, data } = await axios.api_get_comment_list(opts);
    if ( !success) return;
    const { list = [], pagination = {}} = data;
    this.setState(() => ({
      commentPagination: pagination,
      commentData: list
    }))
  }

  // 评论的分页改变
  paginationChange(page) {
    const commentPagination = Object.assign(this.state.commentPagination, {
      page
    })
    this.get_comment(commentPagination);
    this.setState(() => ({
      commentPagination
    }))
  }

  // 删除一个评论
  deleteOne(id) {
    const data = this.state.commentData;
    const index = data.findIndex(item => item.id === id);
    if ( index >= 0 ) {
      data.splice(index, 1)
      this.setState(() => ({
        commentData: data
      }))
    }
  }

  render() {
    return (
      <div className="look-page">
        <div className="wrap">
          <article className="article">
            <h1 className="title">{ this.state.data.title }</h1>
            <div className="info">
              <span className="author">创建者: { this.state.data.adminName}</span>
              <span className="time">时间: { dateFormat(this.state.data.created_at) }</span>
            </div>
            <div className="content" dangerouslySetInnerHTML={{ __html: this.state.data.content }}>
            </div>
          </article>
          <Comment
            data={ this.state.commentData }
            pagination= { this.state.commentPagination }
            paginationChange= { (page) => this.paginationChange(page) }
            deleteOne= { (id) => this.deleteOne(id) }
          />
        </div>
      </div>
    )
  }
}

export default TopicLook;
