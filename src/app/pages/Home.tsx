import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import React, { useMemo, useState } from 'react';
import { Header } from '../components/public/layout/header';
import { Hero } from '../components/public/home/hero';
import { EventCalendar, CalendarEvent } from '../components/public/events/event-calendar';
import { EventCard } from '../components/public/events/event-card';
import { Footer } from '../components/public/layout/footer';
import { useMergedEvents } from '../data/event-store';
import '../styles/components/home.css';

const fadeUpInView = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export function Home() {
  const navigate = useNavigate();
  const mergedEvents = useMergedEvents();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const upcomingEvents = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return mergedEvents.filter((e) => {
      const d = new Date(e.date);
      d.setHours(0, 0, 0, 0);
      return d >= t;
    });
  }, [mergedEvents]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const calendarEvents: CalendarEvent[] = mergedEvents.map((event) => ({
    id: event.id,
    title: event.title,
    date: event.date,
    category: event.category,
    isImportant: event.isImportant,
    time: event.time,
  }));

  return (
    <div className="min-h-screen bg-[#F7F4EE]">
      <Header />

      <Hero />

      {/* Calendar Section */}
      <section id="koledar" className="home-calendar-section">
        <div className="max-w-7xl mx-auto px-6">
          <EventCalendar
            events={calendarEvents}
            onEventClick={(id) => navigate(`/event/${id}`)}
          />
        </div>
      </section>

      {/* Events Grid Section */}
      <section id="dogodki" className="py-16 bg-[#EAF1EA]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUpInView(0)} className="text-center mb-12">
            <h2 className="text-3xl text-[#18201B] mb-4">Prihajajoči dogodki</h2>
            <p className="text-[#18201B]/70 max-w-2xl mx-auto">Kliknite na kartico za vse podrobnosti</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.slice(0, 6).map((event, i) => (
              <EventCard
                key={event.id}
                event={event}
                index={i}
                onClick={() => navigate(`/event/${event.id}`)}
              />
            ))}
          </div>

          <motion.div
            {...fadeUpInView(0.1)}
            className="flex flex-wrap justify-center gap-3 mt-10"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/events')}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#2F5D46] hover:bg-[#1E3A2F] text-white rounded-xl transition-colors shadow-sm"
            >
              <span className="text-sm tracking-wide">Vsi dogodki</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/past-events')}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white hover:bg-[#F7F4EE] text-[#18201B]/70 hover:text-[#18201B] border border-[#1E3A2F]/15 rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm tracking-wide">Pretekli dogodki</span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-14 bg-[#F7F4EE]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            {...fadeUpInView(0)}
            className="flex flex-col md:flex-row md:items-center gap-8 md:gap-16 px-8 py-10 rounded-2xl bg-[#1E3A2F]"
          >
            {/* Left */}
            <div className="flex-1 min-w-0">
              <span className="inline-block text-[11px] uppercase tracking-widest text-white/40 mb-3">
                E-novice
              </span>
              <h3 className="text-2xl text-white mb-2 leading-snug">
                Bodite prvi obveščeni
              </h3>
              <p className="text-white/55 text-sm leading-relaxed max-w-sm">
                Enkrat tedensko — samo najpomembnejši dogodki v Nazarjah. Brez neželene pošte.
              </p>
            </div>

            {/* Right: form */}
            <div className="flex-shrink-0 w-full md:w-auto">
              {subscribed ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2.5 px-5 py-3.5 rounded-xl bg-white/10 text-white text-sm"
                >
                  <span className="text-white">✓</span>
                  Hvala! Prijavljeni ste.
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vaš@email.si"
                    className="w-56 md:w-64 px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/35 text-sm border border-white/15 focus:outline-none focus:border-white/40 transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-white hover:bg-white/90 text-[#1E3A2F] text-sm transition-colors whitespace-nowrap"
                  >
                    Prijavi se
                  </button>
                </form>
              )}
              <p className="text-[11px] text-white/25 mt-2.5 pl-1">
                Odjava kadarkoli. Brezplačno.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}