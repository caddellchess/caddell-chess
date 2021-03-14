import { combineReducers } from 'redux';
import echo from './echoReducer';
import client from './clientReducer';
import levels from './levelsReducer';

export default combineReducers({
 echo,
 client,
 levels
});
