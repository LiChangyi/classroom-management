import { constants } from './';

const user = JSON.parse(window.sessionStorage.getItem("user")) || {};

const defaultState = {
  id: user.id || '',
  name: user.name || '',
  account: user.account || '',
  token: user.token || ''
}

export default ( state = defaultState, action) => {
  if ( action.type === constants.SET_USER ) {
    state = action.data;
    // 设置 sessionStorage
    window.sessionStorage.setItem("user", JSON.stringify(state));
  } 

  if ( action.type === constants.LOGOUT_USER ) {
    state = defaultState;
    window.sessionStorage.removeItem('user');
  }
  return state;
}