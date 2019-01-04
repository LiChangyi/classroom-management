import React, { Component } from 'react'
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { message } from 'antd';
import Login from '../pages/Login';
import Home from '../pages/Home';
import User from '../pages/User';
import Classroom from '../pages/Classroom';
import Topic from '../pages/Topic';
import TopicAdd from '../pages/Topic/Add/index.jsx';
import Share from '../pages/Share';
import ShareAdd from '../pages/Share/Add';
import Sign from '../pages/Sign';
import SignAdd from '../pages/Sign/Add';
import SignLook from '../pages/Sign/Look';
import Admin from '../components/Admin';
import TopicLook from '../pages/Topic/Look';

class RouterDom extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/login" component={ Login }/>
          <Route path="/topic/look/:id" component={ props => requireAuth(TopicLook, props) }/>
          <Route path='/sign/look/:id' component={ props => requireAuth(SignLook, props) } />
          <Route path="/" render={()=> 
            <Admin>
              <Switch>
                <Route path='/home' component={ props => requireAuth(Home, props) } />
                <Route path='/user' component={props => requireAuth(User, props)} />
                <Route path='/classroom' component={props => requireAuth(Classroom, props)} />
                <Route path='/topic/list' component={props => requireAuth(Topic, props)} />
                <Route path='/topic/add' component={props => requireAuth(TopicAdd, props)} />
                <Route path='/topic/put/:id' component={props => requireAuth(TopicAdd, props)} />
                <Route path='/share/list' component={props => requireAuth(Share, props)} />
                <Route path='/share/add' component={props => requireAuth(ShareAdd, props)} />
                <Route path='/share/put/:id' component={props => requireAuth(ShareAdd, props)} />
                <Route path='/sign/list' component={props => requireAuth(Sign, props)} />
                <Route path='/sign/add' component={props => requireAuth(SignAdd, props)} />
                <Redirect to="/home" />
              </Switch>
            </Admin>
          }/>
        </Switch>
      </Router>
    )
  }
}

function requireAuth(Layout, props) {
  const userInfo = JSON.parse(window.sessionStorage.getItem('user')) || {};
  const { token = '' } = userInfo;
  const auth = token !== '' ? false : true;
  if ( auth ) {
    message.error('请先登录!');
    return <Redirect to={{
      pathname: '/login',
      state: {
        form: props.location.pathname
      }
    }} />;
  } else {
    return <Layout {...props} />
  }
}

export default RouterDom
