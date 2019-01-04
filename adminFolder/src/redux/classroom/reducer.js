import * as constants from './constants';
const defaultState = {
  isRequested: false,
  data: []
}

export default (state = defaultState, action ) => {

  if ( action.type === constants.SET_CLASSROOM ) {
    state = {
      isRequested: true,
      data: action.data
    }
  }

  if ( action.type === constants.PUT_ONE_CLASSROOM ) {
    const data = [...state.data];
    const { id, name } = action.data;
    const index = data.findIndex( item => item.id === id )
    if ( index >= 0 ) {
      data[index].name = name;
    }
    state.data = data;
  }

  if ( action.type === constants.DELETE_ONE_CLASSROOM ) {
    const data = [...state.data];
    const { id } = action.data;
    const index = data.findIndex( item => item.id === id )
    if ( index >= 0 ) {
      data.splice(index,1);
    }
    state = {
      isRequested: true,
      data
    }
  }

  return state;
}
