import { constants } from './';

// 设置user
export const setUser = (user) => ({
  type: constants.SET_USER,
  data: user
})

// 退出登录
export const logout = () => ({
  type: constants.LOGOUT_USER
})