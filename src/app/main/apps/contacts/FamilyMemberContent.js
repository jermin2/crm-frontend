import { Controller, useFieldArray } from 'react-hook-form';
import TextField from '@mui/material/TextField';

import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';

import { useSelector } from 'react-redux';
import { useEffect } from 'react';

import _ from '@lodash';

import { selectContacts, openExtraDialog } from './store/contactsSlice';

import ExtraDialog from './ExtraDialog';

function FamilyMemberContent({ family, control, formState, dispatch }) {
  const { fields, append, replace, update, insert, remove } = useFieldArray({
    control,
    name: `family_members`,
  });

  const { isValid, dirtyFields, errors } = formState;

  const familyRoles = useSelector(({ contactsApp }) => contactsApp.families.roles);
  const contacts = useSelector(selectContacts);

  const defaultValues = {
    per_firstName: '',
    per_lastName: '',
    per_familyRole: 5,
    school_year: '',
    per_email: '',
    per_phone: '',
    per_birthday: '',
    person_id: '-1',
  };

  useEffect(() => {
    if (!family) return;
    const updatedFamilyMembers = family.family_members.map((person) => {
      return contacts.find((c) => c.id === person.id);
    });

    replace(updatedFamilyMembers);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [family, contacts]);

  function handleSubmit(data) {
    // This is hacky, but can't get update to work so it'll have to do for now
    remove(data.k);
    insert(data.k, data);
    // update(data.k, data);
  }

  return (
    <div className="flex w-100 flex-col">
      {fields.map((item, k) => {
        return (
          <div className="flex w-100  flex-wrap row" key={item.id}>
            <div className="hidden">
              <Controller
                control={control}
                name={`family_members[${k}].person_id`}
                defaultValue={item.person_id}
                render={({ field }) => (
                  <TextField {...field} label="First Name" variant="outlined" readOnly />
                )}
              />
            </div>

            <div className="field-container">
              <Controller
                control={control}
                name={`family_members[${k}].per_firstName`}
                defaultValue={item.per_firstName}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="First Name"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </div>

            <div className="field-container">
              <Controller
                control={control}
                name={`family_members[${k}].per_lastName`}
                defaultValue={item.per_lastName}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Last Name"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </div>

            <div className="field-container">
              <Controller
                control={control}
                name={`family_members[${k}].school_year`}
                defaultValue={item.school_year}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="School Year / Graduation year"
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
                defaultValue={item.per_familyRole}
                name={`family_members[${k}].per_familyRole`}
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
                  onClick={() => dispatch(openExtraDialog({ ...item, k }))}
                >
                  more..
                </Button>
              </div>
            </div>
          </div>
        );
      })}
      <div className="px-16">
        <Button
          variant="contained"
          style={{ width: 'fit-content' }}
          onClick={() => append(defaultValues)}
          disabled={_.isEmpty(dirtyFields) || !isValid}
        >
          Add new person
        </Button>
      </div>
      <ExtraDialog handleExtraDialogSubmit={handleSubmit} />
    </div>
  );
}

export default FamilyMemberContent;
