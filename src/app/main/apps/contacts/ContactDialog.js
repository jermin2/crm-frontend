import FuseUtils from '@fuse/utils/FuseUtils';
import { yupResolver } from '@hookform/resolvers/yup';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import ListItemText from '@mui/material/ListItemText';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import MenuItem from '@mui/material/MenuItem';
import _ from '@lodash';
import * as yup from 'yup';
import ExtraDialog from './ExtraDialog';
import DeleteButton from './ConfirmDelete';

import './ContactDialog.css';

import {
  removeContact,
  updateContact,
  addContact,
  closeNewContactDialog,
  closeEditContactDialog,
  selectContacts,
  openExtraDialog,
} from './store/contactsSlice';

import { selectFamilies } from './store/familiesSlice';

const defaultValues = {
  id: '',
  per_firstName: '',
  per_lastName: '',
  avatar: 'assets/images/avatars/profile.jpg',
  per_email: '',
  per_phone: '',
  school_year: '',
  per_familyRole: '5',
  family: { id: '', addFamily: 'false' },
};

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  per_firstName: yup.string().required('You must enter a name'),
  family: yup.object().when('addFamily', {
    is: 'false',
    then: yup.object().shape({
      id: yup.string().required('Must enter family name'),
    }),
  }),
});

function ContactDialog(props) {
  const dispatch = useDispatch();
  const contacts = useSelector(selectContacts);
  const families = useSelector(selectFamilies);
  const familyRoles = useSelector(({ contactsApp }) => contactsApp.families.roles);
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
    { name: 'per_lastName', label: 'Last Name' },
    { name: 'familyRole', label: 'Family Role' },
    { name: 'birthday', label: 'Birthday', type: 'date' },
  ];
  const familyFields = [
    {
      icon: 'account_circle',
      name: 'family.new.fam_familyName',
      label: 'Family Name',
      type: 'text',
    },
    { icon: 'home', name: 'family.new.fam_familyAddress', label: 'Family Address (Optional)' },
    {
      icon: 'email',
      name: 'family.new.fam_familyEmail',
      label: 'Family Email (Optional)',
      type: 'email',
    },
  ];

  const [showCreateFamily, setShowCreateFamily] = useState(false);
  const [personData, setPersonData] = useState(defaultValues);

  /**
   * Initialize Dialog with Data
   */
  const initDialog = useCallback(() => {
    setShowCreateFamily(false);
    /**
     * Dialog type: 'new'
     */
    if (contactDialog.type === 'new') {
      reset({
        ...defaultValues,
        id: FuseUtils.generateGUID(),
      });
      setPersonData(defaultValues);
    } else if (contactDialog.type === 'edit') {
      // load contact information
      const contactData = contacts.find((c) => c.id === contactDialog.data.person_id);
      setPersonData(contactData);
      reset({
        ...defaultValues,
        ...contactData,
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
    // Make this tidies
    if (data.family.addFamily === 'true') {
      data.family.id = '';
      data.family.action = 'create';
    } else {
      data.family.action = 'fetch';
    }
    if (contactDialog.type === 'new') {
      console.log('submit', data);
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

  function handleExtraDialogSubmit(data) {
    reset({ ...defaultValues, ...data });
  }

  return (
    <Dialog
      classes={{
        paper: 'm-24 custom-dialog-style',
      }}
      {...contactDialog.props}
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
          <div className="flex mb-24 flex-wrap">
            <div className="sub-container">
              <div className="field-container">
                <Controller
                  control={control}
                  name="per_firstName"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="First Name"
                      id="firstName"
                      error={!!errors.per_firstName}
                      helperText={errors?.per_firstName?.message}
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
                  name="per_lastName"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Last Name"
                      id="lastName"
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
                <Controller
                  control={control}
                  name="school_year"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="School Year / Graduation Year"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      type="number"
                      fullWidth
                    />
                  )}
                />
              </div>

              <div className="field-container">
                <Controller
                  control={control}
                  defaultValue={1}
                  name="per_familyRole"
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      // {...field}
                      label="Family Role"
                      value={value}
                      InputLabelProps={{
                        shrink: true,
                      }}
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

                <div className="flex mx-4 p-2">
                  <Button
                    variant="outlined"
                    style={{ borderRadius: '0px' }}
                    onClick={() => dispatch(openExtraDialog(personData))}
                  >
                    more..
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex row mb-12">
            <Controller
              rules={{ required: true }}
              control={control}
              defaultValue="false"
              name="family.addFamily"
              render={({ field: { onChange, value } }) => (
                <RadioGroup
                  aria-label="family"
                  defaultValue="true"
                  name="radio-buttons-group"
                  value={value}
                  onChange={(e) => {
                    setShowCreateFamily(e.target.value === 'true');
                    // TODO: Set the last name of the new family to be the current last name
                    onChange(e);
                  }}
                >
                  <FormControlLabel value="true" control={<Radio />} label="Create a new family" />
                  <FormControlLabel
                    value="false"
                    control={<Radio />}
                    label="Assign to an existing family"
                  />
                </RadioGroup>
              )}
            />
          </div>

          {!showCreateFamily ? (
            <div className="flex row mb-24">
              <Controller
                control={control}
                name="family.id"
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Existing Family"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    select
                    variant="outlined"
                    fullWidth
                  >
                    {families.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {/* {option.label} */}
                        <ListItemText
                          primary={option.fam_familyName}
                          secondary={option.family_members
                            .flatMap((x) => x.per_firstName)
                            .toLocaleString()}
                        />
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </div>
          ) : (
            <div className="optional-family-fields">
              <div className="min-w-48 pb-20">
                <Typography variant="h6" color="inherit" className="pt-8">
                  Family Fields
                </Typography>
                <hr />
              </div>

              {familyFields.map((familyField, i) => (
                <div className="flex" key={i}>
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
          )}
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
              message="This will delete this person forever and cannot be undone"
              agreeAction={() => {
                handleRemove();
              }}
            />
          </DialogActions>
        )}
      </form>
      <ExtraDialog handleExtraDialogSubmit={handleExtraDialogSubmit} />
    </Dialog>
  );
}

export default ContactDialog;
