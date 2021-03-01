import { combineReducers } from 'redux';
import echo from './echoReducer';
import client from './clientReducer';

export default combineReducers({
 echo,
 client
});
