export function eventDetailPath(event: { id: string; slug?: string | null }): string {
  const segment = event.slug?.trim() || event.id;
  return `/event/${segment}`;
}
