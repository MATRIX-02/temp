import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  Folder,
  Files,
  File,
  FileEdit,
  UserCog,
  Shield,
  Database,
  LucideIcon

} from 'lucide-react';

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

type BaseMenuItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  active?: boolean;
};

// Recursive type for nested menus
export type MenuItem = BaseMenuItem & {
  children?: MenuItem[];
};

export type MenuGroup = {
  groupLabel: string;
  icon?: LucideIcon;  // Optional icon for group
  menus: MenuItem[];
};

export type MenuList = MenuGroup[];

export function getMenuList(pathname: string): MenuList {
  return [
    {
      groupLabel: '',
      menus: [
        {
          href: '/dashboard/overview',
          label: 'Dashboard',
          icon: LayoutGrid,
          active: pathname.includes('/dashboard'),
        }
      ]
    },
    {
      groupLabel: 'Workflow360',
      icon: Database,
      menus: [
        {
          href: '/sales',
          label: 'Sales Order Automation',
          icon: SquarePen,
          children: [
            {
              href: '#',
              label: 'Automation',
              icon: Files,
              children: [
                {
                  href: '/sales/automation/create',
                  label: 'Create New',
                  icon: FileEdit,
                },
                {
                  href: '/sales/automation/templates',
                  label: 'Templates',
                  icon: File,
                }
              ]
            },
            {
              href: '/sales/categories',
              label: 'Categories',
              icon: Folder
            }
          ]
        },
        {
          href: '/categories',
          label: 'Categories',
          icon: Bookmark,
          active: pathname.includes('/categories'),
        },
        {
          href: '/tags',
          label: 'Tags',
          icon: Tag,
          active: pathname.includes('/tags'),
        }
      ]
    },
    {
      groupLabel: 'Settings',
      icon: Settings,
      menus: [
        {
          href: '/users',
          label: 'Users',
          icon: Users,
          children: [
            {
              href: '/users/management',
              label: 'Management',
              icon: UserCog,
            },
            {
              href: '/users/roles',
              label: 'Roles',
              icon: Shield,
            }
          ]
        },
        {
          href: '/account',
          label: 'Account',
          icon: Settings,
          active: pathname.includes('/account'),
        }
      ]
    }
  ];
}
