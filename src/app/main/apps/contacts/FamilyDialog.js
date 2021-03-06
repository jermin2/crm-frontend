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
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';

import _ from '@lodash';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import FamilyMemberContent from './FamilyMemberContent';

import DeleteButton from './ConfirmDelete';

import './ContactDialog.css';

import { selectContacts, removeContact, setFamilyTag } from './store/contactsSlice';

import {
  selectFamilies,
  closeFamilyDialog,
  updateFamily,
  removeFamily,
} from './store/familiesSlice';

const defaultValues = {
  family_members: [
    {
      per_firstName: '',
      per_lastName: '',
      per_familyRole: 5,
    },
  ],
};

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  fam_familyName: yup.string().required('You must enter a family name'),
  family_members: yup.array().of(
    yup.object().shape({
      per_firstName: yup.string().required('You must enter a name'),
    })
  ),
});

function FamilyDialog(props) {
  const dispatch = useDispatch();
  const families = useSelector(selectFamilies);
  const contacts = useSelector(selectContacts);
  const familyDialog = useSelector(({ contactsApp }) => contactsApp.families.familyDialog);
  const user = useSelector(({ contactsApp }) => contactsApp.user);

  const { control, watch, register, reset, handleSubmit, formState, getValues } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const [familyData, setFamilyData] = useState();

  const id = watch('id');

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
      const familyDataInput = families.find((f) => f.id === familyDialog.data.id);
      const familyMembers = familyDataInput.family_members.map((person) => {
        const personData = contacts.find((c) => c.id === person.id);
        return { ...person, ...personData };
      });
      const familyDataInit = { ...familyDataInput, family_members: [...familyMembers] };
      reset({ ...defaultValues, ...familyDataInit });
      setFamilyData(familyDataInit);
    }
  }, [familyDialog.data, familyDialog.type, reset, families]);

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
    // save changes to family
    data.action = 'update';
    dispatch(updateFamily(data));
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
          <div className="flex flex-row items-center justify-center pb-24">
          {user.tags ? (
            user.tags.map((t) => {
              return (
                <div key={t.tag_id} className="flex flex-row">
                  <IconButton
                    onClick={(ev) => {
                      dispatch(setFamilyTag({familyId: familyData.id, tag: t}));
                      // Remove
                      ev.stopPropagation();
                    }}
                  >
                    <Icon key={t.tag_id} sx={{ color: t.color }}>
                      {familyData && familyData.tags.some((tag) => tag.tag_id === t.tag_id)
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
        </DialogContent>

        <FamilyMemberContent
          control={control}
          formState={formState}
          family={familyDialog.data}
          dispatch={dispatch}
        />

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
                disabled={_.isEmpty(dirtyFields) || !isValid}
              >
                Save
              </Button>
            </div>
            <DeleteButton
              dispatch={dispatch}
              message="This will delete the family and any people in the family and cannot be undone"
              agreeAction={() => {
                dispatch(removeFamily(familyDialog.data.id));
                dispatch(closeFamilyDialog());
              }}
            />
          </DialogActions>
        )}
      </form>
    </Dialog>
  );
}

export default FamilyDialog;
