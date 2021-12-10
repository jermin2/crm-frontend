import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const displaySlice = createSlice({
  name: '/api/contacts-app/display/',
  initialState: {
    familyList: {
      props: {
        display: false,
      },
    },
    contactList: {
      props: {
        display: true,
      },
    },
  },
  reducers: {
    showFamilyList: (state, action) => {
      state.familyList = {
        props: {
          display: true,
        },
      };
      state.contactList = {
        props: {
          display: false,
        },
      };
    },
    showContactList: (state, action) => {
      state.familyList = {
        props: {
          display: false,
        },
      };
      state.contactList = {
        props: {
          display: true,
        },
      };
    },
  },
  extraReducers: {},
});

export const { showFamilyList, showContactList } = displaySlice.actions;

export default displaySlice.reducer;
