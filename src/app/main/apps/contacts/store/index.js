import { combineReducers } from '@reduxjs/toolkit';
import contacts from './contactsSlice';
import families from './familiesSlice';
import user from './userSlice';

const reducer = combineReducers({
  contacts,
  families,
  user,
});

export default reducer;
