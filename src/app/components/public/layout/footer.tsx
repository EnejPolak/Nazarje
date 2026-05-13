import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Here you would normally send the email to your backend
      console.log('Subscribed:', email);
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer id="kontakt" className="bg-[#1E3A2F] text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg mb-4">Nazarje Dogodki</h3>
            <p className="text-white/80 text-sm leading-relaxed mb-5">
              Vaš vir za vse dogodke v Nazarjah. Bodite obveščeni o kulturnih, športnih in družabnih dogodkih v našem kraju.
            </p>

            {/* Newsletter signup */}
            <div className="mt-6">
              <h4 className="text-sm mb-3 text-white/90">Prijava na e-novice</h4>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Vaš e-naslov"
                  required
                  className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2F5D46] hover:bg-[#A97A24] text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              {subscribed && (
                <p className="text-xs text-[#A97A24] mt-2">✓ Uspešno ste se prijavili!</p>
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
