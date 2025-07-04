import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';


// login option 3 routing
const AuthLogin3 = Loadable(lazy(() => import('views/authentication/authentication3/Login3')));
const AuthRegister3 = Loadable(lazy(() => import('views/authentication/authentication3/Register3')));
const ChangePassword = Loadable(lazy(() => import('views/authentication/authentication/auth-forms/authChnagePassword')));
const RequestResetPassword = Loadable(lazy(() => import('views/authentication/authentication/auth-forms/authRestPassword')));
// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '',
  element:"",
  children: [
    {
      path: '/auth/login',
      element: <AuthLogin3 />
    },
    {
      path: '/auth/register',
      element: <AuthRegister3 />
    },
    {
      path: '/auth/rest',
      element: <RequestResetPassword />
    },
    ,
    {
      path: '/auth/changepassword',
      element: <ChangePassword />
    },
  ]
};

export default AuthenticationRoutes;
