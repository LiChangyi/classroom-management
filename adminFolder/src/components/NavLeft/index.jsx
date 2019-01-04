import React from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Menu, Modal, message } from 'antd';
import MenuList from '../../config/menuConfig';
import { logout } from '../../redux/user/actions';
import './index.scss';

const { Item: MenuItem, SubMenu } = Menu;
const { confirm } = Modal;

class NavLeft extends React.Component {
  // 菜单渲染
  renderMenu(data) {
    return data.map((item) => {
      if ( item.children ) {
        return (
          <SubMenu title={item.title} key={item.key}>
            { this.renderMenu(item.children) }
          </SubMenu>
        )
      }
      return (
        <MenuItem title={item.title} key={ item.key }>
          <NavLink to={ item.path }>{ item.title }</NavLink>
        </MenuItem>
      );
    })
  }

  // 退出登录
  logout() {
    confirm({
      title: '退出登录',
      content: '是否退出登录?',
      onOk: () => {
        this.props.logout();
        this.props.history.push('/login'); 
        message.success('退出登录成功!');
      }
    })
  }

  render() {
    return (
      <nav className="nav-left">
        <NavLink to="/home">
          <h1 className="logo">Python 课堂点名</h1>
        </NavLink>
        <div className="user-info">
          <p className="user-name" onClick={ () => this.logout() } title="点击退出登录">{ this.props.user.name }</p>
        </div>
        <Menu
          mode="inline"
        >
          { this.renderMenu(MenuList) }
        </Menu>
      </nav>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user
})

const mapDispatchToProps = (dispatch) => ({
  logout() {
    dispatch(logout());
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NavLeft))
