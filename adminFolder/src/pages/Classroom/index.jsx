import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Card, Table, Button, Divider, message, Modal } from 'antd';
import { action_get_classroom_list, putOneClassroom, deleteOneClassroom } from '../../redux/classroom/actions';
import Layer from '../../components/Layer';
import axios from '../../axios';

const { confirm } = Modal;

const layerForm = [
  {
    key: 'name',
    title: '班级名',
    type: 'input'
  }
];

class Classroom extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      layerTitle: '添加班级',
      layerVisible: false,
      data: {
        id: '',
        name: ''
      }
    }
    this.columns = [
      {
        title: '班级',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name, "zh")
      }, {
        title: '人数',
        dataIndex: 'stuNum',
        key: 'number',
        sorter: (a, b) => a.stuNum - b.stuNum
      }, {
        title: '操作',
        key: 'action',
        align: 'center',
        render: (info) => (
          <Fragment>
            <Button onClick={ () => this.change_classroom(info) }>修改</Button>
            <Divider type="vertical" />
            <Button type="danger" onClick={ () => this.delete_classroom(info) }>删除</Button>
          </Fragment>
        )
      }
    ];
  }

  componentDidMount() {
    if ( !this.props.classroom.isRequested ) {
      this.props.get_classroom_list();
    }
  }

  // 添加班级
  add_classroom() {
    const layerVisible = true;
    const layerTitle = '添加班级';
    const data = {
      id: '',
      name: ''
    }
    this.setState(() => ({
      layerVisible,
      layerTitle,
      data
    }))
  }

  // 修改班级
  change_classroom(info) {
    const { id, name } = info;
    const layerVisible = true;
    const layerTitle = '修改班级';
    const data = {
      id,
      name
    }
    this.setState(() => ({
      layerVisible,
      layerTitle,
      data
    }))

  }

  // 保存信息
  async save_classroom() {
    const { id, name } = this.state.data;
    if ( name === '' ) {
      message.error('班级名不能为空!');
      return;
    }
    if ( id === '' ) {
      // 添加班级
      const { success, msg } = await axios.api_post_classroom({
        name
      });
      if ( !success ) return;
      message.success(msg);
      this.props.get_classroom_list();
    } else {
      // 修改班级
      const { success, msg } = await axios.api_put_classroom({id, name});
      if ( !success ) return;
      message.success(msg);
      this.props.put_one_classroom({id, name})
    }
    this.cancel();
  }

  // 删除班级
  delete_classroom({id, name}) {
    confirm({
      title: '删除班级',
      content: `你即将删除${name},此操作不能回退!请谨慎操作!`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        const { success, msg } = await axios.api_delete_classroom(id);
        if ( !success ) return;
        message.success(msg);
        this.props.delete_one_classroom({id});
      },
      onCancel() {
        console.log('Cancel');
      }
    });
  }

  // layer 取消
  cancel() {
    const layerVisible = false;
    this.setState(() => ({
      layerVisible
    }))
  }

  // form 表单中值的更改
  valueChange({value, key}) {
    const data = Object.assign(this.state.data);
    data[key] = value;
    this.setState(() => ({
      data
    }))
  }

  render() {
    return (
      <main className="classroom-page">
        <Card
          title={
            <Fragment>
              班级列表
              <Divider type="vertical" />
              <Button type="primary" size="small" onClick={ () => this.add_classroom() }>添加班级</Button>
            </Fragment>
          }
        >
          <Table
            bordered={true}
            rowKey={item => item.id}
            columns={ this.columns }
            dataSource={this.props.classroom.data}
            pagination={ false }
          />
        </Card>
        <Layer
          layerForm= { layerForm }
          layerTitle= { this.state.layerTitle }
          layerVisible= { this.state.layerVisible }
          onOk={ () => this.save_classroom() }
          onCancel= { () => this.cancel() }
          data={ this.state.data }
          valueChange= { ( opts ) => this.valueChange(opts) }
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
  },
  put_one_classroom(data) {
    dispatch(putOneClassroom(data));
  },
  delete_one_classroom(data) {
    dispatch(deleteOneClassroom(data));
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Classroom);
