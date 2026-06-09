import { useParams, useNavigate } from 'react-router';
import { useState } from 'react';
import { EventAttachments } from '../components/public/event-detail/event-attachments';
import { EventDescription } from '../components/public/event-detail/event-description';
import { EventDetailHero } from '../components/public/event-detail/event-detail-hero';
import { EventLocationCard } from '../components/public/event-detail/event-location-card';
import { EventShareCard } from '../components/public/event-detail/event-share-card';
import { EventsError, EventsLoading } from '../components/public/events/events-loading';
import { Header } from '../components/public/layout/header';
import { Footer } from '../components/public/layout/footer';
import { SkipLink } from '../components/public/layout/skip-link';
import { useEventDetail } from '../hooks/use-event-detail';
import { usePageMeta } from '../hooks/use-page-meta';
import { formatSlovenianDate } from '../utils/event-date';
import { absoluteUrl, getOgDefaultImage } from '../utils/site-config';
import { eventDetailPath } from '../utils/event-path';
import { EventOrganizerCard } from '../components/public/event-detail/event-organizer-card';
import '../styles/components/event-detail.css';

export function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { event, loading, error, refetch } = useEventDetail(id);
  const [copied, setCopied] = useState(false);

  usePageMeta(
    event
      ? {
          title: `${event.title} · Nazarje Dogodki`,
          description: event.description,
          canonicalUrl: absoluteUrl(eventDetailPath(event)),
          ogImage: event.imageUrl || getOgDefaultImage(),
          ogType: 'article',
        }
      : {
          title: 'Dogodek · Nazarje Dogodki',
          description: 'Podrobnosti dogodka v Nazarjah.',
          noindex: true,
        }
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F4EE] flex flex-col">
        <SkipLink />
        <Header />
        <main id="main-content" className="flex-1">
          <EventsLoading label="Nalagam dogodek…" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#F7F4EE] flex flex-col items-center justify-center px-4">
        <SkipLink />
        <Header />
        <main
          id="main-content"
          className="flex-1 flex flex-col items-center justify-center py-16 w-full"
        >
          <p className="text-[#18201B] text-xl mb-4">
            {error ?? 'Dogodek ni bil najden.'}
          </p>
          {error && (
            <button
              type="button"
              onClick={refetch}
              className="text-[#2F5D46] text-sm mb-4 hover:underline"
            >
              Poskusi znova
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="event-detail-back-button max-w-xs"
          >
            Nazaj na domačo stran
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const shareUrl = window.location.href;
  const shareText = `${event.title} — ${formatSlovenianDate(event.date)}, ${event.time} @ ${event.location}`;

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const shareInstagram = () => {
    navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      alert('Besedilo je bilo kopirano! Odprite Instagram in ga prilepite v objavo ali zgodbo.');
    });
  };

  return (
    <div className="event-detail-page">
      <SkipLink />
      <Header />

      <main id="main-content">
        <EventDetailHero event={event} onBack={() => navigate(-1)}>
          <div className="event-detail-content">
            <div className="event-detail-main">
              <EventDescription description={event.longDescription} />
              <EventAttachments attachments={event.attachments} />
            </div>

            <aside className="event-detail-sidebar">
              <EventOrganizerCard event={event} />
              <EventLocationCard event={event} />
              <EventShareCard
                copied={copied}
                onFacebookShare={shareFacebook}
                onInstagramShare={shareInstagram}
                onCopyLink={copyLink}
              />
            </aside>
          </div>
        </EventDetailHero>
      </main>

      <Footer />
    </div>
  );
}
