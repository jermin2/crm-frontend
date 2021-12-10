import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setContactsUnstarred,
  setContactsStarred,
  removeContacts,
  setContactsTag,
  clearContactsTag,
} from './store/contactsSlice';

function ContactsMultiSelectMenu(props) {
  const dispatch = useDispatch();
  const user = useSelector(({ contactsApp }) => contactsApp.user);
  const { selectedContactIds } = props;

  const [anchorEl, setAnchorEl] = useState(null);

  function openSelectedContactMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  function closeSelectedContactsMenu() {
    setAnchorEl(null);
  }

  console.log(selectedContactIds);
  return (
    <>
      <IconButton
        className="p-0"
        aria-owns={anchorEl ? 'selectedContactsMenu' : null}
        aria-haspopup="true"
        onClick={openSelectedContactMenu}
        size="large"
      >
        <Icon>more_horiz</Icon>
      </IconButton>
      <Menu
        id="selectedContactsMenu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeSelectedContactsMenu}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              dispatch(removeContacts(selectedContactIds));
              closeSelectedContactsMenu();
            }}
          >
            <ListItemIcon className="min-w-40">
              <Icon>delete</Icon>
            </ListItemIcon>
            <ListItemText primary="Remove" />
          </MenuItem>

          {user.tags ? (
            user.tags.map((t, i) => {
              return (
                <MenuItem
                  onClick={() =>
                    dispatch(setContactsTag({ selectedIds: selectedContactIds, tag: t }))
                  }
                  key={t.tag_id}
                >
                  <ListItemIcon className="min-w-40">
                    <Icon key={t.tag_id} sx={{ color: t.color }} className="list-item-icon text-16">
                      radio_button_checked
                    </Icon>
                  </ListItemIcon>
                  <ListItemText primary={t.description} />
                </MenuItem>
              );
            })
          ) : (
            <></>
          )}

          <MenuItem
            onClick={() => dispatch(clearContactsTag({ selectedIds: selectedContactIds }))}
            key="tags-clear"
          >
            <ListItemIcon className="min-w-40">
              <Icon className="list-item-icon text-16">highlight_off</Icon>
            </ListItemIcon>
            <ListItemText primary="Clear Tags" />
          </MenuItem>

          <MenuItem
            onClick={() => {
              dispatch(setContactsStarred(selectedContactIds));
              closeSelectedContactsMenu();
            }}
          >
            <ListItemIcon className="min-w-40">
              <Icon>star</Icon>
            </ListItemIcon>
            <ListItemText primary="Starred" />
          </MenuItem>
          <MenuItem
            onClick={() => {
              dispatch(setContactsUnstarred(selectedContactIds));
              closeSelectedContactsMenu();
            }}
          >
            <ListItemIcon className="min-w-40">
              <Icon>star_border</Icon>
            </ListItemIcon>
            <ListItemText primary="Unstarred" />
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
}

export default ContactsMultiSelectMenu;
