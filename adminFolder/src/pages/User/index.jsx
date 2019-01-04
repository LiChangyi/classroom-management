import React, { Component, Fragment } from 'react';
import UserSearch from '../../components/UserSearch';
import { connect } from 'react-redux';
import Layer from '../../components/Layer';
import { Card, Table, message, Button, Divider, Modal } from 'antd';
import axios from '../../axios';
import './index.scss';
import { action_get_classroom_list } from '../../redux/classroom/actions';

const { confirm } = Modal;

const layerForm = [
  {
    key: 'schoolId',
    title: '学号',
    type: 'input'
  }, {
    key: 'name',
    title: '姓名',
    type: 'input'
  }, {
    key: 'classId',
    title: '班级',
    type: 'select'
  }
];

const defaultPagination = {
  total: 0,
  current: 1,
  pageSize: 10
}

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      pagination: defaultPagination,
      layerTitle: '修改学生',
      layerVisible: false,
      data: {
        id: '',
        schoolId: '',
        name: '',
        classId: '',
        avatar: ''
      }
    }
    this.columns = [{
      title: '学号',
      dataIndex: 'schoolId',
      key: 'schoolId',
    }, {
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '班级',
      dataIndex: 'classname',
      key: 'className',
    }, {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (info) => (
        <Fragment>
          <Button onClick= { () => this.change_user(info) }>修改</Button>
          <Divider type="vertical" />
          <Button type="danger" onClick= { () => this.delete_user(info) }>删除</Button>
        </Fragment>
      ),
    }];
  }

  componentDidMount() {
    const opts = {
      page: defaultPagination.current,
      size: defaultPagination.pageSize
    }
    this.get_user_list(opts)

    if ( !this.props.classroom.isRequested ) {
      this.props.get_classroom_list();
    }
  }

  async get_user_list(opts) {
    const { success, msg, data } = await axios.api_get_user_list(opts);
    if (!success) {
      msg && message.error(msg);
      return;
    }
    const { list, pagination } = data;
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
    this.get_user_list({
      page: values.current,
      size: values.pageSize
    });
  }

  // 保存学生
  async save_user() {
    const { id, name, schoolId, classId, avatar } = this.state.data;

    if ( name === '' || classId === '') {
      message.error('姓名和班级不能为空!');
      return;
    }
    const schoolIdReg = /^\d{12}$/;
    if ( !schoolIdReg.test(schoolId) ) {
      message.error('学号必须是12位纯数字!');
      return;
    }

    const { success, msg } = await axios.api_put_user({
      id,
      data: {
        name, schoolId, classId, avatar
      }
    })
    if ( !success ) return;
    message.success(msg);
    this.cancel();
    this.get_user_list({
      page: this.state.pagination.current,
      size: this.state.pagination.pageSize
    });
  }

  cancel() {
    const layerVisible = false;
    this.setState(() => ({
      layerVisible
    }));
  }
  
  // layer 值的改变
  valueChange({key, value}) {
    const temp = {};
    temp[key] = value;
    const data = Object.assign(this.state.data, temp);
    this.setState(() => ({
      data
    }))
  }

  // 改变用户
  change_user(info) {
    const layerVisible = true;
    const data = {
      id: info.id,
      schoolId: info.schoolId,
      name: info.name,
      classId: info.classId,
      avatar: info.avatar
    }
    this.setState(() => ({
      layerVisible,
      data
    }))
  }

  // 删除学生
  delete_user({id, name}) {
    confirm({
      title: '删除学生',
      content: `你即将删除${name},此操作不能回退!请谨慎操作!`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        const { success, msg } = await axios.api_delete_user(id);
        if ( !success ) return;
        message.success(msg);
        this.get_user_list({
          page: this.state.pagination.current,
          size: this.state.pagination.pageSize
        });
      }
    });
  }

  // 搜索学生
  searchUser(values) {
    const opts = Object.assign(values, {
      page: defaultPagination.current,
      size: defaultPagination.pageSize
    })
    this.get_user_list(opts)
  }

  render() {
    return (
      <main className="user-page">
        <Card title="模糊搜索">
          <UserSearch
            classrooms= { this.props.classroom.data }
            searchUser= { (values) => this.searchUser(values) }
          />
        </Card>
        <Card
          title={ `学生列表 => 共${this.state.pagination.total}条数据` }
        >
          <Table
            bordered={true}
            rowKey={item => item.id}
            columns={ this.columns }
            dataSource={this.state.list}
            pagination={this.state.pagination}
            onChange={(values) => this.paginationChange(values)}
          />
        </Card>
        <Layer
          layerForm= { layerForm }
          layerTitle= { this.state.layerTitle }
          layerVisible= { this.state.layerVisible }
          onOk={ () => this.save_user() }
          onCancel= { () => this.cancel() }
          data={ this.state.data }
          valueChange= { ( opts ) => this.valueChange(opts) }
          classrooms= { this.props.classroom.data }
        />
      </main>
    )
  }
}

const mapStateToProps = state => ({
  classroom: state.classroom
})

const mapDispatchToProps = dispatch => ({
  get_classroom_list(){
    dispatch(action_get_classroom_list());
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(User);
