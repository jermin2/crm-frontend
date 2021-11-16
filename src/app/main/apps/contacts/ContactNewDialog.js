import FuseUtils from '@fuse/utils/FuseUtils';
import { yupResolver } from '@hookform/resolvers/yup';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import DatePicker from '@mui/lab/DatePicker';

import _ from '@lodash';
import * as yup from 'yup';

import './ContactDialog.css';

import {
  removeContact,
  updateContact,
  addContact,
  closeNewContactDialog,
  closeEditContactDialog,
} from './store/contactsSlice';


const familyRoles = [ {value:1, label:'Head'}, {value:2, label:'Spouse'}, {value:3, label:'Child'}, {value:4, label:'Relative'}]

const months = Array.from({ length: 12 }, (item, i) => {
  return { label: new Date(0, i).toLocaleString('en-US', { month: 'long' }), value: i + 1 };
});
const days = Array.from({ length: 31 }, (_, i) => i + 1);

const defaultValues = {
  id: '',
  name: '',
  lastName: '',
  avatar: 'assets/images/avatars/profile.jpg',
  nickname: '',
  company: '',
  jobTitle: '',
  email: '',
  phone: '',
  address: '',
  birthday: '',
  notes: '',
};

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  name: yup.string().required('You must enter a name'),
});

function ContactNewDialog(props) {
  const dispatch = useDispatch();
  const contactDialog = useSelector(({ contactsApp }) => contactsApp.contacts.contactDialog);

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
    { name: 'lastName', label: 'Last Name' },
    { name: 'familyRole', label: 'Family Role' },
    { name: 'birthday', label: 'Birthday', type: 'date' },
    // { icon: 'email', name: 'email', label: 'Email' },
    // { icon: 'cake', name: 'birthday', label: '', type: 'date' },
    // { icon: 'home', name: 'address', label: 'Address' },
  ];
  const familyFields = [
    { icon: 'account_circle', name: 'name', label: 'Family Name' },
    { icon: 'home', name: 'address', label: 'Family Address' },
    { icon: 'email', name: 'email', label: 'Family Email' },
  ];

  const familyMembers = [
    { first_name: 'Bobbby', last_name: 'Brown', family_role: 'Head' },
    { first_name: 'Maryanne', last_name: 'Brown', family_role: 'Head' },
  ];

  /**
   * Initialize Dialog with Data
   */
  const initDialog = useCallback(() => {
    /**
     * Dialog type: 'edit'
     */
    if (contactDialog.type === 'edit' && contactDialog.data) {
      reset({ ...contactDialog.data });
    }

    /**
     * Dialog type: 'new'
     */
    if (contactDialog.type === 'new') {
      reset({
        ...defaultValues,
        ...contactDialog.data,
        id: FuseUtils.generateGUID(),
      });
    }
  }, [contactDialog.data, contactDialog.type, reset]);

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
    return contactDialog.type === 'edit'
      ? dispatch(closeEditContactDialog())
      : dispatch(closeNewContactDialog());
  }

  /**
   * Form Submit
   */
  function onSubmit(data) {
    if (contactDialog.type === 'new') {
      dispatch(addContact(data));
    } else {
      dispatch(updateContact({ ...contactDialog.data, ...data }));
    }
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
      maxWidth="lg"
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
          <div className="flex mb-24 flex-wrap">
            <div className="sub-container">
              <div className="field-container">
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="First Name"
                      id="name"
                      error={!!errors.name}
                      helperText={errors?.name?.message}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  )}
                />
              </div>

              <div className="field-container">
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Last Name"
                      id="lastName"
                      name="lastName"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </div>
            </div>

            <div className="sub-container">
              <div className="field-container row">
                <div className="date-field">
                  <Controller
                    control={control}
                    name="day"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Day"
                        name="day"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        select
                        variant="outlined"
                        fullWidth
                      >
                        {days.map((i) => (
                          <MenuItem key={i} value={i}>
                            {i}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </div>

                <div className="date-field mx-4">
                  <Controller
                    control={control}
                    name="month"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Month"
                        name="month"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        select
                        variant="outlined"
                        fullWidth
                      >
                        {months.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </div>

                <div className="date-field">
                  <Controller
                    control={control}
                    name="year"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Year"
                        name="year"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant="outlined"
                        fullWidth
                        type="number"
                      />
                    )}
                  />
                </div>
              </div>

              <div className="field-container">
                <Controller
                  control={control}
                  name="familyRole"
                  render={({ field }) => (
                    <TextField
                    {...field}
                    label="Family Role"
                    name="familyRole"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    select
                    variant="outlined"
                    fullWidth
                  >
                    {familyRoles.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  )}
                />

                <div className="flex mx-4 p-2">
                  <Button variant="outlined" style={{ 'border-radius': '0px' }}>
                    more..
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex row">
            <RadioGroup aria-label="family" defaultValue="exisitng" name="radio-buttons-group">
              <FormControlLabel value="new" control={<Radio />} label="Create a new family" />
              <FormControlLabel
                value="existing"
                control={<Radio />}
                label="Assign to an existing family"
              />
            </RadioGroup>
          </div>

          <div className="flex row">Drop down box</div>

          <div className="flex row">Family stuff</div>

          {/* <div className="flex">
              <div className="min-w-48 pb-20">
                <Typography variant="h6" color="inherit" className="pt-8">
                    {name}'s Family
                  </Typography>
                <hr />
            </div>
            </div> */}

          {/* {familyFields.map((familyField, i) => (
            <div className="flex">
              <div className="min-w-48 pt-20">
                {familyField.icon ? <Icon color="action">{familyField.icon}</Icon> : <></>}
              </div>
              <Controller
                control={control}
                name={familyField.name}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label={familyField.label}
                    id={familyField.name}
                    type={familyField.type}
                    name={familyField.name}
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </div>
          ))} */}

          {/* <Typography variant="subtitle1" color="inherit">
            Members
          </Typography>
          <List >
            {familyMembers.map( (person, i) => (
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar className="w-20 h-20" alt="contact avatar" src={avatar} />
                    </ListItemAvatar>
              <ListItemText primary={`${person.first_name} ${person.last_name}`} />
              <ListItemText secondary={person.family_role} className="pr-16 text-right"/>
            </ListItemButton>
          </ListItem>
            ))}
          </List> */}
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
            <IconButton onClick={handleRemove} size="large">
              <Icon>delete</Icon>
            </IconButton>
          </DialogActions>
        )}
      </form>
    </Dialog>
  );
}

export default ContactNewDialog;
