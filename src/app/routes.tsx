import { createBrowserRouter, Navigate } from 'react-router';
import { Home } from './pages/Home';
import { EventDetail } from './pages/EventDetail';
import { AllEvents } from './pages/AllEvents';
import { PastEvents } from './pages/PastEvents';
import { AdminRoot } from './crm/AdminRoot';
import { AdminLogin } from './crm/AdminLogin';
import { AdminCrmLayout } from './crm/AdminCrmLayout';
import { CrmEventList } from './crm/CrmEventList';
import { CrmEventForm } from './crm/CrmEventForm';
import { CrmEventDetail } from './crm/CrmEventDetail';

export const router = createBrowserRouter([
  { path: '/', Component: Home },
  { path: '/event/:id', Component: EventDetail },
  { path: '/events', Component: AllEvents },
  { path: '/past-events', Component: PastEvents },
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
            path: 'neobjavljeni',
            element: <Navigate to="/admin/dashboard/objavljeni" replace />,
          },
          { path: 'uredi/:id', Component: CrmEventForm },
          { path: 'dogodek/:id', Component: CrmEventDetail },
        ],
      },
    ],
  },
]);
