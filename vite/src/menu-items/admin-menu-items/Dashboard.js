// assets
import { IconDashboard } from '@tabler/icons-react';

// constant
const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: 'Tableau de board',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Tableau de board',
      type: 'item',
      url: '/dashboard',
      icon: icons.IconDashboard,
      breadcrumbs: true
    }
  ]
};

export default dashboard;
