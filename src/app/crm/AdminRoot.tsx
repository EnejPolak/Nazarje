import { Outlet } from 'react-router';
import { CrmAuthProvider } from './auth-context';
import { usePageMeta } from '../hooks/use-page-meta';

export function AdminRoot() {
  usePageMeta({ title: 'Administracija · Nazarje Dogodki', noindex: true });

  return (
    <CrmAuthProvider>
      <Outlet />
    </CrmAuthProvider>
  );
}
