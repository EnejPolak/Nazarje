import { useState } from 'react';
import { subscribeNewsletter, type NewsletterSource } from '../api/newsletter';
import { ApiError } from '../api/client';

export function useNewsletterForm(source: NewsletterSource) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await subscribeNewsletter(email, source);
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.status === 409 || /duplicate|že/i.test(err.message)
            ? 'Ta e-poštni naslov je že prijavljen.'
            : err.message
          : 'Prijava ni uspela. Poskusite znova pozneje.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return { email, setEmail, subscribed, error, submitting, handleSubmit };
}
