// assets
import {  IconClipboardList } from '@tabler/icons-react';

// constant
const icons = { IconClipboardList };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const Suivre_all = {
  id: 'Suivre_all',
  title: 'Commande',
  type: 'group',
  children: [
    
    {
      id: 'Suivre_all',
      title: 'Tous les commandes',
      type: 'item',
      url: '/all_commades',
      icon: icons.IconClipboardList,  // icône liste / commandes
      breadcrumbs: true
    }
  ]
};

export default Suivre_all;