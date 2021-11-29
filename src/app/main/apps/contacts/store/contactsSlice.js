import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import { getUserData } from './userSlice';
import { getFamilies } from './familiesSlice';

axios.defaults.headers.common.Authorization = window.localStorage.getItem('jwt_access_token');

export const getContacts = createAsyncThunk(
  'contactsApp/contacts/getContacts',
  async (routeParams, { getState }) => {
    routeParams = routeParams || getState().contactsApp.contacts.routeParams;
    const response = await axios.get('/api/contacts-app/contacts', {
      params: routeParams,
    });
    const data = await response.data;
    console.log('gathered data', data)

    return { data, routeParams };
  }
);

export const addContact = createAsyncThunk(
  'contactsApp/contacts/addContact',
  async (contact, { dispatch, getState }) => {
    const response = await axios.post('/api/contacts-app/add-contact', contact);
    const data = await response.data;
    dispatch(getContacts());
    dispatch(getFamilies());

    return data;
  }
);

export const updateContact = createAsyncThunk(
  'contactsApp/contacts/updateContact',
  async (contact, { dispatch, getState }) => {
    
    const id = contact.id.toString();
    const response = await axios.put('/api/contacts-app/update-contact/' + id , contact );
    const data = await response.data;

    dispatch(getContacts());

    return data;
  }
);

export const removeContact = createAsyncThunk(
  'contactsApp/contacts/removeContact',
  async (contactId, { dispatch, getState }) => {
    console.log('delete')
    await axios.delete('/api/contacts-app/removecontact/'+contactId.toString());

    return contactId;
  }
);

export const removeContacts = createAsyncThunk(
  'contactsApp/contacts/removeContacts',
  async (contactIds, { dispatch, getState }) => {
    await axios.post('/api/contacts-app/remove-contacts', { contactIds });

    return contactIds;
  }
);

export const toggleStarredContact = createAsyncThunk(
  'contactsApp/contacts/toggleStarredContact',
  async (contactId, { dispatch, getState }) => {
    const response = await axios.post('/api/contacts-app/toggle-starred-contact', { contactId });
    const data = await response.data;

    dispatch(getUserData());

    dispatch(getContacts());

    return data;
  }
);

export const toggleStarredContacts = createAsyncThunk(
  'contactsApp/contacts/toggleStarredContacts',
  async (contactIds, { dispatch, getState }) => {
    console.log("toggle starred contacts")
    const response = await axios.post('/api/contacts-app/toggle-starred-contacts', { contactIds });
    const data = await response.data;

    dispatch(getUserData());

    dispatch(getContacts());

    return data;
  }
);

export const setContactsStarred = createAsyncThunk(
  'contactsApp/contacts/setContactsStarred',
  async (contactIds, { dispatch, getState }) => {
    const response = await axios.post('/api/contacts-app/set-contacts-starred', { contactIds });
    const data = await response.data;

    dispatch(getUserData());

    dispatch(getContacts());

    return data;
  }
);

export const setContactsUnstarred = createAsyncThunk(
  'contactsApp/contacts/setContactsUnstarred',
  async (contactIds, { dispatch, getState }) => {
    const response = await axios.post('/api/contacts-app/set-contacts-unstarred', { contactIds });
    const data = await response.data;

    dispatch(getUserData());

    dispatch(getContacts());

    return data;
  }
);

const contactsAdapter = createEntityAdapter({});

export const { selectAll: selectFamilies, selectById: selectFamiliesById } =
  contactsAdapter.getSelectors((state) => state.contactsApp.families);

export const { selectAll: selectContacts, selectById: selectContactsById } =
  contactsAdapter.getSelectors((state) => state.contactsApp.contacts);

const contactsSlice = createSlice({
  name: 'contactsApp/contacts',
  initialState: contactsAdapter.getInitialState({
    searchText: '',
    routeParams: {},
    editContactDialog: {
      props: {
        open: false,
      },
      data: null,
    },
    newContactDialog: {
      props: {
        open: false,
      },
    },
  }),
  reducers: {
    setContactsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
    openNewContactDialog: (state, action) => {
      state.newContactDialog = {
        type: 'new',
        props: {
          open: true,
        },
      };
    },
    closeNewContactDialog: (state, action) => {
      state.newContactDialog = {
        type: 'new',
        props: {
          open: false,
        },
      };
    },
    openEditContactDialog: (state, action) => {
      state.editContactDialog = {
        type: 'edit',
        props: {
          open: true,
        },
        data: action.payload,
      };
    },
    closeEditContactDialog: (state, action) => {
      state.editContactDialog = {
        type: 'edit',
        props: {
          open: false,
        },
        data: null,
      };
    },
  },
  extraReducers: {
    [updateContact.fulfilled]: contactsAdapter.upsertOne,
    [addContact.fulfilled]: contactsAdapter.addOne,
    [removeContacts.fulfilled]: (state, action) =>
      contactsAdapter.removeMany(state, action.payload),
    [removeContact.fulfilled]: (state, action) => contactsAdapter.removeOne(state, action.payload),
    [getContacts.fulfilled]: (state, action) => {
      const { data, routeParams } = action.payload;
      contactsAdapter.setAll(state, data);
      state.routeParams = routeParams;
      state.searchText = '';
    },
  },
});

export const {
  setContactsSearchText,
  openNewContactDialog,
  closeNewContactDialog,
  openEditContactDialog,
  closeEditContactDialog,
} = contactsSlice.actions;

export default contactsSlice.reducer;
