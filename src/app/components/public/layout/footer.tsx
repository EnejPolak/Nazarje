import { Link } from 'react-router';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useNewsletterForm } from '../../../hooks/use-newsletter-form';
import { useCookieConsentContext } from '../../../context/cookie-consent-context';
import { getFacebookUrl, getInstagramUrl, getObcinaUrl } from '../../../utils/site-config';
import { googleMapsSearchUrl } from '../../../utils/map-embed';

export function Footer() {
  const { email, setEmail, gdprConsent, setGdprConsent, subscribed, error, submitting, handleSubmit } =
    useNewsletterForm('footer');
  const { reopenBanner } = useCookieConsentContext();

  const facebookUrl = getFacebookUrl();
  const instagramUrl = getInstagramUrl();
  const obcinaUrl = getObcinaUrl();

  return (
    <footer id="kontakt" role="contentinfo" className="bg-[#1E3A2F] text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg mb-4">Nazarje Dogodki</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Vaš vir za vse dogodke v Nazarjah. Bodite obveščeni o kulturnih, športnih in družabnih dogodkih v našem kraju.
            </p>
          </div>

          <div>
            <h3 className="text-lg mb-4">Kontakt</h3>
            <div className="space-y-3">
              <a
                href="mailto:info@nazarje-dogodki.si"
                className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 shrink-0" aria-hidden />
                <span>info@nazarje-dogodki.si</span>
              </a>
              <a
                href="tel:+38638391600"
                className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 shrink-0" aria-hidden />
                <span>+386 3 839 1600</span>
              </a>
              <a
                href={googleMapsSearchUrl('Nazarje, Slovenija')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
              >
                <MapPin className="w-4 h-4 shrink-0" aria-hidden />
                <span>Nazarje, Slovenija</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg mb-4">Povezave</h3>
            <div className="space-y-2">
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-white/80 hover:text-white transition-colors"
                >
                  Facebook
                </a>
              )}
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-white/80 hover:text-white transition-colors"
                >
                  Instagram
                </a>
              )}
              <a
                href={obcinaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-white/80 hover:text-white transition-colors"
              >
                Občina Nazarje
              </a>
            </div>

            <div className="mt-8">
              <h4 className="text-sm mb-3 text-white/90">Prijava na e-novice</h4>
              {subscribed ? (
                <p className="text-xs text-[#A97A24]">✓ Uspešno ste se prijavili!</p>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <label htmlFor="footer-newsletter-email" className="sr-only">
                      E-pošta za prijavo na e-novice
                    </label>
                    <input
                      id="footer-newsletter-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Vaš e-naslov"
                      required
                      disabled={submitting}
                      autoComplete="email"
                      className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 transition-all disabled:opacity-60"
                    />
                    <button
                      type="submit"
                      disabled={submitting || !gdprConsent}
                      aria-label="Prijavi se na e-novice"
                      className="px-4 py-2 bg-[#2F5D46] hover:bg-[#A97A24] text-white rounded-lg transition-colors flex items-center gap-2 text-sm disabled:opacity-60 shrink-0"
                    >
                      <Send className="w-4 h-4" aria-hidden />
                    </button>
                  </div>
                  <label className="flex items-start gap-2 text-xs text-white/70 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={gdprConsent}
                      onChange={(e) => setGdprConsent(e.target.checked)}
                      disabled={submitting}
                      className="mt-0.5 shrink-0 rounded border-white/30"
                    />
                    <span>
                      Strinjam se z obdelavo e-poštnega naslova za e-novice (
                      <Link to="/zasebnost" className="underline hover:text-white">
                        politika zasebnosti
                      </Link>
                      ).
                    </span>
                  </label>
                  {error && <p className="text-xs text-red-200">{error}</p>}
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col items-center gap-3 text-center">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-white/70">
            <Link to="/zasebnost" className="hover:text-white transition-colors">
              Politika zasebnosti
            </Link>
            <Link to="/piskotki" className="hover:text-white transition-colors">
              Politika piškotkov
            </Link>
            <button
              type="button"
              onClick={reopenBanner}
              className="hover:text-white transition-colors underline-offset-2 hover:underline"
            >
              Nastavitve piškotkov
            </button>
          </div>
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} Nazarje Dogodki. Vse pravice pridržane.
          </p>
        </div>
      </div>
    </footer>
  );
}
