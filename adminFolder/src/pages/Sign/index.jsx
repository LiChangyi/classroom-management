import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Card, Button, Divider, Table, message, Modal, Select, Tag } from 'antd';
import axios from '../../axios';
import dateFormat from '../../utils/dateFormat';
import { action_get_classroom_list } from '../../redux/classroom/actions';

const { confirm } = Modal;
const Option = Select.Option;

const defaultPagination = {
  total: 0,
  current: 1,
  pageSize: 10
};

class Sign extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      pagination: defaultPagination,
      classId: 'all'
    }
    this.columns = [
      {
        title: '名称',
        key: 'name',
        dataIndex: 'name'
      }, {
        title: '签到班级',
        key: 'classrooms',
        dataIndex: 'classrooms',
        render: (arr)  => {
          return arr.map( item => <Tag key={ item.id } size="large" color="#f50">{ item.name }</Tag>)
        }
      }, {
        title: '管理员',
        key: 'adminName',
        dataIndex: 'adminName'
      }, {
        title: '创建时间',
        key: 'created_at',
        dataIndex: 'created_at',
        render: (date) => dateFormat(date)
      }, {
        title: '操作',
        key: 'action',
        render: (info) => (
          <Fragment>
            <Button
              className="green-btn"
            >
            <a href={`#/sign/look/${info.id}`} rel="noopener noreferrer"  target="_blank">查看详情</a>
            </Button>
            <Divider type="vertical" />
            <Button
              className="red-btn"
              onClick={ () => this.delete_one(info) }
            >删除</Button>
          </Fragment>
        )
      }
    ]
  } 

  componentDidMount() {
    this.get_sign_list(defaultPagination);
    if ( !this.props.classroom.isRequested ) {
      this.props.get_classroom_list();
    }
  }

  // 获取签到列表
  async get_sign_list(opts = {}) {
    opts.classId = this.state.classId;
    const { success, msg, data } = await axios.api_get_sign_list(opts);
    if ( !success ) return;
    message.success(msg);
    const { list = [], pagination = [] } = data;
    this.setState(() => ({
      list,
      pagination: {
        total: pagination.count,
        current: pagination.page,
        pageSize: pagination.size
      }
    }))
  }

  paginationChange(values) {
    this.get_sign_list({
      current: values.current,
      pageSize: values.pageSize
    });
  }

  // 搜索
  search() {
    this.get_sign_list(defaultPagination);
  }

  // 删除一个签到表
  delete_one({id}) {
    confirm({
      title: '删除签到表',
      content: '你确认删除次签到表吗?此操作不能撤回,请谨慎操作!',
      onOk: async () => {
        const { success, msg } = await axios.api_delete_sign(id);
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

  render() {
    const { classroom: { data: classrooms = [] } } = this.props;
    
    return (
      <main className="sign-page">
        <Card title="班级查找">
          <Select onChange={ (value) => {
            this.setState(() => ({
              classId: value
            }))
          }} value={ this.state.classId } style={{ width: 200 }}>
            <Option value='all'>全部班级</Option>
            {
              classrooms.map( item => (
                <Option key={ item.id } value={ item.id }>{ item.name }</Option>
              ))
            }
          </Select>
          <Button 
            className="blue-btn"
            onClick={ () => this.search() }
          >搜索</Button>
        </Card>
        <Card title="签到列表">
          <Table
            bordered={true}
            rowKey={item => item.id}
            columns={ this.columns }
            dataSource={this.state.list}
            pagination={this.state.pagination}
            onChange={(values) => this.paginationChange(values)}
          />
        </Card>
      </main>
    )
  }
}

const mapStateToProps = (state) => ({
  classroom: state.classroom
})

const mapDispatchToProps = dispatch => ({
  get_classroom_list(){
    dispatch(action_get_classroom_list());
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Sign);
