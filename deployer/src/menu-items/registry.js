// assets
import { IconDashboard } from '@tabler/icons';

// constant
const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const registry = {
  id: 'Registry',
  title: 'Registry',
  type: 'group',
  children: [
    {
      id: 'Registry',
      title: 'Registry',
      type: 'item',
      url: '/dashboard/registry',
      icon: icons.IconDashboard,
      breadcrumbs: false
    }
  ]
};

export default registry;
