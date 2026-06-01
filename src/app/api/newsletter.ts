import { apiFetch } from './client';

export type NewsletterSource = 'home' | 'footer' | 'website';

export async function subscribeNewsletter(
  email: string,
  source: NewsletterSource = 'website'
): Promise<void> {
  await apiFetch<unknown>('/newsletter-subscribe.php', {
    method: 'POST',
    json: { email: email.trim(), source },
  });
}
