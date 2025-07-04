import { lazy } from 'react';

// project imports

import MainLayout from 'layout/adminLayout/MainLayout';
import Loadable from 'ui-component/Loadable';
import RoleGuard from './AuthGuard';
import Commandes_all from 'views/admin/suivre_tous_commandes/Suivre_commandes';
import ChatBot from 'views/chatbot/Chatbot';

const Utilisateur = Loadable(lazy(() => import('views/admin/utilsateur/tout-utilisateur')));
const Gestionutilisateur = Loadable(lazy(() => import('views/admin/utilsateur/Gestion_utilisateur')));
const Gestionadmin = Loadable(lazy(() => import('views/admin/utilsateur/Gestion_admin')));
// ==============================|| MAIN ROUTING ||============================== //

const AdminRoutes = {
  path: '/',
  element:<RoleGuard roles={['admin']}><MainLayout /></RoleGuard>,
  children: [
    {
      path: '/',
      element: ''
    },
    {
      path: '/',
      children: [
        {
          path: 'dashboard',
          element: ''
        }
      ]
    },
   
    {
      path: '/',
      children: [
        {
          path: 'utilisateur',
          element:<RoleGuard roles={['admin']}><Utilisateur/></RoleGuard>
        }
      ]
    },
   
    {
      path: '/',
      children: [
        {
          path: 'gestion_utilisateur',
          element: <RoleGuard roles={['admin']}><  Gestionutilisateur/></RoleGuard>
        }
      ]
    }
    ,
    
    {
      path: '/',
      children: [
        {
          path: 'gestion_admin',
          element: <RoleGuard roles={['admin']}><Gestionadmin/></RoleGuard>
        }
      ]
    },
    ,
        {
          path: '/',
          children: [
            {
              path: 'all_commades',
              element:<RoleGuard roles={['admin']}><Commandes_all/></RoleGuard> 
            }
          ]
        },
        
        {
          path: '/',
          children: [
            {
              path: 'chatbot',
              element:<RoleGuard roles={['admin']}><ChatBot/></RoleGuard> 
            }
          ]
        },
    

   
  ]
};

export default AdminRoutes;
