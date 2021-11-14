import { combineReducers } from '@reduxjs/toolkit';
import login from './loginSlice';
import register from './registerSlice';
import user from './userSlice';
import reset from './resetSlice';

const authReducers = combineReducers({
  user,
  login,
  register,
  reset,
});

export default authReducers;
