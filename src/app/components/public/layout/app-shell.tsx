import { Outlet } from 'react-router';
import { CookieBanner } from '../legal/cookie-banner';
import { ScrollToTop } from './scroll-to-top';

/** Layout z router outletom; cookie banner mora biti znotraj RouterProvider. */
export function AppShell() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
      <CookieBanner />
    </>
  );
}
