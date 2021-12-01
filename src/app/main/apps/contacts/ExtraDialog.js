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
import React, { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import MenuItem from '@mui/material/MenuItem';

import _ from '@lodash';
import * as yup from 'yup';

import { removeContact, closeExtraDialog, selectContacts } from './store/contactsSlice';

const defaultValues = {
  id: '',
  per_firstName: '',
  per_lastName: '',
  avatar: 'assets/images/avatars/profile.jpg',
  per_email: '',
  per_phone: '',
  per_birthday: '',
  school_year: '',
  per_familyRole: 5,
  notes: '',
};

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  per_firstName: yup.string().required('You must enter a name'),
});

function ExtraDialog(props) {
  const dispatch = useDispatch();
  const contactDialog = useSelector(({ contactsApp }) => contactsApp.contacts.extraDialog);

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

  const familyRoles = useSelector(({ contactsApp }) => contactsApp.families.roles);
  /**
   * Initialize Dialog with Data
   */
  const initDialog = useCallback(() => {
    /**
     * Dialog type: 'edit'
     */
    if (contactDialog.type === 'edit' && contactDialog.data) {
      reset({ ...defaultValues, ...contactDialog.data });
    } else {
      reset({ ...defaultValues });
    }
  }, [reset]);

  /**
   * On Dialog Open
   */
  useEffect(() => {
    if (contactDialog.props.open) {
      if (contactDialog.data) reset({ ...defaultValues, ...contactDialog.data });
      else reset({ ...defaultValues });
    }
  }, [contactDialog.props.open, initDialog]);

  /**
   * Close Dialog
   */
  function closeComposeDialog() {
    dispatch(closeExtraDialog());
  }

  /**
   * Form Submit
   */
  function onSubmit(data, e) {
    props.handleExtraDialogSubmit(data);
    closeComposeDialog();
  }

  /**
   * Remove Event
   */
  function handleRemove() {
    dispatch(removeContact(id));
    closeComposeDialog();
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
          <Avatar className="w-96 h-96" alt="contact avatar" src={avatar} />
          {contactDialog.type === 'edit' && (
            <Typography variant="h6" color="inherit" className="pt-8">
              {name}
            </Typography>
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
              name="notes"
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
        </DialogContent>
        <DialogActions className="justify-between p-4 pb-16">
          <div className="px-16">
            <Button
              variant="contained"
              color="secondary"
              // type="submit"
              onClick={handleSubmit(onSubmit)}
            >
              Close
            </Button>
          </div>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ExtraDialog;
