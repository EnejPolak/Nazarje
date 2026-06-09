import { Link } from 'react-router';
import { useCookieConsentContext } from '../../../context/cookie-consent-context';
import '../../../styles/components/cookie-banner.css';

export function CookieBanner() {
  const { bannerOpen, acceptNecessary, acceptAll } = useCookieConsentContext();

  if (!bannerOpen) return null;

  return (
    <div
      className="cookie-banner"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
    >
      <div className="cookie-banner__inner">
        <div className="cookie-banner__copy">
          <h2 id="cookie-banner-title" className="cookie-banner__title">
            Piškotki
          </h2>
          <p id="cookie-banner-desc" className="cookie-banner__text">
            Uporabljamo nujne piškotke za delovanje strani. Z vašim soglasjem lahko v prihodnosti
            vključimo tudi analitične piškotke. Več v{' '}
            <Link to="/piskotki" className="cookie-banner__link">
              politiki piškotkov
            </Link>{' '}
            in{' '}
            <Link to="/zasebnost" className="cookie-banner__link">
              politiki zasebnosti
            </Link>
            .
          </p>
        </div>
        <div className="cookie-banner__actions">
          <button type="button" className="cookie-banner__btn" onClick={acceptNecessary}>
            Samo nujni
          </button>
          <button
            type="button"
            className="cookie-banner__btn cookie-banner__btn--primary"
            onClick={acceptAll}
          >
            Sprejmi vse
          </button>
        </div>
      </div>
    </div>
  );
}
