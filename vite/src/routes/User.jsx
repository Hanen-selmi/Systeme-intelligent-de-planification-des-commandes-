
// project imports

import MainLayout from 'layout/userLayout/MainLayout';

import RoleGuard from './AuthGuard';
import OrderForm from 'views/utilisateur/Passercommande';
import OrderStatus from 'views/utilisateur/Suivre_commande_user';
import ChatBot from 'views/chatbot/Chatbot';

// ==============================|| MAIN ROUTING ||============================== //

const UserRoutes= {
  path: '/',
  element:<RoleGuard roles={['user']}> <MainLayout /> </RoleGuard>,
  children: [
    {
      path: '/',
      element: ''
    },
    {
      path: '/',
      children: [
        {
          path: 'dashboard-user',
          element: ''
        }
      ]
    },
   
 {
      path: '/',
      children: [
        {
          path: 'passer_commande',
          element: <RoleGuard roles={['user']}> <OrderForm/></RoleGuard>
        }
      ]
    },
    {
      path: '/',
      children: [
        {
          path: 'vos_commandes',
          element: <RoleGuard roles={['user']}><OrderStatus/></RoleGuard>
        }
      ]
    },
    ,
    {
      path: '/',
      children: [
        {
          path: 'chatbotA',
          element: <ChatBot/> 
        }
      ]
    },

  
    
  ]
};

export default UserRoutes;