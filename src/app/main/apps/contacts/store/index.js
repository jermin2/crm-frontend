import { combineReducers } from '@reduxjs/toolkit';
import contacts from './contactsSlice';
import families from './familiesSlice';
import user from './userSlice';
import display from './displaySlice';

const reducer = combineReducers({
  contacts,
  families,
  user,
  display,
});

export default reducer;
