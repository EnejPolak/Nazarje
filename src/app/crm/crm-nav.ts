import type { LucideIcon } from 'lucide-react';
import { Archive, Globe, History, Plus, PlusCircle } from 'lucide-react';

export const CRM_LAST_LIST_KEY = 'crm_last_list';

export type CrmListPath = '/admin/dashboard/stari' | '/admin/dashboard/objavljeni';

export type CrmNavItem = {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  iconActive: LucideIcon;
  isActive: (pathname: string) => boolean;
};

export const CRM_NAV_ITEMS: CrmNavItem[] = [
  {
    id: 'create',
    label: 'Ustvari dogodek',
    path: '/admin/dashboard/nov',
    icon: Plus,
    iconActive: PlusCircle,
    isActive: (pathname) => pathname.includes('/nov') || pathname.includes('/uredi/'),
  },
  {
    id: 'past',
    label: 'Stari dogodki',
    path: '/admin/dashboard/stari',
    icon: History,
    iconActive: Archive,
    isActive: (pathname) => pathname.includes('/stari'),
  },
  {
    id: 'published',
    label: 'Objavljeni dogodki',
    path: '/admin/dashboard/objavljeni',
    icon: Globe,
    iconActive: Globe,
    isActive: (pathname) => pathname.includes('/objavljeni'),
  },
];

export function getActiveNavItem(pathname: string): CrmNavItem | undefined {
  return CRM_NAV_ITEMS.find((item) => item.isActive(pathname));
}

export function getActiveNavLabel(pathname: string): string {
  return getActiveNavItem(pathname)?.label ?? 'Dogodki';
}

export function saveLastListPath(path: CrmListPath) {
  try {
    sessionStorage.setItem(CRM_LAST_LIST_KEY, path);
  } catch {
    /* ignore */
  }
}

export function getLastListPath(): CrmListPath {
  try {
    const stored = sessionStorage.getItem(CRM_LAST_LIST_KEY);
    if (stored === '/admin/dashboard/objavljeni') {
      return '/admin/dashboard/objavljeni';
    }
    if (stored === '/admin/dashboard/neobjavljeni') {
      return '/admin/dashboard/objavljeni';
    }
  } catch {
    /* ignore */
  }
  return '/admin/dashboard/stari';
}

export type CrmBackState = { from?: CrmListPath };
