import React, { Fragment } from 'react';
import { Card, Input, Button, Divider, Table, message, Modal } from 'antd';
import axios from '../../axios';
import dateFormat from '../../utils/dateFormat';

const Search = Input.Search;
const { confirm } = Modal;

const defaultPagination = {
  total: 0,
  current: 1,
  pageSize: 10
};

class Topic extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      list: [],
      pagination: defaultPagination,
      keyword: ''
    }
    this.columns = [
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
      }, {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (date) => dateFormat(date)
      }, {
        title: '创建用户',
        dataIndex: 'adminName',
        key: 'adminName',
      }, {
        title: '操作',
        key: 'action',
        align: 'center',
        render: (info) => (
          <Fragment>
            <Button className='green-btn'>
              <a title="查看详情" href={`#/topic/look/${info.id}`} rel="noopener noreferrer"  target="_blank">查看</a>
            </Button>
            <Divider type="vertical" />
            <Button
              className='blue-btn'
              onClick={ () => this.props.history.push(`/topic/put/${info.id}`) }
            >修改</Button>
            <Divider type="vertical" />
            <Button
              className='red-btn'
              onClick={ () => this.delete_one(info) }
            >删除</Button>
          </Fragment>
        )
      }
    ]
  }

  componentDidMount() {
    this.get_topic_list();
  }

  // 获取话题数据
  async get_topic_list(opts = {} ) {
    opts.keyword = this.state.keyword;
    const { success, msg, data } = await axios.api_get_topic_list(opts);
    if ( !success ) {
      msg && message.error(msg);
      return;
    }
    message.success(msg);
    this.setState(() => ({
      list: data.list
    }))
  }

  // 修改内容
  valueChange({key, value}) {
    console.log(key, value);
    let temp = {};
    temp[key] = value;
    const data = Object.assign(this.state.data, temp);
    this.setState( () => ({
      data
    }))
  }

  // 删除话题
  delete_one({title, id}) {
    confirm({
      title: '删除话题',
      content: `确认删除话题${title}吗?此操作不能撤回!请谨慎操作`,
      onOk: async () => {
        const { success, msg } = await axios.api_delete_topic(id);
        if ( !success ) return;
        message.success(msg);
        const data = [...this.state.list];
        const index = data.findIndex(item => item.id === id);
        if ( index >= 0 ) {
          data.splice(index, 1);
          this.setState(() => ({
            list: [...data]
          }))
        }
      }
    })
  }

  // 搜索
  search() {
    const pagination = defaultPagination;
    this.get_topic_list(pagination);
  }

  // 搜索框内容改变
  searchChange(value) {
    this.setState(() => ({
      keyword: value
    }))
  }

  render() {
    return (
      <main className="topic-page">
        <Card title="模糊搜索">
          <Search
            placeholder="输入内容,支持模糊查询..."
            addonBefore="话题标题"
            width="300px"
            enterButton="搜索"
            style={{width: 600}}
            value={ this.state.keyword }
            onChange={ (e) => this.searchChange(e.target.value) }
            onSearch= { () => this.search() }
          />
        </Card>
        <Card title="话题列表">
          <Table
            bordered={true}
            rowKey={item => item.id}
            columns={ this.columns }
            dataSource={this.state.list}
            pagination={this.state.pagination}
          />
        </Card>
      </main>
    )
  }
}

export default Topic;
