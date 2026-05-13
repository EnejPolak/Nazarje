import { useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router';
import { LogOut, CalendarDays } from 'lucide-react';
import { useCrmAuth } from './auth-context';

export function AdminCrmLayout() {
  const { isAuthenticated, logout } = useCrmAuth();
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
    <div className="min-h-screen bg-[#EAF1EA]">
      <header className="border-b border-[#18201B]/10 bg-[#F7F4EE] sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/admin/crm" className="flex items-center gap-2 text-[#18201B] group">
            <span className="inline-flex size-9 items-center justify-center rounded-xl bg-[#2F5D46] text-white">
              <CalendarDays className="size-5" />
            </span>
            <span className="font-semibold tracking-tight group-hover:text-[#2F5D46] transition-colors">
              CRM dogodki
            </span>
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            <Link
              to="/admin/crm"
              className="hidden sm:inline-block rounded-lg px-3 py-1.5 text-[#18201B]/75 hover:bg-white hover:text-[#18201B] transition-colors"
            >
              Seznam
            </Link>
            <Link
              to="/"
              className="hidden sm:inline-block rounded-lg px-3 py-1.5 text-[#18201B]/75 hover:bg-white hover:text-[#18201B] transition-colors"
            >
              Javna stran
            </Link>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/admin', { replace: true });
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#18201B]/15 bg-white px-3 py-1.5 text-[#18201B] hover:bg-[#F7F4EE] transition-colors"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Odjava</span>
            </button>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
