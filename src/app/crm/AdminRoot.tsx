import { Outlet } from 'react-router';
import { CrmAuthProvider } from './auth-context';

export function AdminRoot() {
  return (
    <CrmAuthProvider>
      <Outlet />
    </CrmAuthProvider>
  );
}
