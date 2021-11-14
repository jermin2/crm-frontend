import { Redirect } from 'react-router-dom';
import FuseUtils from '@fuse/utils';
import appsConfigs from 'app/main/apps/appsConfigs';
import ExampleConfig from 'app/main/example/ExampleConfig';
import FuseLoading from '@fuse/core/FuseLoading';
import Error404Page from 'app/main/404/Error404Page';
import LoginConfig from 'app/main/login/LoginConfig';
import LogoutConfig from 'app/main/logout/LogoutConfig';
import ForgotPasswordConfig from 'app/main/auth/forgot-password/ForgotPasswordConfig';
import ResetPasswordConfig from 'app/main/auth/reset-password/ResetPasswordConfig';
import RegisterConfig from 'app/main/register/RegisterConfig';
import MailConfirmPageConfig from 'app/main/mail-confirm/MailConfirmPageConfig';

const routeConfigs = [
  ...appsConfigs,
  ExampleConfig,
  LoginConfig,
  LogoutConfig,
  RegisterConfig,
  MailConfirmPageConfig,
  ForgotPasswordConfig,
  ResetPasswordConfig,
];

const routes = [
  // if you want to make whole app auth protected by default change defaultAuth for example:
  // ...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['admin','staff','user']),
  // The individual route configs which has auth option won't be overridden.
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs, null),
  {
    exact: true,
    path: '/',
    component: () => <Redirect to="/example" />,
  },
  {
    path: '/loading',
    exact: true,
    component: () => <FuseLoading />,
  },
  {
    path: '/404',
    component: () => <Error404Page />,
  },
  {
    component: () => <Redirect to="/404" />,
  },
];

export default routes;
