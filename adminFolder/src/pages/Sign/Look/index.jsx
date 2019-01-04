import React from 'react';
import { message, List, Tag, Button, Modal, Input } from 'antd';
import QRCode from 'qrcode.react';
import axios from '../../../axios';
import './index.scss';
import dateFormat from '../../../utils/dateFormat';

const { confirm } = Modal;
let timer = null;

class SignLook extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      data: {
        adminName: '',
        classroom: [],
        created_at: '',
        id: '',
        name: '',
        token: '',
        users: []
      },
      visible: false,
      schoolId: ''
    }
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    if ( id !== '' ) {
      this.setState(() => ({
        signId: id
      }))
      this.get_sign(id);
    }
  }

  componentWillUnmount() {
    clearTimeout(timer);
  }

  // 获取签到详情
  async get_sign(id) {
    const { success, data } = await axios.api_get_sign(id);
    if ( !success ) return;
    this.setState(() => ({
      data
    }))
    const { is_effective = false } = data;
    if ( is_effective ) {
      timer = setTimeout(() => {
        this.get_sign(id);
      }, 3000)
    }
  }

  // 删除学生签到
  deleteUser({name, id}) {
    confirm({
      title: '取消用户签到',
      content: `是否确认取消${name}的签到,此操作不能撤回,请谨慎操作!`,
      onOk: async () => {
        const { success, msg } = await axios.api_delete_sign_user({
          userIds: id,
          signId: this.state.data.id
        });
        if ( !success ) return;
        message.success(msg);
        const data = [...this.state.data.users];
        const index = data.findIndex(item => item.id === id);
        if ( index >= 0 ) {
          data.splice(index, 1);
          this.setState(() => ({
            data: Object.assign(this.state.data, {
              users: data
            })
          }))
        }
      }
    })
  }

  // 用户签到
  async userSign() {
    const { schoolId } = this.state;
    const schoolIdReg = /^\d{12}$/;
    if ( !schoolIdReg.test(schoolId) ) {
      message.error('学号必须是12位纯数字!');
      return;
    }
    const { success, msg } = await axios.api_post_sign_user({
      schoolId,
      signId: this.state.data.id
    });
    if ( !success ) return;
    message.success(msg);
  }

  render() {
    const { users, name, created_at, classrooms = [] } = this.state.data;
    const totalNum = classrooms.reduce((a,b) => a + b.stuNum, 0);
    return (
      <main className="sign-look">
        <div className="wrap">
          <h1>{name}</h1>
          <div>
            {classrooms.map(item => <Tag key={ item.id } size="large" color="#f50">{ item.name }</Tag>)}
          </div>
          <div style={{margin: '20px 0'}}>
            <span className="time">{dateFormat(created_at)}</span>
            <Button size="small" onClick={ () => this.setState(() => ({visible: true})) } style={{marginLeft: '10px'}} className="blue-btn">手动添加学生</Button>
          </div>
          <div className="qrcode-box">
            <QRCode
              value={ this.state.data.token }
              size={ 600 }
            />
          </div>
          <div className="user-box">
            <h2 className="user-box-title">{`目前签到人数(${users.length}/${totalNum})`}</h2>
            <List
              size="large"
              bordered
              dataSource={ users }
              renderItem={item => (
                <List.Item>
                  {`${item.schoolId} | ${item.name}`}
                  <Tag className="delete" onClick={() => this.deleteUser(item) } color="#f50" style={{ marginLeft: '10px'}}>删除</Tag>
                </List.Item>
              )}
            />
          </div>
        </div>
        <Modal
          visible= { this.state.visible }
          title='用户签到'
          onCancel= { () => this.setState(() => ({visible: false}))}
          onOk= { () => this.userSign() }
        > 
          <Input value={ this.state.schoolId } onChange={ ({target: { value }}) => this.setState(() => ({schoolId: value})) } placeholder="输入用户学号" />
        </Modal>
      </main>
    )
  }
}

export default SignLook;
