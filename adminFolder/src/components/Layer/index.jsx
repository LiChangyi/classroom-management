import React from 'react';
import { Modal, Form, Input, Select } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

class Layer extends React.Component {
  renderFormItem() {
    const { layerForm } = this.props;
    return layerForm.map( item => (
      <FormItem
        { ...formItemLayout }
        label={ item.title }
        key= { item.key }
      >
        { this.enumInput(item) }
      </FormItem>
    ))
  }

  enumInput(item) {
    const { data, classrooms = [] } = this.props;
    // 普通输入框
    if ( item.type === 'input' ) {
      return (
        <Input
          value={ data[item.key] }
          onChange={ (e) => this.props.valueChange({
            value: e.target.value, 
            key: item.key
          })} 
          placeholder={ item.key } />
      )
    }

    // 下拉选择器
    if ( item.type === 'select' ) {
      return (
        <Select
          value={ data.classId }
          onChange= { (value) =>this.props.valueChange({
            key: 'classId',
            value
          })}
        >
          {
            classrooms.map( classroom => (
              <Option key={ classroom.id } value={ classroom.id }>{ classroom.name }</Option>
            ))
          }
        </Select>
      )
    }
  }

  render() {
    return (
      <Modal
        width={ this.props.width && this.props.width }
        title={ this.props.layerTitle }
        visible={ this.props.layerVisible }
        onOk= { () => this.props.onOk() }
        onCancel= { () => this.props.onCancel() }
        maskClosable= { false }
        okText="保存"
        cancelText="取消"
      >
        <Form>
          { this.renderFormItem() }
        </Form>
      </Modal>
    )
  }
}

export default Layer;
