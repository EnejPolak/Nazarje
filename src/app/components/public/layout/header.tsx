import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import nazarjeGrb from 'figma:asset/2e8f7a543b609ec574e73e03452550de1d5e4577.png';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (path: string, section?: string) => {
    setMenuOpen(false);
    if (section) {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      } else {
        document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
  };

  const navBtn = (label: string, path: string, section?: string) => {
    const isActive = location.pathname === path;
    return (
      <button
        key={path}
        onClick={() => handleNav(path, section)}
        className={`relative px-4 py-2 text-base font-medium tracking-wide transition-colors ${
          isActive
            ? 'text-[#1E3A2F]'
            : 'text-[#2F5D46]/85 hover:text-[#1E3A2F]'
        }`}
      >
        {label}
        {isActive && (
          <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#2F5D46] rounded-full" />
        )}
      </button>
    );
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F7F4EE]/92 backdrop-blur-xl border-b border-[#1E3A2F]/12 shadow-sm'
          : 'bg-[#F7F4EE]/78 backdrop-blur-lg border-b border-[#1E3A2F]/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative flex items-center justify-between h-16">

          {/* Left nav */}
          <nav className="hidden md:flex items-center">
            {navBtn('Domov', '/', 'domov')}
            {navBtn('Vsi dogodki', '/events')}
          </nav>

          {/* Center: coat of arms in circle — absolutely centered */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <button
              onClick={() => handleNav('/', 'domov')}
              aria-label="Domov"
              className="opacity-90 hover:opacity-100 transition-opacity"
            >
              <img
                src={nazarjeGrb}
                alt="Grb Nazarij"
                className="w-10 h-10 object-contain"
              />
            </button>
          </div>

          {/* Right nav */}
          <nav className="hidden md:flex items-center">
            {navBtn('Pretekli dogodki', '/past-events')}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 text-[#1E3A2F] hover:text-[#2F5D46] transition-colors ml-auto"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Meni"
          >
            <span className={`w-5 h-px bg-current transition-all duration-200 ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`w-5 h-px bg-current transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-5 h-px bg-current transition-all duration-200 ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu - slide in from left */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/40 md:hidden z-40"
            />

            {/* Slide-in menu */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-16 bottom-0 w-64 bg-[#F7F4EE]/96 backdrop-blur-xl md:hidden z-50 border-r border-[#1E3A2F]/10"
            >
              {/* Navigation links */}
              <nav className="px-6 py-6 flex flex-col gap-2">
                {[
                  { label: 'Domov',            path: '/',            section: 'domov' },
                  { label: 'Vsi dogodki',      path: '/events' },
                  { label: 'Pretekli dogodki', path: '/past-events' },
                ].map((link, idx) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <motion.button
                      key={link.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => handleNav(link.path, link.section)}
                      className={`text-left py-3 px-4 rounded-lg text-base font-medium tracking-wide transition-colors ${
                        isActive
                          ? 'bg-[#2F5D46]/12 text-[#1E3A2F]'
                          : 'text-[#2F5D46]/90 hover:text-[#1E3A2F] hover:bg-[#1E3A2F]/6'
                      }`}
                    >
                      {link.label}
                    </motion.button>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}