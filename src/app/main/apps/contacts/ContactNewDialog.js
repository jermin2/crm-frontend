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

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import MenuItem from '@mui/material/MenuItem';

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

import {
  selectFamilies,
} from './store/familiesSlice';

const familyRoles = [
  { value: 1, label: 'Head' },
  { value: 2, label: 'Spouse' },
  { value: 3, label: 'Child' },
  { value: 4, label: 'Relative' },
];

const months = Array.from({ length: 12 }, (item, i) => {
  return { label: new Date(0, i).toLocaleString('en-US', { month: 'long' }), value: i + 1 };
});
const days = Array.from({ length: 31 }, (_, i) => i + 1);

const defaultValues = {
  id: '',
  per_first_name: '',
  per_last_name: '',
  avatar: 'assets/images/avatars/profile.jpg',
  per_day_of_birth: '',
  per_month_of_birth: '',
  per_year_of_birth: '',
  per_email: '',
  per_phone: '',
  existingFamily: '',
};

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  per_first_name: yup.string().required('You must enter a name'),
  existingFamily: yup.string().when('addFamily', {
    is: 'false',
    then: yup.string().required('You must select an existing family'),
  }),
});

function ContactNewDialog(props) {
  const dispatch = useDispatch();
  const families = useSelector(selectFamilies);

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
    { name: 'per_last_name', label: 'Last Name' },
    { name: 'familyRole', label: 'Family Role' },
    { name: 'birthday', label: 'Birthday', type: 'date' },
  ];
  const familyFields = [
    { icon: 'account_circle', name: 'name', label: 'Family Name' },
    { icon: 'home', name: 'address', label: 'Family Address' },
    { icon: 'email', name: 'email', label: 'Family Email' },
  ];

  const familyMembers = [
    { per_first_name: 'Bobbby', last_name: 'Brown', family_role: 'Head' },
    { per_first_name: 'Maryanne', last_name: 'Brown', family_role: 'Head' },
  ];

  const [showCreateFamily, setShowCreateFamily] = useState(false);

  /**
   * Initialize Dialog with Data
   */
  const initDialog = useCallback(() => {
    /**
     * Dialog type: 'edit'
     */
    // if (contactDialog.type === 'edit' && contactDialog.data) {
    //   reset({ ...contactDialog.data });
    // }

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
      console.log(data);
      dispatch(addContact(data));

    } // else {
    //   dispatch(addContact({ ...contactDialog.data, ...data }));
    // }
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
                  name="per_first_name"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="First Name"
                      id="firstName"
                      error={!!errors.per_first_name}
                      helperText={errors?.per_first_name?.message}
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
                  name="per_last_name"
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
                <div className="date-field">
                  <Controller
                    control={control}
                    name="per_day_of_birth"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Day"
                        name="dayOfBirth"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                </div>

                <div className="date-field mx-4">
                  <Controller
                    control={control}
                    name="per_month_of_birth"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Month"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        select
                        variant="outlined"
                        fullWidth
                        type="number"
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
                    name="per_year_of_birth"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Year"
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
                  defaultValue={1}
                  name="per_family_role"
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
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />

                <div className="flex mx-4 p-2">
                  <Button variant="outlined" style={{ borderRadius: '0px' }}>
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
              name="addFamily"
              render={({ field: { onChange, value } }) => (
                <RadioGroup
                  // {...field}
                  aria-label="family"
                  defaultValue="true"
                  name="radio-buttons-group"
                  value={value}
                  // onChange={}
                  onChange={(e) => {
                    setShowCreateFamily(e.target.value === 'true');
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
                name="existingFamily"
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
                          primary={option.fam_family_name}
                          secondary={option.family_members.flatMap( x => x.per_first_name).toLocaleString()}
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
                  Optional Family Fields
                </Typography>
                <hr />
              </div>

              {familyFields.map((familyField, i) => (
                <div className="flex" key={i}>
                  <Controller
                    control={control}
                    name={'fam_'.concat(familyField.name)}
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
