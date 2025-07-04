// assets
import { IconShoppingCart, IconClipboardList } from '@tabler/icons-react';

// constant
const icons = { IconShoppingCart, IconClipboardList };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const passercommande = {
  id: 'passercommande',
  title: 'Commande',
  type: 'group',
  children: [
    {
      id: 'passercommande',
      title: 'Passer commande',
      type: 'item',
      url: '/passer_commande',
      icon: icons.IconShoppingCart,   // icône panier
      
    },
    {
      id: 'Vos_commandes',
      title: 'Vos commandes',
      type: 'item',
      url: '/vos_commandes',
      icon: icons.IconClipboardList,  // icône liste / commandes
    
    }
  ]
};

export default passercommande;
