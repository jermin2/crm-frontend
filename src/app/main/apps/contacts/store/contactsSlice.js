import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from 'app/store/fuse/messageSlice';
import { getUserData } from './userSlice';
// eslint-disable-next-line import/no-cycle
import { getFamilies } from './familiesSlice';

axios.defaults.headers.common.Authorization = window.localStorage.getItem('jwt_access_token');

export const getContacts = createAsyncThunk(
  'contactsApp/contacts/getContacts',
  async (routeParams, { dispatch, getState }) => {
    routeParams = routeParams || getState().contactsApp.contacts.routeParams;
    const response = await axios.get('/api/contacts-app/contact/');
    const data = await response.data;
    console.log('data :', data);
    dispatch(getFamilies());
    return { data, routeParams };
  }
);

export const getContact = createAsyncThunk(
  'contactsApp/contacts/getContact',
  async (id, routeParams, { getState }) => {
    routeParams = routeParams || getState().contactsApp.contacts.routeParams;
    const response = await axios.get(`/api/contacts-app/contact/${id}`);
    const data = await response.data;

    return { data, routeParams };
  }
);

export const addContact = createAsyncThunk(
  'contactsApp/contacts/addContact',
  async (contact, { dispatch, getState }) => {
    const response = await axios.post('/api/contacts-app/contact/', contact);
    const data = await response.data;
    dispatch(getContacts());

    dispatch(
      showMessage({
        message: 'Contact Added',
        autoHideDuration: 1000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
        variant: 'success',
      })
    );
    return data;
  }
);

export const uploadPicture = createAsyncThunk(
  'contactsApp/contact/picture',
  async (formData, { dispatch }) => {
    const response = await axios.post(`/api/contacts-app/avatar/`, formData, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    });
    const data = await response.data;
    console.log('returned data: ', data);
    return data;
  }
);

export const updateContact = createAsyncThunk(
  'contactsApp/contacts/updateContact',
  async (contact, { dispatch, getState }) => {
    const id = contact.id.toString();

    const response = await axios.put(`/api/contacts-app/contact/${id}/`, contact);
    const data = await response.data;

    dispatch(getContacts());

    return data;
  }
);

export const removeContact = createAsyncThunk(
  'contactsApp/contacts/removeContact',
  async (contactId, { dispatch, getState }) => {
    console.log('delete');
    await axios.delete(`/api/contacts-app/contact/${contactId}/`);
    dispatch(getContacts());
    dispatch(
      showMessage({
        message: 'Contact Removed',
        autoHideDuration: 1000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
        variant: 'warning',
      })
    );
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
    console.log('toggle starred contacts');
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
    const response = await axios.post('/api/contacts-app/updateContacts', { contactIds });
    const data = await response.data;

    dispatch(getUserData());

    dispatch(getContacts());

    return data;
  }
);

export const setContactsTag = createAsyncThunk(
  'contactsApp/contacts/setContactsTag',
  async ({ personId, tag }, { dispatch, getState }) => {
    console.log('sending out request');
    const response = await axios.patch(`/api/contacts-app/updatetags/${personId}`, tag);
    const data = await response.data;
    dispatch(getContacts());
    return data;
  }
);
export const addTag = createAsyncThunk(
  'contactsApp/contacts/setContactsTag',
  async ( tag , { dispatch, getState }) => {

    const response = await axios.post(`/api/contacts-app/tag/`, tag);
    const data = await response.data;
    dispatch(getUserData());

    return data;
  }
);

export const updateTag = createAsyncThunk(
  'contactsApp/contacts/setContactsTag',
  async ( tag , { dispatch, getState }) => {

    const response = await axios.put(`/api/contacts-app/tag/${tag.tag_id}/`, tag);
    const data = await response.data;
    dispatch(getUserData())

    return data;
  }
);

export const removeTag = createAsyncThunk(
  'contactsApp/contacts/setContactsTag',
  async ( tag , { dispatch, getState }) => {

    const response = await axios.delete(`/api/contacts-app/tag/${tag.tag_id}/`);
    const data = await response.data;
    dispatch(getUserData())

    return data;
  }
);

export const setContactsUnTag = createAsyncThunk(
  'contactsApp/contacts/setContactsUnstarred',
  async (contactIds, { dispatch, getState }) => {
    const response = await axios.post('/api/contacts-app/set-contacts-unstarred', { contactIds });
    const data = await response.data;

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
    filterTags: [],
    routeParams: {},
    quickContactDialog: {
      props: {
        open: false,
      },
      data: null,
    },
    contactDialog: {
      props: {
        open: false,
      },
      data: null,
    },
    tagDialog: {
      props: {
        open: false,
      },
      data: null,
    },
    extraDialog: {
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
    setContactsFilterTags: (state, action) => {
      if (state.filterTags.includes(action.payload)) {
        state.filterTags = state.filterTags.filter((t) => t.tag_id !== action.payload.tag_id);
      } else {
        state.filterTags.push(action.payload);
      }
    },
    openNewContactDialog: (state, action) => {
      state.contactDialog = {
        type: 'new',
        props: {
          open: true,
        },
      };
    },
    closeNewContactDialog: (state, action) => {
      state.contactDialog = {
        type: 'new',
        props: {
          open: false,
        },
      };
    },
    openEditContactDialog: (state, action) => {
      state.contactDialog = {
        type: 'edit',
        props: {
          open: true,
        },
        data: action.payload,
      };
    },
    closeEditContactDialog: (state, action) => {
      state.contactDialog = {
        type: 'edit',
        props: {
          open: false,
        },
        data: null,
      };
    },
    openQuickContactDialog: (state, action) => {
      state.quickContactDialog = {
        type: 'edit',
        props: {
          open: true,
        },
        data: action.payload,
      };
    },
    closeQuickContactDialog: (state, action) => {
      state.quickContactDialog = {
        type: 'edit',
        props: {
          open: false,
        },
        data: null,
      };
    },
    openExtraDialog: (state, action) => {
      state.extraDialog = {
        type: 'edit',
        props: {
          open: true,
        },
        data: action.payload,
      };
    },
    closeExtraDialog: (state, action) => {
      state.extraDialog = {
        type: 'new',
        props: {
          open: false,
        },
        data: null,
      };
    },
    openTagDialog: (state, action) => {
      state.tagDialog = {
        type: 'edit',
        props: {
          open: true,
        },
        data: action.payload,
      }
    },
    newTagDialog: (state, action) => {
      state.tagDialog = {
        type: 'new',
        props: {
          open: true,
        },
        data: null,
      }
    },
    closeTagDialog: (state, action) => {
      state.tagDialog = {
        type: 'edit',
        props: {
          open: false,
        },
        data: null,
      }
    }
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
      state.filterTags = [];
    },
  },
});

export const {
  setContactsFilterTags,
  setContactsSearchText,
  openNewContactDialog,
  closeNewContactDialog,
  openEditContactDialog,
  closeEditContactDialog,
  openQuickContactDialog,
  closeQuickContactDialog,
  openExtraDialog,
  closeExtraDialog,
  openTagDialog,
  closeTagDialog,
  newTagDialog,
} = contactsSlice.actions;

export default contactsSlice.reducer;
