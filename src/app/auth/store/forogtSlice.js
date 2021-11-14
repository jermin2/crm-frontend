import { createSlice } from '@reduxjs/toolkit';

import jwtService from 'app/services/jwtService';
import history from '@history';
import { showMessage } from 'app/store/fuse/messageSlice';

export const submitResetLink =
  ({ email }) =>
  async (dispatch) => {
    return jwtService
      .sendResetLink(email)
      .then(() => {

        dispatch(
          showMessage({
              message     : 'Password Reset Link Sent',//text or html
              autoHideDuration: 6000,//ms
              anchorOrigin: {
                  vertical  : 'top',//top bottom
                  horizontal: 'center'//left center right
              },
              variant: 'success'//success error info warning null
          }));


        history.push({
          pathname: '/login',
        });
        return dispatch(resetSuccess());
      })
      .catch((errors) => {
        if (errors) {
          errors = [{ type: 'email', message: errors.email ? errors.email : '' }];
        }
        return dispatch(resetError(errors));
      });
  };

const initialState = {
  success: false,
  errors: [],
};

const resetSlice = createSlice({
  name: 'auth/reset',
  initialState,
  reducers: {
    resetSuccess: (state, action) => {
      state.success = true;
      state.errors = [];
    },
    resetError: (state, action) => {
      state.success = false;
      state.errors = action.payload;
    },
  },
  extraReducers: {},
});


export const { resetSuccess, resetError } = resetSlice.actions;

export default resetSlice.reducer;
