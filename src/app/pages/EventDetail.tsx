import { useParams, useNavigate } from 'react-router';
import { useState } from 'react';
import { EventAttachments } from '../components/public/event-detail/event-attachments';
import { EventDescription } from '../components/public/event-detail/event-description';
import { EventDetailHero } from '../components/public/event-detail/event-detail-hero';
import { EventLocationCard } from '../components/public/event-detail/event-location-card';
import { EventMetaCard } from '../components/public/event-detail/event-meta-card';
import { EventShareCard } from '../components/public/event-detail/event-share-card';
import { EventsError, EventsLoading } from '../components/public/events/events-loading';
import { Header } from '../components/public/layout/header';
import { Footer } from '../components/public/layout/footer';
import { useEventDetail } from '../hooks/use-event-detail';
import { formatSlovenianDate } from '../utils/event-date';
import '../styles/components/event-detail.css';

export function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { event, loading, error, refetch } = useEventDetail(id);
  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F4EE] flex flex-col">
        <Header />
        <EventsLoading label="Nalagam dogodek…" />
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#F7F4EE] flex flex-col items-center justify-center px-4">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center py-16">
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
            onClick={() => navigate('/')}
            className="bg-[#2F5D46] text-white px-6 py-3 rounded-lg hover:bg-[#1E3A2F] transition-colors"
          >
            Nazaj na domačo stran
          </button>
        </div>
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
      <Header />

      <EventDetailHero event={event} onBack={() => navigate(-1)} />

      <div className="event-detail-content">
        <div>
          <h1 className="event-detail-title">{event.title}</h1>

          <EventMetaCard event={event} />
          <EventDescription description={event.longDescription} />
          <EventAttachments attachments={event.attachments} />
        </div>

        <div className="event-detail-sidebar">
          <EventLocationCard event={event} />
          <EventShareCard
            copied={copied}
            onFacebookShare={shareFacebook}
            onInstagramShare={shareInstagram}
            onCopyLink={copyLink}
          />

          <button
            onClick={() => navigate('/')}
            className="event-detail-back-button"
          >
            ← Vsi dogodki
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
