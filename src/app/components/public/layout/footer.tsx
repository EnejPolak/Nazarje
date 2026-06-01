import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useNewsletterForm } from '../../../hooks/use-newsletter-form';

export function Footer() {
  const { email, setEmail, subscribed, error, submitting, handleSubmit } =
    useNewsletterForm('footer');

  return (
    <footer id="kontakt" className="bg-[#1E3A2F] text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg mb-4">Nazarje Dogodki</h3>
            <p className="text-white/80 text-sm leading-relaxed mb-5">
              Vaš vir za vse dogodke v Nazarjah. Bodite obveščeni o kulturnih, športnih in družabnih dogodkih v našem kraju.
            </p>

            <div className="mt-6">
              <h4 className="text-sm mb-3 text-white/90">Prijava na e-novice</h4>
              {subscribed ? (
                <p className="text-xs text-[#A97A24]">✓ Uspešno ste se prijavili!</p>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Vaš e-naslov"
                      required
                      disabled={submitting}
                      className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 transition-all disabled:opacity-60"
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-4 py-2 bg-[#2F5D46] hover:bg-[#A97A24] text-white rounded-lg transition-colors flex items-center gap-2 text-sm disabled:opacity-60"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  {error && <p className="text-xs text-red-200">{error}</p>}
                </form>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg mb-4">Kontakt</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Mail className="w-4 h-4" />
                <span>info@nazarje-dogodki.si</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Phone className="w-4 h-4" />
                <span>+386 3 839 1600</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <MapPin className="w-4 h-4" />
                <span>Nazarje, Slovenija</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg mb-4">Povezave</h3>
            <div className="space-y-2">
              <a
                href="#"
                className="block text-sm text-white/80 hover:text-white transition-colors"
              >
                Facebook
              </a>
              <a
                href="#"
                className="block text-sm text-white/80 hover:text-white transition-colors"
              >
                Instagram
              </a>
              <a
                href="#"
                className="block text-sm text-white/80 hover:text-white transition-colors"
              >
                Občina Nazarje
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-sm text-white/60 text-center">
            © {new Date().getFullYear()} Nazarje Dogodki. Vse pravice pridržane.
          </p>
        </div>
      </div>
    </footer>
  );
}
