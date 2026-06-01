import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { useCrmAuth } from './auth-context';
import { CrmHeader } from './CrmHeader';
import '../styles/components/crm-shell.css';

export function AdminCrmLayout() {
  const { isAuthenticated } = useCrmAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="crm-shell">
      <CrmHeader />
      <main className="crm-main">
        <Outlet />
      </main>
    </div>
  );
}
