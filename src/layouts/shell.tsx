import { DrawerShell } from 'even-toolkit/web';
import type { SideDrawerItem } from 'even-toolkit/web';
import { IcMenuHome, IcEditChecklist, IcEditSettings, IcFeatCalendar } from 'even-toolkit/web/icons/svg-icons';
import { useTranslation } from '../hooks/useTranslation';

const iconProps = { width: 18, height: 18, className: 'text-current' };

function deriveActiveId(pathname: string): string {
  if (pathname === '/') return '/';
  if (pathname.startsWith('/editor')) return '/editor';
  if (pathname === '/calendar') return '/calendar';
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
  const { t } = useTranslation();

  const menuItems: SideDrawerItem[] = [
    { id: '/', label: t('nav.workouts'), section: t('nav.training'), icon: <IcMenuHome {...iconProps} /> },
    { id: '/calendar', label: t('calendar.title'), section: t('nav.training'), icon: <IcFeatCalendar {...iconProps} /> },
    { id: '/history', label: t('nav.history'), section: t('nav.training'), icon: <IcEditChecklist {...iconProps} /> },
  ];

  const bottomItems: SideDrawerItem[] = [
    { id: '/settings', label: t('settings.title'), icon: <IcEditSettings {...iconProps} /> },
  ];

  const getPageTitle = (pathname: string): string => {
    if (pathname === '/') return 'ER Workout';
    if (pathname === '/editor') return t('editor.newWorkout');
    if (pathname.startsWith('/editor/')) return t('editor.editWorkout');
    if (pathname.includes('/active')) return t('active.title');
    if (pathname.includes('/complete')) return t('complete.workoutComplete');
    if (pathname === '/calendar') return t('calendar.title');
    if (pathname === '/history') return t('history.title');
    if (pathname.startsWith('/workout/')) return t('editor.workout');
    return t('editor.workout');
  };

  return (
    <DrawerShell
      items={menuItems}
      bottomItems={bottomItems}
      title="ER Workout"
      getPageTitle={getPageTitle}
      deriveActiveId={deriveActiveId}
      getBackPath={getBackPath}
    />
  );
}
