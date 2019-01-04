import React from 'react';
import { Card, Form, Input, Checkbox, Button,message } from 'antd';
import { connect } from 'react-redux';
import { action_get_classroom_list } from '../../../redux/classroom/actions';
import axios from '../../../axios';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

class SignAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classroomIds: []
    }
  }

  componentDidMount() {
    if ( !this.props.classroom.isRequested ) {
      this.props.get_classroom_list();
    }
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.props.form.validateFields((error, values) => {
      if (!error) {
        values.classroomIds = values.classroomIds.join('|');
        values.expiration = Number(values.expiration);
        this.addSign(values)
      }
    })
  }

  // 添加签到表
  async addSign(opts){
    const { success, msg, data } = await axios.api_post_sign(opts);
    if ( !success ) return;
    message.success(msg);
    const { id } = data;
    window.open(`#/sign/look/${id}`, '_blank');
  }

  render() {
    const { getFieldDecorator } =this.props.form;
    const { classroom } = this.props;
    const classrooms = classroom.data || [];
    return (
      <main className="sign-add-page">
        <Card
          title= "创建签到表"
        >
          <Form
            onSubmit={this.handleSubmit}
          >
            <FormItem
              {...formItemLayout}
              label="签到表名称"
            >
              {getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: '签到表名称不能为空',
                }],
              })(
                <Input size="large" placeholder="请输入名称"/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="过期时间(s)"
            >
              {getFieldDecorator('expiration', {
                rules: [{
                  required: true,
                  message: '过期时间不能为空',
                }, {
                  pattern: /^\d{0,3}$/,
                  message: '时间必须是正整数0~999之内'
                }],
              })(
                <Input size="large" placeholder="请输入时间(正整数单位为秒)"/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="签到班级"
            >
              {getFieldDecorator('classroomIds', {
                rules: [{
                  required: true,
                  message: '签到的班级不能为空',
                }],
                // value: this.state.classroomIds
                })(
                <CheckboxGroup>
                  {
                    classrooms.map(item => <Checkbox key={item.id} value={item.id}>{item.name}</Checkbox>)
                  }
                </CheckboxGroup>
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

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(SignAdd));
