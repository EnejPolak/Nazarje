import { RouterProvider } from 'react-router';
import { CookieConsentProvider } from './context/cookie-consent-context';
import { router } from './routes';

export default function App() {
  return (
    <CookieConsentProvider>
      <RouterProvider router={router} />
    </CookieConsentProvider>
  );
}
