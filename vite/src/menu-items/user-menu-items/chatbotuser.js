import { IconRobot } from '@tabler/icons-react';

const icons = { IconRobot };

const Assistant_user = {
  id: 'chatbott',
  title: 'Chat Bot',
  type: 'group',
  children: [
    {
      id: 'chatbott',
      title: 'Assistant',
      type: 'item',
      url: '/chatbotA',
      icon: icons.IconRobot,
      breadcrumbs: true
    }
  ]
};

export default Assistant_user;
