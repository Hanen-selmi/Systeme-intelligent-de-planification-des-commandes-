// assets
import { IconRobot } from '@tabler/icons-react';

// constant
const icons = { IconRobot };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const Assistant = {
  id: 'chatbot',
  title: 'Chat Bot',
  type: 'group',
  children: [
    {
      id: 'chatbot',
      title: 'Assistant',
      type: 'item',
      url: '/chatbot',
      icon: icons.IconRobot,
      breadcrumbs: true,
    },
  ],
};

export default Assistant;
