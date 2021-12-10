import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Icon from '@mui/material/Icon';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import {
  openNewContactDialog,
  setContactsFilterTags,
  openTagDialog,
  newTagDialog,
} from './store/contactsSlice';

const StyledListItem = styled(ListItem)(({ theme }) => ({
  color: 'inherit!important',
  textDecoration: 'none!important',
  height: 40,
  width: '100%',
  borderRadius: 6,
  paddingLeft: 12,
  paddingRight: 12,
  marginBottom: 4,
  '&.active': {
    backgroundColor:
      theme.palette.mode === 'light'
        ? 'rgba(0, 0, 0, .05)!important'
        : 'rgba(255, 255, 255, .1)!important',
    pointerEvents: 'none',
    '& .list-item-icon': {
      color: 'inherit',
    },
  },
  '& .list-item-icon': {
    fontSize: 16,
    width: 16,
    height: 16,
    marginRight: 16,
  },
}));

function ContactsSidebarContent(props) {
  const user = useSelector(({ contactsApp }) => contactsApp.user);
  const tagFilters = useSelector(({ contactsApp }) => contactsApp.contacts.filterTags);
  const dispatch = useDispatch();

  return (
    <div className="p-0 lg:p-24 lg:ltr:pr-4 lg:rtl:pl-4">
      <Paper
        component={motion.div}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
        className="rounded-0 shadow-none lg:rounded-16 lg:shadow"
      >
        <div className="p-24 flex items-center">
          <Avatar alt={user.name} src={user.avatar} />
          <Typography className="mx-12">{user.name}</Typography>
        </div>

        <Divider />

        <div className="p-24">
          <Button
            variant="contained"
            color="secondary"
            className="w-full"
            onClick={(ev) => dispatch(openNewContactDialog())}
          >
            New Contact
          </Button>
        </div>

        <List className="pt-0 px-12">
          <StyledListItem
            button
            component={NavLinkAdapter}
            to="/apps/contacts/all"
            activeClassName="active"
          >
            <Icon className="list-item-icon text-16" color="action">
              people
            </Icon>
            <ListItemText className="truncate" primary="Person View" disableTypography />
          </StyledListItem>

          <StyledListItem
            button
            component={NavLinkAdapter}
            to="/apps/families/all"
            activeClassName="active"
          >
            <Icon className="list-item-icon text-16" color="action">
              people
            </Icon>
            <ListItemText className="truncate" primary="Family View" disableTypography />
          </StyledListItem>

          {user.tags ? (
            user.tags.map((t, i) => {
              return (
                <StyledListItem
                  button
                  onClick={() => dispatch(setContactsFilterTags(t.tag_id))}
                  key={t.tag_id}
                >
                  <Icon key={t.tag_id} sx={{ color: t.color }} className="list-item-icon text-16">
                    {tagFilters.includes(t.tag_id)
                      ? 'radio_button_checked'
                      : 'radio_button_unchecked'}
                  </Icon>
                  <ListItemText className="truncate" primary={t.description} disableTypography />
                  <Icon
                    onClick={(ev) => {
                      dispatch(openTagDialog(t));
                      ev.stopPropagation();
                    }}
                  >
                    edit
                  </Icon>
                </StyledListItem>
              );
            })
          ) : (
            <></>
          )}

          {user.tags && user.tags.length < 4 ? 
          <StyledListItem button onClick={() => dispatch(newTagDialog())}>
            <Icon className="list-item-icon text-16" color="action">
              add
            </Icon>
            <ListItemText className="truncate" primary="Add Tag" disableTypography />
          </StyledListItem>
          : <></>}
        </List>
      </Paper>
    </div>
  );
}

export default ContactsSidebarContent;
