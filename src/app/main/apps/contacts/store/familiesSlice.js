import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from 'app/store/fuse/messageSlice';

// eslint-disable-next-line import/no-cycle
import { getContacts } from './contactsSlice';

axios.defaults.headers.common.Authorization = window.localStorage.getItem('jwt_access_token');

export const getFamilies = createAsyncThunk(
  'contactsApp/families/getFamilies',
  async (routeParams, { dispatch, getState }) => {
    routeParams = routeParams || getState().contactsApp.families.routeParams;
    const response = await axios.get('/api/contacts-app/family/', {
      params: routeParams,
    });
    const data = await response.data;
    // update the data with the person
    return { data, routeParams };
  }
);

export const removeFamily = createAsyncThunk(
  'contactsApp/contacts/removeFamily',
  async (familyId, { dispatch, getState }) => {
    console.log('delete');
    await axios.delete(`/api/contacts-app/family/${familyId}/`);
    dispatch(
      showMessage({
        message: 'Family Removed',
        autoHideDuration: 1000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
        variant: 'warning',
      })
    );
    return familyId;
  }
);

export const getRoles = createAsyncThunk(
  'contactsApp/families/getRoles',
  async (routeParams, { getState }) => {
    const response = await axios.get('/api/contacts-app/familyRole/');
    const data = await response.data;
    return { data };
  }
);

export const updateFamily = createAsyncThunk(
  'contactsApp/families/updateFamily',
  async (family, { dispatch, getState }) => {
    const id = family.id.toString();
    const response = await axios.put(`/api/contacts-app/family/${id}/`, family);
    const data = await response.data;

    dispatch(getContacts());
    return data;
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
    familyDialog: {
      type: 'new',
      props: {
        open: false,
      },
      data: null,
    },
    roles: {
      data: null,
    },
  }),
  reducers: {
    setFamiliesSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
    openEditFamilyDialog: (state, action) => {
      state.familyDialog = {
        type: 'edit',
        props: {
          open: true,
        },
        data: action.payload,
      };
    },
    closeFamilyDialog: (state, action) => {
      state.familyDialog = {
        props: {
          open: false,
        },
      };
    },
  },
  extraReducers: {
    [updateFamily.fulfilled]: familiesAdapter.upsertOne,
    [removeFamily.fulfilled]: (state, action) => familiesAdapter.removeOne(state, action.payload),
    [getFamilies.fulfilled]: (state, action) => {
      const { data, routeParams } = action.payload;
      familiesAdapter.setAll(state, data);
      state.routeParams = routeParams;
      state.searchText = '';
    },
    [getRoles.fulfilled]: (state, action) => {
      const { data } = action.payload;
      state.roles = data;
    },
  },
});

export const { openEditFamilyDialog, closeFamilyDialog } = familiesSlice.actions;

export default familiesSlice.reducer;
