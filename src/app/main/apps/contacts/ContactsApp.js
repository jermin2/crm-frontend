import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import { styled } from '@mui/material/styles';
import ContactDialog from './ContactDialog';
import QuickContactDialog from './QuickContactDialog';
import FamilyDialog from './FamilyDialog';
import ContactsHeader from './ContactsHeader';
import FamiliesList from './FamiliesList';
import ContactsList from './ContactsList';
import ContactsSidebarContent from './ContactsSidebarContent';
import reducer from './store';
import { getContacts } from './store/contactsSlice';
import { getFamilies, getRoles } from './store/familiesSlice';
import { getUserData } from './store/userSlice';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    minHeight: 72,
    height: 72,
  },
  '& .FusePageSimple-wrapper': {
    minHeight: 0,
  },
  '& .FusePageSimple-contentWrapper': {
    padding: 0,
    [theme.breakpoints.up('sm')]: {
      padding: 24,
      height: '100%',
    },
  },
  '& .FusePageSimple-content': {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  '& .FusePageSimple-sidebar': {
    width: 256,
    border: 0,
  },
}));

function ContactsApp(props) {
  const dispatch = useDispatch();
  const {
    match: { path },
  } = props;

  const pageLayout = useRef(null);
  const routeParams = useParams();

  useDeepCompareEffect(() => {
    dispatch(getContacts(routeParams));
    dispatch(getFamilies(routeParams));
    dispatch(getUserData());
    dispatch(getRoles());
  }, [dispatch, routeParams]);

  return (
    <>
      <Root
        header={<ContactsHeader pageLayout={pageLayout} />}
        content={path.startsWith('/apps/families') ? <FamiliesList /> : <ContactsList />}
        leftSidebarContent={<ContactsSidebarContent />}
        sidebarInner
        ref={pageLayout}
        innerScroll
      />
      <ContactDialog />
      <QuickContactDialog />
      <FamilyDialog />
    </>
  );
}

export default withReducer('contactsApp', reducer)(ContactsApp);
