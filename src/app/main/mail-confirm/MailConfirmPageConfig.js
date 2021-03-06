import { authRoles } from 'app/auth';
import { lazy } from 'react';

const MailConfirmPageConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.unverified,
  routes: [
    {
      path: '/mail-confirm',
      component: lazy(() => import('./MailConfirmPage')),
    },
  ],
};

export default MailConfirmPageConfig;
