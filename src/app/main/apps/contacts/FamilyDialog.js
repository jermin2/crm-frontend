import FuseUtils from '@fuse/utils/FuseUtils';
import { yupResolver } from '@hookform/resolvers/yup';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import ListItemText from '@mui/material/ListItemText';
import FamilyMemberContent from './FamilyMemberContent';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import MenuItem from '@mui/material/MenuItem';

import _ from '@lodash';
import * as yup from 'yup';

import './ContactDialog.css';

import {
  selectContacts,
  removeContact,
} from './store/contactsSlice';

import { selectFamilies, closeFamilyDialog, updateFamily } from './store/familiesSlice';

const months = Array.from({ length: 12 }, (item, i) => {
  return { label: new Date(0, i).toLocaleString('en-US', { month: 'long' }), value: i + 1 };
});
const days = Array.from({ length: 31 }, (_, i) => i + 1);

const defaultValues = {
};

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  // per_firstName: yup.string().required('You must enter a name'),
  // existingFamily: yup.string().when('addFamily', {
  //   is: 'false',
  //   then: yup.string().required('You must select an existing family'),
  // }),
  // fam_name: yup.string().when('addFamily', {
  //   is: 'true',
  //   then: yup.string().required('You must select enter a family name'),
  // }),
});

function FamilyDialog(props) {
  const dispatch = useDispatch();
  const families = useSelector(selectFamilies);
  const contacts = useSelector(selectContacts);
  const familyRoles = useSelector(({ contactsApp }) => contactsApp.families.roles);
  const familyDialog = useSelector(({ contactsApp }) => contactsApp.families.familyDialog);

  const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
    mode: 'onChange',
    defaultValues,
    // resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const id = watch('id');
  const name = watch('name');
  const avatar = watch('avatar');

  const familyFields = [
    { icon: 'account_circle', name: 'fam_familyName', label: 'Family Name', type: 'text' },
    { icon: 'home', name: 'fam_familyAddress', label: 'Family Address (Optional)' },
    {
      icon: 'email',
      name: 'fam_familyEmail',
      label: 'Family Email (Optional)',
      type: 'email',
    },
  ];

  /**
   * Initialize Dialog with Data
   */
  const initDialog = useCallback(() => {

    /**
     * Load person data from the contacts form
     */
    if (familyDialog.type === 'edit' && familyDialog.data) {

      const familyData = families.find( (f) => f.id === familyDialog.data.id)
      const familyMembers = familyData.family_members.map((person) => {
        const personData = contacts.find((c) => c.id === person.id);
        return { ...person, ...personData };
      });
      const familyDataInit = { ...familyData, family_members: [...familyMembers] };
      reset({ ...defaultValues, ...familyDataInit });
    }
  }, [familyDialog.data, familyDialog.type, reset]);

  /**
   * On Dialog Open
   */
  useEffect(() => {
    if (familyDialog.props.open) {
      initDialog();
    }
  }, [familyDialog.props.open, initDialog]);

  /**
   * Close Dialog
   */
  function closeComposeDialog() {
    dispatch(closeFamilyDialog());
  }

  /**
   * Form Submit
   */
  function onSubmit(data) {
    // // Make this tidies
    // if (data.family.addFamily === 'true') {
    //   data.family.id = '';
    //   data.family.action = 'create';
    //   console.log('removed family id');
    // } else {
    //   data.family.action = 'fetch';
    // }
    // if (familyDialog.type === 'new') {
    //   console.log('submit', data);
    //   // dispatch(addContact(data));
    // } // else {
    // //   dispatch(addContact({ ...contactDialog.data, ...data }));
    // // }

    console.log("submit data: ", data);

    if (familyDialog.type === 'edit'){
      // save changes to family
      data.action = "update";
      dispatch(updateFamily(data));
      // dispatch(updateContacts(data.family_members))
    } else if (familyDialog.type === 'new') {
      // dispatch(addFamily(data));
    }

    //closeComposeDialog();
  }

  /**
   * Remove Event
   */
  function handleRemove() {
    dispatch(removeContact(id));
    closeComposeDialog();
  }
  console.log('props: ', familyDialog.data);
  return (
    <Dialog
      classes={{
        paper: 'm-24 custom-dialog-style',
      }}
      {...familyDialog.props}
      onClose={closeComposeDialog}
      fullWidth
      maxWidth="lg"
    >
      <AppBar position="static" elevation={0}>
        <Toolbar className="flex w-full">
          <Typography variant="subtitle1" color="inherit">
            New Contact / Family
          </Typography>
        </Toolbar>
      </AppBar>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col md:overflow-hidden"
      >
        <DialogContent classes={{ root: 'p-24' }}>
          <div className="flex-container w-100">
            {familyFields.map((familyField, i) => (
              <div className="controller-field" key={i}>
                <Controller
                  control={control}
                  name={familyField.name}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mb-24"
                      label={familyField.label}
                      type={familyField.type}
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </div>
            ))}
          </div>
        </DialogContent>

        <FamilyMemberContent control={control} family={familyDialog.data} />

        {familyDialog.type === 'new' ? (
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
                // disabled={_.isEmpty(dirtyFields) || !isValid}
              >
                Save
              </Button>
            </div>
            <IconButton onClick={handleRemove} size="large">
              <Icon>delete</Icon>
            </IconButton>
          </DialogActions>
        )}
      </form>
    </Dialog>
  );
}

export default FamilyDialog;