import { yupResolver } from '@hookform/resolvers/yup';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Icon from '@mui/material/Icon';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import IconButton from '@mui/material/IconButton';

import MenuItem from '@mui/material/MenuItem';

import _ from '@lodash';
import * as yup from 'yup';
import DeleteButton from './ConfirmDelete';
import ContactAvatar from './ContactAvatar';

import {
  removeContact,
  updateContact,
  closeQuickContactDialog,
  openEditContactDialog,
  selectContacts,
  uploadPicture,
  setContactsTag,
  setContactsUnTag,
  updateTag,
  closeTagDialog,
  removeTag,
  addTag,
} from './store/contactsSlice';

import { openEditFamilyDialog } from './store/familiesSlice';

const defaultValues = {
  id: '',
  per_firstName: '',
  per_lastName: '',
  avatar: 'assets/images/avatars/profile.jpg',
  per_email: '',
  per_phone: '',
  per_birthday: '',
  school_year: '',
  per_notes: '',
};

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  color: yup.string().required('You must enter a color'),
  description: yup.string().required('You must enter a description'),
});

function TagDialog(props) {
  const dispatch = useDispatch();
  const tagDialog = useSelector(({ contactsApp }) => contactsApp.contacts.tagDialog);
  const contacts = useSelector(selectContacts);
  const user = useSelector(({ contactsApp }) => contactsApp.user);

  const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const id = watch('tag_id');
  const name = watch('name');
  const avatar = watch('avatar');

  console.log('tag data: ', tagDialog);
  console.log('user data: ', user);

  /**
   * Initialize Dialog with Data
   */
  const initDialog = useCallback(() => {
    /**
     * Dialog type: 'edit'
     */
    if (tagDialog.type === 'edit' && tagDialog.data) {
      reset({ ...tagDialog.data });
    }
  }, [tagDialog.data, tagDialog.type, reset, contacts]);

  /**
   * On Dialog Open
   */
  useEffect(() => {
    if (tagDialog.props.open) {
      initDialog();
    }
  }, [tagDialog.props.open, initDialog]);

  function closeDialog() {
    dispatch(closeTagDialog());
  }
  /**
   * Form Submit
   */
  function onSubmit(data) {
    if (tagDialog.type === 'edit') {
      dispatch(updateTag({ ...tagDialog.data, ...data, user: user.id }));
    } else {
      dispatch(addTag({ ...tagDialog.data, ...data, user: user.id }));
    }
    console.log(data);

    closeDialog();
  }

  /**
   * Remove Event
   */
  function handleRemove() {
    dispatch(removeContact(id));
    closeDialog();
  }

  return (
    <Dialog
      classes={{
        paper: 'm-24',
      }}
      {...tagDialog.props}
      onClose={closeDialog}
      fullWidth
      maxWidth="xs"
    >
      <AppBar position="static" elevation={0}>
        <Toolbar className="flex w-full">
          <Typography variant="subtitle1" color="inherit">
            {tagDialog.type === 'new' ? 'Edit Tag' : 'Edit Tag'}
          </Typography>
        </Toolbar>
      </AppBar>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col md:overflow-hidden"
      >
        <DialogContent classes={{ root: 'p-24' }}>
          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">description</Icon>
            </div>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Description"
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
          </div>

          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">palette</Icon>
            </div>
            <Controller
              control={control}
              name="color"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Color"
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
          </div>
        </DialogContent>

        {tagDialog.type === 'new' ? (
          <DialogActions className="justify-between p-4 pb-16">
            <div className="px-16">
              <Button
                variant="contained"
                color="secondary"
                type="submit"
                disabled={_.isEmpty(dirtyFields) || !isValid}
              >
                Add
              </Button>
            </div>
          </DialogActions>
        ) : (
          <DialogActions className="justify-between p-4 pb-16">
            <div className="px-16">
              <Button
                variant="contained"
                color="secondary"
                type="submit"
                disabled={_.isEmpty(dirtyFields) || !isValid}
              >
                Save
              </Button>
            </div>
            <DeleteButton
              dispatch={dispatch}
              message="This will delete this tag permanently and cannot be undone"
              agreeAction={() => {
                dispatch(removeTag(tagDialog.data));
                closeDialog();
              }}
            />
          </DialogActions>
        )}
      </form>
    </Dialog>
  );
}

export default TagDialog;
