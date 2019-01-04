import * as constants from './constants';
import axios from '../../axios';


// 设置班级数据
const setClassroom = data => ({
  type: constants.SET_CLASSROOM,
  data
})

export const action_get_classroom_list = () => (
  async (dispatch) => {
    const { success, data } = await axios.api_get_classroom_list();
    if ( !success ) return;
    dispatch(setClassroom(data));
  }
)

// 修改班级
export const putOneClassroom = data => ({
  type: constants.PUT_ONE_CLASSROOM,
  data
})

// 删除一个
export const deleteOneClassroom = data => ({
  type: constants.DELETE_ONE_CLASSROOM,
  data
})