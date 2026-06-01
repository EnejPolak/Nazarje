import { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { ChevronDown, LogOut, User } from 'lucide-react';
import nazarjeGrb from 'figma:asset/2e8f7a543b609ec574e73e03452550de1d5e4577.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { useCrmAuth } from './auth-context';
import {
  CRM_NAV_ITEMS,
  getActiveNavItem,
  getActiveNavLabel,
  saveLastListPath,
  type CrmListPath,
} from './crm-nav';

const USER_MENU_CLOSE_MS = 120;

export function CrmHeader() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useCrmAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openUserMenu = () => {
    if (userMenuCloseTimer.current) {
      clearTimeout(userMenuCloseTimer.current);
      userMenuCloseTimer.current = null;
    }
    setUserMenuOpen(true);
  };

  const scheduleCloseUserMenu = () => {
    if (userMenuCloseTimer.current) clearTimeout(userMenuCloseTimer.current);
    userMenuCloseTimer.current = setTimeout(() => setUserMenuOpen(false), USER_MENU_CLOSE_MS);
  };

  const handleLogout = () => {
    setUserMenuOpen(false);
    logout();
    navigate('/admin', { replace: true });
  };
  const activeItem = getActiveNavItem(pathname);
  const activeLabel = getActiveNavLabel(pathname);
  const TriggerIcon = activeItem
    ? activeItem.isActive(pathname)
      ? activeItem.iconActive
      : activeItem.icon
    : CRM_NAV_ITEMS[0].icon;

  const onNav = (path: string) => {
    if (path === '/admin/dashboard/stari' || path === '/admin/dashboard/objavljeni') {
      saveLastListPath(path as CrmListPath);
    }
    navigate(path);
  };

  return (
    <header className="crm-header">
      <div className="crm-header__inner">
        <div className="crm-header__left">
          <DropdownMenu>
            <DropdownMenuTrigger className="crm-nav-trigger" aria-label="Meni dogodkov">
              <span className="crm-nav-trigger__icon-wrap" aria-hidden>
                <TriggerIcon className="crm-nav-trigger__icon" />
              </span>
              <span className="crm-nav-trigger__text">
                <span className="crm-nav-trigger__label">Dogodki</span>
                <span className="crm-nav-trigger__value">{activeLabel}</span>
              </span>
              <ChevronDown className="crm-nav-trigger__chevron" aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="crm-nav-menu">
              <DropdownMenuLabel className="crm-nav-menu__heading">Navigacija</DropdownMenuLabel>
              <DropdownMenuSeparator className="crm-nav-menu__sep" />
              {CRM_NAV_ITEMS.map((item) => {
                const active = item.isActive(pathname);
                const ItemIcon = active ? item.iconActive : item.icon;
                return (
                  <DropdownMenuItem
                    key={item.id}
                    className={`crm-nav-menu__item${active ? ' crm-nav-menu__item--active' : ''}`}
                    onSelect={() => onNav(item.path)}
                  >
                    <span
                      className={`crm-nav-menu__icon-wrap crm-nav-menu__icon-wrap--${item.id}${active ? ' crm-nav-menu__icon-wrap--active' : ''}`}
                    >
                      <ItemIcon className="crm-nav-menu__icon" aria-hidden />
                    </span>
                    <span className="crm-nav-menu__label">{item.label}</span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="crm-header__center">
          <Link to="/admin/dashboard/nov" className="crm-header__brand">
            <img src={nazarjeGrb} alt="" className="crm-header__grb" />
            <div className="crm-header__brand-text">
              <span className="crm-header__brand-title">CRM Nazarje</span>
              <span className="crm-header__brand-sub">Dogodki</span>
            </div>
          </Link>
        </div>

        <div className="crm-header__right">
          <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen} modal={false}>
            <DropdownMenuTrigger
              className="crm-user__trigger"
              aria-label={user?.name ? `Uporabnik ${user.name}` : 'Uporabniški meni'}
              onPointerEnter={openUserMenu}
              onPointerLeave={scheduleCloseUserMenu}
            >
              <span className="crm-user__avatar" aria-hidden>
                <User className="crm-user__avatar-icon" />
              </span>
              <span className="crm-user__name">{user?.name ?? user?.email ?? 'Admin'}</span>
              <ChevronDown className="crm-user__chevron" aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="crm-user-menu"
              onPointerEnter={openUserMenu}
              onPointerLeave={scheduleCloseUserMenu}
            >
              {user?.email && (
                <>
                  <DropdownMenuLabel className="crm-user-menu__email">{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator className="crm-nav-menu__sep" />
                </>
              )}
              <DropdownMenuItem
                className="crm-user-menu__item crm-user-menu__item--logout"
                onSelect={handleLogout}
              >
                <LogOut className="crm-user-menu__icon" aria-hidden />
                Odjava
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
