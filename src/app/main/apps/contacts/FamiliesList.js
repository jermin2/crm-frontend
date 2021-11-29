import { motion } from 'framer-motion';
import FuseUtils from '@fuse/utils';
import Avatar from '@mui/material/Avatar';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ContactsMultiSelectMenu from './ContactsMultiSelectMenu';
import ContactsTable from './ContactsTable';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';

import {
  openEditContactDialog,
  openNewContactDialog,
  removeContact,
  toggleStarredContact,
  selectContacts,
} from './store/contactsSlice';

import { selectFamilies } from './store/familiesSlice';

const flexContainer = {
  display: 'flex',
  flexDirection: 'row',
  padding: 0,
};

function FamiliesList(props) {
  const dispatch = useDispatch();
  const contacts = useSelector(selectContacts);
  const families = useSelector(selectFamilies);
  const searchText = useSelector(({ contactsApp }) => contactsApp.contacts.searchText);
  const user = useSelector(({ contactsApp }) => contactsApp.user);

  const [filteredData, setFilteredData] = useState(null);

  const columns = useMemo(
    () => [
      {
        Header: ({ selectedFlatRows }) => {
          const selectedRowIds = selectedFlatRows.map((row) => row.original.id);

          return (
            selectedFlatRows.length > 0 && (
              <ContactsMultiSelectMenu selectedContactIds={selectedRowIds} />
            )
          );
        },
        accessor: 'avatar',
        Cell: ({ row }) => {
          return <Avatar className="mx-8" alt={row.original.name} src={row.original.avatar} />;
        },
        className: 'justify-center',
        width: 64,
        sortable: false,
      },
      {
        Header: 'Family Name',
        accessor: 'fam_familyName',
        className: 'font-medium',
        sortable: true,
      },
      {
        Header: 'Family Members',
        accessor: 'family_members',
        width: 30,
        Cell: ({ row }) => {

          const contactsList = useSelector(selectContacts);
          return (
            <List style={flexContainer}>
              {row.original.family_members
                ? row.original.family_members.map((person, i) => {
                    const personData = contactsList.find((c) => c.id === person.id);
                    person = { ...person, ...personData };
                    return (
                      <ListItem disablePadding>
                        <ListItemButton
                          className="p-0"
                          onClick={(ev) => {
                            ev.stopPropagation();
                            dispatch(openEditContactDialog(person));
                          }}
                        >
                          <ListItemText
                            primaryTypographyProps={{
                              style: { fontSize: 'small', margin: 'auto', width: 'fit-content' },
                            }}
                            secondaryTypographyProps={{
                              style: { fontSize: 'small', textAlign: 'center', paddingTop: '5px' },
                            }}
                            primary={
                              <ListItemAvatar>
                                <Avatar
                                  className="w-25 h-25 m-auto"
                                  alt="contact avatar"
                                  src={person.avatar}
                                />
                              </ListItemAvatar>
                            }
                            secondary={person.per_firstName}
                          />
                        </ListItemButton>
                      </ListItem>
                    );
                  })
                : ''}
            </List>
          );
        },
        className: 'font-medium',
        sortable: true,
      },
      {
        id: 'action',
        width: 128,
        sortable: false,
        Cell: ({ row }) => (
          <div className="flex items-center">
            <IconButton
              onClick={(ev) => {
                ev.stopPropagation();
                dispatch(toggleStarredContact(row.original.id));
              }}
              size="large"
            >
              {user.starred && user.starred.includes(row.original.id) ? (
                <Icon className="text-yellow-700">star</Icon>
              ) : (
                <Icon>star_border</Icon>
              )}
            </IconButton>
            <IconButton
              onClick={(ev) => {
                ev.stopPropagation();
                dispatch(removeContact(row.original.id));
              }}
              size="large"
            >
              <Icon>delete</Icon>
            </IconButton>
          </div>
        ),
      },
    ],
    [dispatch, user.starred]
  );

  useEffect(() => {
    function getFilteredArray(entities, _searchText) {
      if (_searchText.length === 0) {
        return families;
      }
      return FuseUtils.filterArrayByString(families, _searchText);
    }

    if (families) {
      setFilteredData(getFilteredArray(families, searchText));
    }
  }, [families, searchText]);

  if (!filteredData) {
    return null;
  }

  if (filteredData.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="textSecondary" variant="h5">
          There are no contacts!
        </Typography>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      className="flex flex-auto w-full max-h-full"
    >
      <ContactsTable
        columns={columns}
        data={filteredData}
        onRowClick={(ev, row) => {
          if (row) {
            dispatch(openNewContactDialog(row.original));
          }
        }}
      />
    </motion.div>
  );
}

export default FamiliesList;
