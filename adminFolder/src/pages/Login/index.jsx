import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Icon, Input, message } from 'antd';
import '../../styles/global.scss';
import './index.scss';
import axios from '../../axios';
import { setUser } from '../../redux/user/actions';

const FormItem = Form.Item;

class Login extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.get_token(values);
      }
    });
  }

  async get_token(values) {
    const res = await axios.api_get_token({
      account:  values.account,
      password: values.password,
      type: 100
    })
    const { data, success = false } = res;
    if ( !success ) return;
    message.success('登录成功!');
    const { token, id, name } = data;
    this.props.setUser({
      id,
      name,
      account: values.account,
      token
    })
    let pathname = '/home';
    const state = this.props.location.state;
    if ( state ) {
      pathname = state.form;
    }
    this.props.history.push(pathname);
  }

  componentDidMount() {
    console.log()
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <main className="login-page">
        <div className="wrap">
          <div className="title">登录</div>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem>
              {getFieldDecorator('account', {
                rules: [
                  { required: true, message: 'Please input your account!' },
                  { min: 4, max: 12, message: '账户应该是4~12位!'}
                ],
                initialValue: ""
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
                initialValue: ""
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" block={ true } htmlType="submit" className="login-button">
                Log in
              </Button>
            </FormItem>
          </Form>
        </div>
      </main>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user
})

const mapDispatchToProps = (dispatch) => ({
  setUser(user) {
    dispatch(setUser(user));
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Login));
