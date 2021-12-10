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

import axios from 'axios';

import {
  removeContact,
  updateContact,
  closeQuickContactDialog,
  openEditContactDialog,
  selectContacts,
  uploadPicture,
  setContactsTag,
  setContactsUnTag,
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
  per_firstName: yup.string().required('You must enter a name'),
});

function QuickContactDialog(props) {
  const dispatch = useDispatch();
  const contactDialog = useSelector(({ contactsApp }) => contactsApp.contacts.quickContactDialog);
  const contacts = useSelector(selectContacts);
  const user = useSelector(({ contactsApp }) => contactsApp.user);

  const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const id = watch('id');
  const name = watch('name');
  const avatar = watch('avatar');
  const contactFields = [
    { icon: null, name: 'per_lastName', label: 'Last Name' },
    { icon: 'phone', name: 'per_phone', label: 'Phone' },
    { icon: 'email', name: 'per_email', label: 'Email' },
    { icon: 'cake', name: 'per_birthday', label: '', type: 'date' },
    { icon: 'cake', name: 'school_year', label: 'School / Graduation Year', type: 'number' },
  ];
  const familyFields = [
    { icon: 'account_circle', name: 'family.fam_familyName', label: 'Family Name' },
    { icon: 'home', name: 'family.fam_familyAddress', label: 'Family Address' },
    { icon: 'email', name: 'family.fam_familyEmail', label: 'Family Email' },
  ];

  const familyMembersA = [
    { per_firstName: 'Bob', per_lastName: 'Brown', per_familyRole: 'Head' },
    { per_firstName: 'Maryanne', per_lastName: 'Brown', per_familyRole: 'Head' },
  ];

  const [familyMembers, setFamilyMembers] = useState(familyMembersA);
  const [personData, setPersonData] = useState();

  const familyRoles = useSelector(({ contactsApp }) => contactsApp.families.roles);
  /**
   * Initialize Dialog with Data
   */
  const initDialog = useCallback(() => {
    /**
     * Dialog type: 'edit'
     */
    if (contactDialog.type === 'edit' && contactDialog.data) {
      const contactData = contacts.find((c) => c.id === contactDialog.data.id);
      reset({ ...contactData });
      setPersonData(contactData);
      setFamilyMembers(contactDialog.data.family.family_members);
    }
  }, [contactDialog.data, contactDialog.type, reset, contacts]);

  /**
   * On Dialog Open
   */
  useEffect(() => {
    if (contactDialog.props.open) {
      initDialog();
    }
  }, [contactDialog.props.open, initDialog]);

  /**
   * Close Dialog
   */
  function closeComposeDialog() {
    dispatch(closeQuickContactDialog());
  }

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  /**
   * Form Submit
   */
  function onSubmit(data) {
    data.family.action = 'update';
    dispatch(updateContact({ ...contactDialog.data, ...data }));
    closeComposeDialog();
  }

  /**
   * Remove Event
   */
  function handleRemove() {
    dispatch(removeContact(id));
    closeComposeDialog();
  }

  const [file, setFile] = React.useState('');

  // Handles file upload event and updates state
  function handleUpload(event) {
    setFile(event.target.files[0]);

    // Add code here to upload file to server
    // ...
  }

  return (
    <Dialog
      classes={{
        paper: 'm-24',
      }}
      {...contactDialog.props}
      onClose={closeComposeDialog}
      fullWidth
      maxWidth="xs"
    >
      <AppBar position="static" elevation={0}>
        <Toolbar className="flex w-full">
          <Typography variant="subtitle1" color="inherit">
            {contactDialog.type === 'new' ? 'New Contact' : 'Edit Contact'}
          </Typography>
        </Toolbar>
        <div className="flex flex-col items-center justify-center pb-24">
          <ContactAvatar control={control} />
          {contactDialog.type === 'edit' && (
            <Typography variant="h6" color="inherit" className="pt-8">
              {name}
            </Typography>
          )}
        </div>
        <div className="flex flex-row items-center justify-center pb-24">
          {user.tags ? (
            user.tags.map((t) => {
              return (
                <div key={t.tag_id} className="flex flex-row">
                  <IconButton
                    onClick={(ev) => {
                      dispatch(setContactsTag({personId: personData.id, tag: t}));
                      // Remove
                      ev.stopPropagation();
                    }}
                  >
                    <Icon key={t.tag_id} sx={{ color: t.color }}>
                      {personData && personData.tags.some((tag) => tag.tag_id === t.tag_id)
                        ? 'radio_button_checked'
                        : 'radio_button_unchecked'}
                    </Icon>
                  </IconButton>
                </div>
              );
            })
          ) : (
            <></>
          )}
        </div>
      </AppBar>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col md:overflow-hidden"
      >
        <DialogContent classes={{ root: 'p-24' }}>



          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">account_circle</Icon>
            </div>
            <Controller
              control={control}
              name="per_firstName"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Name"
                  id="name"
                  error={!!errors.per_firstName}
                  helperText={errors?.per_firstName?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
          </div>

          {contactFields.map((contactField, i) => (
            <div className="flex" key={i}>
              <div className="min-w-48 pt-20">
                {contactField.icon ? <Icon color="action">{contactField.icon}</Icon> : <></>}
              </div>
              <Controller
                control={control}
                name={contactField.name}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label={contactField.label}
                    id={contactField.name}
                    type={contactField.type}
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </div>
          ))}

          <div className="flex">
            <div className="min-w-48 pt-20">
              {/* {contactField.icon ? <Icon color="action">{contactField.icon}</Icon> : <></>} */}
            </div>
            <Controller
              control={control}
              defaultValue={1}
              name="per_familyRole"
              render={({ field: { value, onChange } }) => (
                <TextField
                  className="mb-24"
                  label="Family Role"
                  value={value}
                  onChange={onChange}
                  select
                  variant="outlined"
                  fullWidth
                >
                  {familyRoles.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.family_role}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </div>

          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">note</Icon>
            </div>
            <Controller
              control={control}
              name="per_notes"
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Notes"
                  id="notes"
                  variant="outlined"
                  multiline
                  rows={5}
                  fullWidth
                />
              )}
            />
          </div>

          <div className="flex">
            <div className="min-w-48 pb-20 flex row">
              <Typography variant="h6" color="inherit" className="pt-8 px-8">
                Family
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                className="px-5 mx-5 rounded"
                onClick={() => {
                  dispatch(closeQuickContactDialog());
                  dispatch(openEditFamilyDialog(contactDialog.data.family));
                }}
              >
                Edit Family
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                className="px-5 mx-5 rounded"
                onClick={() => {
                  dispatch(closeQuickContactDialog());
                  dispatch(openEditContactDialog(contactDialog.data));
                }}
              >
                Change Family
              </Button>
              <hr />
            </div>
          </div>

          {familyFields.map((familyField, i) => (
            <div className="flex" key={i}>
              <div className="min-w-48 pt-20">
                {familyField.icon ? <Icon color="action">{familyField.icon}</Icon> : <></>}
              </div>
              <Controller
                control={control}
                name={familyField.name}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label={familyField.label}
                    id={familyField.name}
                    type={familyField.type}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                )}
              />
            </div>
          ))}

          <Typography variant="subtitle1" color="inherit">
            Members
          </Typography>
          <List>
            {familyMembers && familyRoles
              ? familyMembers.map((person, i) => (
                  <ListItem key={i} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        dispatch(openEditContactDialog(person));
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          className="w-20 h-20"
                          alt="contact avatar"
                          src={person.per_avatar}
                        />
                      </ListItemAvatar>
                      <ListItemText primary={`${person.per_firstName} ${person.per_lastName}`} />
                      <ListItemText
                        secondary={person.family_role_text}
                        className="pr-16 text-right"
                      />
                    </ListItemButton>
                  </ListItem>
                ))
              : ''}
          </List>
        </DialogContent>

        {contactDialog.type === 'new' ? (
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
              message="This will delete this person permanently and cannot be undone"
              agreeAction={() => {
                dispatch(removeContact(contactDialog.data.id));
                dispatch(closeQuickContactDialog());
              }}
            />
          </DialogActions>
        )}
      </form>
    </Dialog>
  );
}

export default QuickContactDialog;
