import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import nazarjeGrb from 'figma:asset/2e8f7a543b609ec574e73e03452550de1d5e4577.png';
import { useCrmAuth } from './auth-context';
import '../styles/components/admin-login.css';

type FieldErrors = {
  email?: string;
  password?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateFields(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    errors.email = 'E-poštni naslov je obvezen.';
  } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
    errors.email = 'Vnesite veljaven e-poštni naslov.';
  }

  if (!password) {
    errors.password = 'Geslo je obvezno.';
  }

  return errors;
}

export function AdminLogin() {
  const { isAuthenticated, login } = useCrmAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  const showEmailError = Boolean(fieldErrors.email && (submitAttempted || email.length > 0));
  const showPasswordError = Boolean(
    fieldErrors.password && (submitAttempted || password.length > 0)
  );

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setFormError(null);

    const errors = validateFields(email, password);
    setFieldErrors(errors);
    if (errors.email || errors.password) {
      return;
    }

    setSubmitting(true);
    const result = await login(email.trim(), password);
    setSubmitting(false);

    if (result.ok) {
      navigate('/admin/dashboard', { replace: true });
    } else {
      setFormError(result.error ?? 'Napačen e-poštni naslov ali geslo.');
    }
  };

  const onEmailChange = (value: string) => {
    setEmail(value);
    setFormError(null);
    if (fieldErrors.email) {
      setFieldErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const onPasswordChange = (value: string) => {
    setPassword(value);
    setFormError(null);
    if (fieldErrors.password) {
      setFieldErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <header className="admin-login__brand">
          <img src={nazarjeGrb} alt="Grb občine Nazarje" className="admin-login__grb" />
          <p className="admin-login__title">Prijava</p>
          <p className="admin-login__subtitle">Upravljanje dogodkov</p>
        </header>

        <form onSubmit={onSubmit} className="admin-login__form" noValidate>
          <div className="admin-login__field">
            <label htmlFor="crm-email" className="admin-login__label">
              E-pošta <span className="admin-login__label-required">*</span>
            </label>
            <input
              id="crm-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              className={`admin-login__input${showEmailError ? ' admin-login__input--error' : ''}`}
              placeholder="vas@email.si"
              aria-invalid={showEmailError}
              aria-describedby={showEmailError ? 'crm-email-error' : undefined}
            />
            {showEmailError && fieldErrors.email && (
              <p id="crm-email-error" className="admin-login__field-error" role="alert">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div className="admin-login__field">
            <label htmlFor="crm-password" className="admin-login__label">
              Geslo <span className="admin-login__label-required">*</span>
            </label>
            <div className="admin-login__password-wrap">
              <input
                id="crm-password"
                name="password"
                type={passwordVisible ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                className={`admin-login__input admin-login__input--password${showPasswordError ? ' admin-login__input--error' : ''}`}
                placeholder="Vnesite geslo"
                aria-invalid={showPasswordError}
                aria-describedby={showPasswordError ? 'crm-password-error' : undefined}
              />
              <button
                type="button"
                className="admin-login__password-toggle"
                onClick={() => setPasswordVisible((v) => !v)}
                aria-label={passwordVisible ? 'Skrij geslo' : 'Prikaži geslo'}
                aria-pressed={passwordVisible}
              >
                {passwordVisible ? (
                  <EyeOff className="admin-login__password-toggle-icon" aria-hidden />
                ) : (
                  <Eye className="admin-login__password-toggle-icon" aria-hidden />
                )}
              </button>
            </div>
            {showPasswordError && fieldErrors.password && (
              <p id="crm-password-error" className="admin-login__field-error" role="alert">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {formError && (
            <div className="admin-login__alert" role="alert" aria-live="polite">
              <AlertCircle className="admin-login__alert-icon" aria-hidden />
              <p className="admin-login__alert-text">{formError}</p>
            </div>
          )}

          <button type="submit" disabled={submitting} className="admin-login__submit">
            {submitting ? 'Prijava…' : 'Prijava'}
          </button>
        </form>
      </div>

      <a href="/" className="admin-login__back">
        ← Nazaj na domačo stran
      </a>
    </div>
  );
}
