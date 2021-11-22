import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import { getUserData } from './userSlice';

axios.defaults.headers.common.Authorization = window.localStorage.getItem('jwt_access_token');

export const getFamilies = createAsyncThunk(
  'contactsApp/families/getFamilies',
  async (routeParams, { getState }) => {

    routeParams = routeParams || getState().contactsApp.families.routeParams;
    const response = await axios.get('/api/contacts-app/familys', {
      params: routeParams,
    });
    const data = await response.data;
    console.log("get families", data);
    return { data, routeParams };
  }
);

const familiesAdapter = createEntityAdapter({});

export const { selectAll: selectFamilies, selectById: selectFamiliesById } =
  familiesAdapter.getSelectors((state) => state.contactsApp.families);


const familiesSlice = createSlice({
  name: 'contactsApp/families',
  initialState: familiesAdapter.getInitialState({
    searchText: '',
    routeParams: {},
    contactDialog: {
      type: 'new',
      props: {
        open: false,
      },
      data: null,
    },
  }),
  reducers: {
    setContactsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },

  },
  extraReducers: {
    // [updateContact.fulfilled]: contactsAdapter.upsertOne,
    // [addContact.fulfilled]: contactsAdapter.addOne,
    // [removeContacts.fulfilled]: (state, action) =>
    //   contactsAdapter.removeMany(state, action.payload),
    // [removeContact.fulfilled]: (state, action) => contactsAdapter.removeOne(state, action.payload),
    [getFamilies.fulfilled]: (state, action) => {
      const { data, routeParams } = action.payload;
      familiesAdapter.setAll(state, data);
      state.routeParams = routeParams;
      state.searchText = '';
    },
  },
});

// export const {
//   setContactsSearchText,
//   openNewContactDialog,
//   closeNewContactDialog,
//   openEditContactDialog,
//   closeEditContactDialog,
// } = familiesSlice.actions;

export default familiesSlice.reducer;
