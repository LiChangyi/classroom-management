import React from 'react';
import { Form, Input, Select,Button } from 'antd';

import './index.scss';

const FormItem = Form.Item;
const Option = Select.Option;

class UserSearch extends React.Component {

  handleSubmit = (event) => {
    event.preventDefault()
    this.props.form.validateFields((error, values) => {
      if (!error) {
        this.props.searchUser(values);
      }
    })
  }

  render() {
    const { classrooms = [] } = this.props;
    const {
      getFieldDecorator
    } = this.props.form;
    return (
      <Form
        className="user-search-form"
        layout="inline"
        onSubmit= { this.handleSubmit }
      >
        <FormItem
          label="学生姓名"
        >
          {getFieldDecorator('userName', {
          })(
            <Input placeholder="Username" />
          )}
        </FormItem>
        <FormItem
          label="学生学号"
        >
          {getFieldDecorator('schoolId', {
          })(
            <Input placeholder="schoolId" />
          )}
        </FormItem>
        <FormItem
          label="班级"
        >
          {getFieldDecorator('classroom', {
            initialValue: "all"
          })(
            <Select style={{ width: 200 }}>
              <Option value='all'>全部班级</Option>
              {
                classrooms.map( item => (
                  <Option key={ item.id } value={ item.id }>{ item.name }</Option>
                ))
              }
            </Select>
          )}
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
          >
            查询
          </Button>
      </FormItem>
    </Form>
    )
  }
}

export default Form.create()(UserSearch);
