// assets
import {
  IconUserPlus,
  IconUsers,
  IconBox,
  IconClipboard,
  IconUserShield,     // Pour les admins
  IconUserCog,        // Pour gestion utilisateurs (config)
  IconUserCheck       // Pour liste des utilisateurs validés
} from '@tabler/icons-react';

// constant
const icons = {
  IconUserPlus,
  IconUsers,
  IconBox,
  IconClipboard,
  IconUserShield,
  IconUserCog,
  IconUserCheck
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const Users = {
  
  id: 'utilisateurs',
  title: 'Gestion utilisateurs',
  caption: '',
  type: 'group',
  children: [
    {
      id: 'authentication',
      title: 'Gestion utilisateurs',
      type: 'collapse',
      icon: icons.IconUsers,

      children: [
        {
          id: 'gestion-utilisateur',
          title: "Liste des Utilisateurs",
          type: 'item',
          url: '/utilisateur',
          icon: icons.IconUserCheck // Icône spécifique pour la liste
        },
        {
          id: 'admin',
          title: "Gestion des Admin",
          type: 'item',
          url: '/gestion_admin',
          icon: icons.IconUserShield // Icône pour les admins
        },
        {
          id: 'gestion_utlisateur',
          title: "Gestion des Utilisateurs",
          type: 'item',
          url: '/gestion_utilisateur',
          icon: icons.IconUserCog // Icône pour paramétrage utilisateur
        }
      ]
    }
  ]
};

export default Users;
