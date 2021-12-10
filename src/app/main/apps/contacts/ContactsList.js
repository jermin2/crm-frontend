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
import DeleteButton from './ConfirmDelete';
import {
  openQuickContactDialog,
  removeContact,
  toggleStarredContact,
  selectContacts,
} from './store/contactsSlice';

function ContactsList(props) {
  const dispatch = useDispatch();
  const contacts = useSelector(selectContacts);
  const contactListDisplay = useSelector(({ contactsApp }) => contactsApp.display.contactList);
  const searchText = useSelector(({ contactsApp }) => contactsApp.contacts.searchText);
  const filterTags = useSelector(({ contactsApp }) => contactsApp.contacts.filterTags);
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
        accessor: 'per_avatar',
        Cell: ({ row }) => {
          return <Avatar className="mx-8" alt={row.original.name} src={row.original.per_avatar} />;
        },
        className: 'justify-center',
        width: 64,
        sortable: false,
      },
      {
        Header: 'First Name',
        accessor: 'per_firstName',
        className: 'font-medium',
        sortable: true,
      },
      {
        Header: 'Last Name',
        accessor: 'per_lastName',
        className: 'font-medium',
        sortable: true,
      },
      {
        Header: 'Age Group',
        accessor: 'ageGroup',
        className: 'font-medium',
        sortable: true,
      },
      {
        id: 'tags',
        width: 128,
        Header: 'Tags',
        accessor: 'tags',
        sortable: true,
        Cell: ({ row }) => (
          <div className="flex items-center">
            {row.original.tags.map((t, i) => {
              return (
                <Icon key={t.tag_id} sx={{ color: t.color }} className="text-700">
                  radio_button_checked
                </Icon>
              );
            })}
          </div>
        ),
      },
      {
        id: 'action',
        width: 128,
        sortable: false,
        Cell: ({ row }) => (
          <div className="flex items-center">
            <DeleteButton
              dispatch={dispatch}
              message="This will delete this person permanently and cannot be undone"
              agreeAction={() => dispatch(removeContact(row.original.id))}
            />
          </div>
        ),
      },
    ],
    [dispatch, user.starred]
  );

  useEffect(() => {
    function getFilteredArray(entities, _searchText) {
      if (_searchText.length === 0) {
        return contacts;
      }
      return FuseUtils.filterArrayByString(contacts, _searchText);
    }

    if (contacts) {
      setFilteredData(getFilteredArray(contacts, searchText));
    }
  }, [contacts, searchText]);

  useEffect(() => {
    function getFilteredArray(entities, _filterTags) {
      if (_filterTags.length === 0) {
        return contacts;
      }
      // Filter contact list by tags
      return contacts.filter((c) => {
        return c.tags.some((t) => {
          return filterTags.some((ft) => ft === t.tag_id);
        });
      });
    }

    if (contacts) {
      setFilteredData(getFilteredArray(contacts, filterTags));
    }
  }, [contacts, filterTags]);

  if (contactListDisplay.props.display === false) return null;

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

  console.log('user', user);

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
            dispatch(openQuickContactDialog(row.original));
          }
        }}
      />
    </motion.div>
  );
}

export default ContactsList;
