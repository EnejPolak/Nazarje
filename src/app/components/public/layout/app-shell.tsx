import { Outlet } from 'react-router';
import { CookieBanner } from '../legal/cookie-banner';

/** Layout z router outletom; cookie banner mora biti znotraj RouterProvider. */
export function AppShell() {
  return (
    <>
      <Outlet />
      <CookieBanner />
    </>
  );
}
