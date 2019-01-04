import * as constants from './constants';
import api from '../api';

const actions = {
  async [constants.GET_TOPIC_LIST] ({ commit }, opts) {
    const { success, data = {} } = await api.api_get_topic_list(opts);
    if (!success) return;
    commit(constants.SET_TOPIC_LIST, data);
  },
  async [constants.GET_SHARE_LIST] ({ commit }, opts) {
    const { success, data = {} } = await api.api_get_share_list(opts);
    if (!success) return;
    commit(constants.SET_SHARE_LIST, data);
  },
  async [constants.GET_CLASSROOM_LIST] ({ commit }) {
    const { success, data = {} } = await api.api_get_classroom_list();
    if (!success) return;
    commit(constants.SET_CLASSROOM_LIST, data);
  },
  async [constants.GET_USER_INFO] ({commit}) {
    const { success, data } = await api.api_get_user();
    if (!success) return;
    commit(constants.SET_USER_INFO, data);
  }
}

export default actions;
