import { DrawerShell } from 'even-toolkit/web';
import type { SideDrawerItem } from 'even-toolkit/web';

const MENU_ITEMS: SideDrawerItem[] = [
  { id: '/', label: 'Workouts', section: 'Training' },
  { id: '/history', label: 'History', section: 'Training' },
];

const BOTTOM_ITEMS: SideDrawerItem[] = [
  { id: '/settings', label: 'Settings', section: 'App' },
];

function getPageTitle(pathname: string): string {
  if (pathname === '/') return 'EvenWorkout';
  if (pathname === '/editor') return 'New Workout';
  if (pathname.startsWith('/editor/')) return 'Edit Workout';
  if (pathname.includes('/active')) return 'Active Workout';
  if (pathname.includes('/complete')) return 'Complete';
  if (pathname === '/history') return 'History';
  if (pathname.startsWith('/workout/')) return 'Workout';
  return 'Workout';
}

function deriveActiveId(pathname: string): string {
  if (pathname === '/') return '/';
  if (pathname.startsWith('/editor')) return '/editor';
  if (pathname === '/history') return '/history';
  if (pathname === '/settings') return '/settings';
  return '/';
}

function getBackPath(pathname: string): string {
  if (pathname.includes('/active')) {
    const id = pathname.split('/')[2];
    return `/workout/${id}`;
  }
  if (pathname.includes('/complete')) {
    return '/';
  }
  return '/';
}

export function Shell() {
  return (
    <DrawerShell
      items={MENU_ITEMS}
      bottomItems={BOTTOM_ITEMS}
      title="EvenWorkout"
      getPageTitle={getPageTitle}
      deriveActiveId={deriveActiveId}
      getBackPath={getBackPath}
    />
  );
}
