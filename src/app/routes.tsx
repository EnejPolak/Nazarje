import { createBrowserRouter, Navigate } from 'react-router';
import { AppShell } from './components/public/layout/app-shell';
import { Home } from './pages/Home';
import { EventDetail } from './pages/EventDetail';
import { AllEvents } from './pages/AllEvents';
import { PastEvents } from './pages/PastEvents';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { CookiePolicy } from './pages/CookiePolicy';
import { AdminRoot } from './crm/AdminRoot';
import { AdminLogin } from './crm/AdminLogin';
import { AdminCrmLayout } from './crm/AdminCrmLayout';
import { CrmEventList } from './crm/CrmEventList';
import { CrmEventForm } from './crm/CrmEventForm';
import { CrmEventDetail } from './crm/CrmEventDetail';

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', Component: Home },
      { path: '/event/:id', Component: EventDetail },
      { path: '/events', Component: AllEvents },
      { path: '/past-events', Component: PastEvents },
      { path: '/zasebnost', Component: PrivacyPolicy },
      { path: '/piskotki', Component: CookiePolicy },
      {
        path: '/admin',
        Component: AdminRoot,
        children: [
          { index: true, Component: AdminLogin },
          { path: 'crm', element: <Navigate to="/admin/dashboard" replace /> },
          { path: 'crm/*', element: <Navigate to="/admin/dashboard" replace /> },
          {
            path: 'dashboard',
            Component: AdminCrmLayout,
            children: [
              { index: true, element: <Navigate to="nov" replace /> },
              { path: 'nov', Component: CrmEventForm },
              { path: 'stari', Component: CrmEventList },
              { path: 'objavljeni', Component: CrmEventList },
              {
                path: 'neobjabljeni',
                element: <Navigate to="/admin/dashboard/objavljeni" replace />,
              },
              { path: 'uredi/:id', Component: CrmEventForm },
              { path: 'dogodek/:id', Component: CrmEventDetail },
            ],
          },
        ],
      },
    ],
  },
]);
