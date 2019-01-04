import { combineReducers } from 'redux';
import { reducer as userReducer } from './user';
import classroomReducer from './classroom/reducer';

const reducer = combineReducers({
  user: userReducer,
  classroom: classroomReducer
})

export default reducer;