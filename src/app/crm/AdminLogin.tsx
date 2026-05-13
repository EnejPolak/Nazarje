import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useCrmAuth } from './auth-context';

export function AdminLogin() {
  const { isAuthenticated, login } = useCrmAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/crm', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(false);
    if (login(email, password)) {
      navigate('/admin/crm', { replace: true });
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#18201B]/10 bg-white p-8 shadow-sm">
        <h1 className="text-2xl text-[#18201B] font-semibold mb-6">Prijava</h1>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="crm-email" className="block text-sm font-medium text-[#18201B] mb-1.5">
              E-pošta
            </label>
            <input
              id="crm-email"
              type="text"
              inputMode="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[#18201B]/20 bg-[#F7F4EE]/50 px-3 py-2.5 text-[#18201B] outline-none focus:ring-2 focus:ring-[#2F5D46]/40"
              placeholder="vas@email.si"
            />
          </div>
          <div>
            <label htmlFor="crm-password" className="block text-sm font-medium text-[#18201B] mb-1.5">
              Geslo
            </label>
            <input
              id="crm-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-[#18201B]/20 bg-[#F7F4EE]/50 px-3 py-2.5 text-[#18201B] outline-none focus:ring-2 focus:ring-[#2F5D46]/40"
              placeholder="Vnesi geslo"
            />
          </div>
          {error && <p className="text-sm text-red-700">Napačen e-naslov ali geslo.</p>}
          <button
            type="submit"
            className="w-full rounded-lg bg-[#2F5D46] py-2.5 text-white font-medium hover:bg-[#1E3A2F] transition-colors"
          >
            Prijava
          </button>
        </form>
        <p className="mt-4 text-xs text-[#18201B]/50">
          Za test: <span className="font-mono">test@test</span> / <span className="font-mono">test12345</span>
        </p>
      </div>
      <a href="/" className="mt-8 text-sm text-[#2F5D46] hover:underline">
        ← Nazaj na stran občine
      </a>
    </div>
  );
}
