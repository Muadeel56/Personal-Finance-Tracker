import {
  Squares2X2Icon,
  ArrowsRightLeftIcon,
  ClockIcon,
  Bars3Icon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

export const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', path: '/dashboard', Icon: Squares2X2Icon },
    ],
  },
  {
    label: 'Finance',
    items: [
      { name: 'Transactions', path: '/transactions', Icon: ArrowsRightLeftIcon },
      { name: 'Budget', path: '/budget', Icon: ClockIcon },
      { name: 'Categories', path: '/categories', Icon: Bars3Icon },
      { name: 'Reports', path: '/reports', Icon: ChartBarIcon },
    ],
  },
  {
    label: 'Account',
    items: [
      { name: 'Settings', path: '/settings', Icon: Cog6ToothIcon },
      { name: 'Profile', path: '/profile', Icon: UserCircleIcon },
    ],
  },
];

export const MOBILE_NAV = [
  { name: 'Home', path: '/dashboard', Icon: Squares2X2Icon },
  { name: 'Txns', path: '/transactions', Icon: ArrowsRightLeftIcon },
  { name: 'Budget', path: '/budget', Icon: ClockIcon },
  { name: 'Reports', path: '/reports', Icon: ChartBarIcon },
];
