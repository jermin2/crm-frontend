import { authRoles } from 'app/auth';
import { lazy } from 'react';
import { Redirect } from 'react-router-dom';

const ContactsAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.staff,
  routes: [
    {
      path: '/apps/contacts/tag/:id',
      component: lazy(() => import('./ContactsApp')),
    },
    {
      path: '/apps/contacts/:id',
      component: lazy(() => import('./ContactsApp')),
    },
    {
      path: '/apps/contacts',
      component: () => <Redirect to="/apps/contacts/all" />,
    },
    {
      path: '/apps/families/:id',
      component: lazy(() => import('./ContactsApp')),
    },
    {
      path: '/apps/families',
      component: () => <Redirect to="/apps/families/all" />,
    },
  ],
};

export default ContactsAppConfig;
