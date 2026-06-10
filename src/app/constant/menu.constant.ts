import { MenuItem } from '../core/class/menu.class';

export const DUMMY_MENUS: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'layout-dashboard',
    url: '/dashboard',
  },
  {
    title: 'System',
    icon: 'settings',
    children: [
      {
        title: 'User Management',
        icon: 'users',
        url: '/master/users',
      },
      {
        title: 'Role Management',
        icon: 'shield',
        url: '/master/roles',
      },
      {
        title: 'Role Authorization',
        icon: 'shield-user',
        url: '/master/rolemenu',
      },
      {
        title: 'Department Management',
        icon: 'building',
        url: '/master/departments',
      },
      {
        title: 'Menu Management',
        icon: 'menu',
        url: '/master/menus',
      },
    ],
  },
  {
    title: 'NCR',
    icon: 'replace-all',
    children: [
      {
        title: 'Create NCR',
        icon: 'file-plus',
        url: '/ncr/create',
      },
      {
        title: 'New Change Request',
        icon: 'list',
        url: '/ncr/list',
      },
      {
        title: 'Approval NCR',
        icon: 'signature',
        url: '/ncr/approval',
      },
      {
        title: 'Matrix Approval',
        icon: 'badge-check',
        url: '/ncr/matrix',
      },
      {
        title: 'Minutes Of Meeting',
        icon: 'notebook-pen',
        url: '/ncr/mom',
      },
      {
        title: 'User Acceptance Testing',
        icon: 'bug-play',
        url: 'ncr/uat',
      },
    ],
  },
  {
    title: 'Reports',
    icon: 'book-marked',
    url: '/reports',
  },
];
