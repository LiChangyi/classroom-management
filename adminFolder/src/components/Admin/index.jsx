import React from 'react';
import { Row } from 'antd';
import NavLeft from '../NavLeft'
import './index.scss';

class Admin extends React.Component {
  render() {
    return (
      <Row className="container">
        <div className="left">
          <NavLeft />
        </div>
        <div className="main">
          {this.props.children}
        </div>
      </Row>
    );
  }
}
export default Admin;