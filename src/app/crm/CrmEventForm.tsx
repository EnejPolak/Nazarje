import { ChangeEvent, FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router';
import { FileText, Save, Trash2, X } from 'lucide-react';
import '../styles/components/crm-event-form.css';
import type { EventData } from '../data/events';
import {
  adminCreateEvent,
  adminDeleteEvent,
  adminFetchEvent,
  adminUpdateEvent,
  EVENT_DOCUMENT_ACCEPT,
  EVENT_IMAGE_ACCEPT,
  isAcceptedEventDocumentType,
  isAcceptedEventImageType,
  uploadEventDocument,
  uploadEventImage,
} from '../api/admin';
import { newCrmEventId, toDateInputValue } from '../api/mappers';
import { ApiError } from '../api/client';
import {
  cardFilterFromEvent,
  CRM_CARD_FILTERS,
  DEFAULT_MAP_EMBED,
  payloadFromCardFilter,
} from './crm-constants';
import { getLastListPath, type CrmBackState } from './crm-nav';
import { FilterPill } from './FilterPill';
import { EventCardPreview } from './EventCardPreview';
import { EventDetailPreview } from './EventDetailPreview';

function fromDateInput(s: string): Date | null {
  if (!s) return null;
  const [y, m, d] = s.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

interface FormGroupProps {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}

function FormGroup({ id, title, description, children }: FormGroupProps) {
  return (
    <section className="crm-event-form__group" aria-labelledby={id}>
      <header className="crm-event-form__group-head">
        <h2 id={id} className="crm-event-form__group-title">
          {title}
        </h2>
        {description && <p className="crm-event-form__group-desc">{description}</p>}
      </header>
      <div className="crm-event-form__group-body">{children}</div>
    </section>
  );
}

function FormDivider() {
  return <hr className="crm-event-form__divider" />;
}

function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="crm-event-form__field">
      <div className="crm-event-form__label-row">
        {htmlFor ? (
          <label htmlFor={htmlFor} className="crm-event-form__label">
            {label}
          </label>
        ) : (
          <span className="crm-event-form__label">{label}</span>
        )}
        {hint && <span className="crm-event-form__hint">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

type FormAttachment = {
  key: string;
  name: string;
  url?: string;
  pendingFile?: File;
};

function createAttachmentKey(): string {
  return `att-${typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`}`;
}

function isPdfFile(file: File): boolean {
  return isAcceptedEventDocumentType(file.type) || file.name.toLowerCase().endsWith('.pdf');
}

async function resolveFormAttachments(
  items: FormAttachment[]
): Promise<{ name: string; url: string }[]> {
  const result: { name: string; url: string }[] = [];
  for (const item of items) {
    if (item.pendingFile) {
      const uploaded = await uploadEventDocument(item.pendingFile);
      result.push({
        name: uploaded.original_name || item.name,
        url: uploaded.url,
      });
    } else if (item.url) {
      result.push({ name: item.name, url: item.url });
    }
  }
  return result;
}

export function CrmEventForm() {
  const { id } = useParams<{ id: string }>();
  const routerLocation = useLocation();
  const navigate = useNavigate();
  const isEditRoute = routerLocation.pathname.includes('/uredi/');
  const isEdit = Boolean(isEditRoute && id);
  const backState = routerLocation.state as CrmBackState | null;
  const backPath = backState?.from ?? getLastListPath();

  const [title, setTitle] = useState('');
  const [dateStr, setDateStr] = useState(toDateInputValue(new Date()));
  const [dateEndStr, setDateEndStr] = useState('');
  const [time, setTime] = useState('10:00');
  const [timeEnd, setTimeEnd] = useState('');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [cardFilter, setCardFilter] = useState<string>('Kultura');
  const [location, setLocation] = useState('');
  const [locationMapUrl, setLocationMapUrl] = useState('');
  const [organizerName, setOrganizerName] = useState('');
  const [organizerEmail, setOrganizerEmail] = useState('');
  const [organizerPhone, setOrganizerPhone] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const [attachmentItems, setAttachmentItems] = useState<FormAttachment[]>([]);
  const [uploadingDocuments, setUploadingDocuments] = useState(false);
  const [published, setPublished] = useState(true);
  const [slug, setSlug] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [previewTab, setPreviewTab] = useState<'card' | 'detail'>('card');

  useEffect(() => {
    setNotFound(false);
    setLoadError(null);
    if (!isEdit || !id) return;

    let cancelled = false;
    (async () => {
      try {
        const existing = await adminFetchEvent(id);
        if (cancelled) return;
        setTitle(existing.title);
        setDateStr(toDateInputValue(existing.date));
        setDateEndStr(existing.dateEnd ? toDateInputValue(existing.dateEnd) : '');
        setTime(existing.time);
        setTimeEnd(existing.timeEnd ?? '');
        setDescription(existing.description);
        setLongDescription(existing.longDescription);
        setCardFilter(cardFilterFromEvent(existing));
        setLocation(existing.location);
        setLocationMapUrl(existing.locationMapUrl ?? '');
        setOrganizerName(existing.organizerName ?? '');
        setOrganizerEmail(existing.organizerEmail ?? '');
        setOrganizerPhone(existing.organizerPhone ?? '');
        setImageUrl(existing.imageUrl ?? '');
        setSelectedImageFile(null);
        setLocalPreviewUrl((prev) => {
          if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
          return null;
        });
        if (imageInputRef.current) {
          imageInputRef.current.value = '';
        }
        setPublished(existing.published !== false);
        setSlug(existing.slug ?? '');
        setAttachmentItems(
          (existing.attachments ?? []).map((a, i) => ({
            key: `saved-${i}-${a.url}`,
            name: a.name,
            url: a.url,
          }))
        );
        if (documentInputRef.current) {
          documentInputRef.current.value = '';
        }
      } catch (e) {
        if (cancelled) return;
        setNotFound(true);
        setLoadError(
          e instanceof ApiError ? e.message : 'Dogodek ni bil najden.'
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isEdit, id]);

  const previewDate = useMemo(() => fromDateInput(dateStr), [dateStr]);
  const previewDateEnd = useMemo(() => fromDateInput(dateEndStr), [dateEndStr]);
  const attachmentCount = attachmentItems.length;
  const previewAttachments = useMemo(
    () =>
      attachmentItems.map((a) => ({
        name: a.name,
        url: a.url,
      })),
    [attachmentItems]
  );
  const previewImageUrl = localPreviewUrl ?? (imageUrl.trim() || undefined);

  useEffect(() => {
    return () => {
      if (localPreviewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  const clearLocalImagePreview = () => {
    if (localPreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(localPreviewUrl);
    }
    setLocalPreviewUrl(null);
    setSelectedImageFile(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const onImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isAcceptedEventImageType(file.type)) {
      setSaveError('Dovoljene so le slike JPEG, PNG, WebP ali GIF.');
      e.target.value = '';
      return;
    }

    if (localPreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(localPreviewUrl);
    }
    setSelectedImageFile(file);
    setLocalPreviewUrl(URL.createObjectURL(file));
    setSaveError(null);
  };

  const onDocumentFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const added: FormAttachment[] = [];
    let rejected = false;
    for (const file of Array.from(files)) {
      if (!isPdfFile(file)) {
        rejected = true;
        continue;
      }
      added.push({
        key: createAttachmentKey(),
        name: file.name,
        pendingFile: file,
      });
    }

    if (rejected) {
      setSaveError('Dovoljene so le datoteke PDF.');
    } else if (added.length) {
      setSaveError(null);
    }

    if (added.length) {
      setAttachmentItems((prev) => [...prev, ...added]);
    }
    e.target.value = '';
  };

  const removeAttachment = (key: string) => {
    setAttachmentItems((prev) => prev.filter((a) => a.key !== key));
  };

  const buildPayload = (
    eventId: string,
    finalImageUrl?: string,
    resolvedAttachments?: { name: string; url: string }[]
  ): EventData => {
    const date = fromDateInput(dateStr) ?? new Date();
    const dateEnd = fromDateInput(dateEndStr) ?? undefined;
    const attachments =
      resolvedAttachments && resolvedAttachments.length > 0 ? resolvedAttachments : undefined;
    const filterFields = payloadFromCardFilter(cardFilter);

    return {
      id: eventId,
      title: title.trim(),
      date,
      dateEnd,
      time: time.trim(),
      timeEnd: timeEnd.trim() || undefined,
      description: description.trim(),
      longDescription: longDescription.trim() || description.trim(),
      category: filterFields.category,
      secondaryFilter: filterFields.secondaryFilter,
      location: location.trim(),
      locationMapUrl: locationMapUrl.trim() || DEFAULT_MAP_EMBED,
      organizerName: organizerName.trim() || undefined,
      organizerEmail: organizerEmail.trim() || undefined,
      organizerPhone: organizerPhone.trim() || undefined,
      isImportant: filterFields.isImportant,
      imageUrl: finalImageUrl ?? (imageUrl.trim() || undefined),
      attachments,
      published,
      slug: slug.trim() || undefined,
    };
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setSaving(true);
    setUploadingImage(false);
    setUploadingDocuments(false);
    try {
      const eventId = isEdit && id ? id : newCrmEventId();
      let finalImageUrl = imageUrl.trim() || undefined;

      if (selectedImageFile) {
        setUploadingImage(true);
        finalImageUrl = await uploadEventImage(selectedImageFile);
        setUploadingImage(false);
        setImageUrl(finalImageUrl);
        clearLocalImagePreview();
      }

      if (attachmentItems.some((a) => a.pendingFile)) {
        setUploadingDocuments(true);
      }
      const resolvedAttachments = await resolveFormAttachments(attachmentItems);
      setUploadingDocuments(false);
      setAttachmentItems(
        resolvedAttachments.map((a, i) => ({
          key: `saved-${i}-${a.url}`,
          name: a.name,
          url: a.url,
        }))
      );
      if (documentInputRef.current) {
        documentInputRef.current.value = '';
      }

      const payload = buildPayload(eventId, finalImageUrl, resolvedAttachments);
      const saved = isEdit
        ? await adminUpdateEvent(payload)
        : await adminCreateEvent(payload);
      navigate(`/admin/dashboard/dogodek/${saved.id}`, {
        replace: true,
        state: { from: backPath },
      });
    } catch (err) {
      setUploadingImage(false);
      setUploadingDocuments(false);
      setSaveError(
        err instanceof ApiError
          ? err.message
          : 'Shranjevanje ni uspelo. Preveri admin API na strežniku.'
      );
    } finally {
      setSaving(false);
      setUploadingImage(false);
      setUploadingDocuments(false);
    }
  };

  const onDelete = async () => {
    if (!isEdit || !id || !confirm('Res želiš izbrisati ta dogodek?')) return;
    setSaving(true);
    setSaveError(null);
    try {
      await adminDeleteEvent(id);
      navigate(backPath);
    } catch (err) {
      setSaveError(
        err instanceof ApiError ? err.message : 'Brisanje ni uspelo.'
      );
      setSaving(false);
    }
  };

  if (notFound) {
    return (
      <div className="rounded-2xl bg-white border border-[#18201B]/10 p-10 text-center">
        <p className="text-[#18201B] mb-4">{loadError ?? 'Dogodek ni bil najden.'}</p>
        <Link to={backPath} className="crm-back-link">
          ← Nazaj
        </Link>
      </div>
    );
  }

  const saveLabel = uploadingImage
    ? 'Nalagam sliko…'
    : uploadingDocuments
      ? 'Nalagam PDF…'
      : saving
        ? 'Shranjujem…'
        : isEdit
          ? 'Shrani spremembe'
          : 'Shrani dogodek';

  return (
    <div className="crm-page crm-page--event-form">
      <header className="crm-page__header">
        {isEdit && (
          <Link to={backPath} state={backState ?? undefined} className="crm-back-link">
            ← Nazaj
          </Link>
        )}
        <h1 className="crm-page__title">{isEdit ? 'Uredi dogodek' : 'Ustvari dogodek'}</h1>
        <p className="crm-page__subtitle">
          Izpolni obrazec od zgoraj navzdol. Predogled na desni se posodablja med tipkanjem.
        </p>
      </header>

      <form onSubmit={onSubmit} className="crm-event-form__layout">
        <div className="crm-event-form__main">
          <div className="crm-event-form__panel">
            <FormGroup id="crm-event-basics" title="Osnovno">
              <div className="crm-event-form__title-row">
                <Field label="Naslov dogodka" htmlFor="event-title">
                  <input
                    id="event-title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="npr. Poletni koncert ob Savinji"
                    className="crm-event-form__input"
                  />
                </Field>
                <label className="crm-event-form__publish">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                  />
                  <span>Objavljeno</span>
                </label>
              </div>
            </FormGroup>

            <FormDivider />

            <FormGroup
              id="crm-event-schedule"
              title="Termin"
              description="Za večdnevne dogodke izpolni tudi datum konca."
            >
              <div className="crm-event-form__row crm-event-form__row--2">
                <Field label="Datum začetka" htmlFor="event-date-start">
                  <input
                    id="event-date-start"
                    type="date"
                    required
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    className="crm-event-form__input"
                  />
                </Field>
                <Field label="Datum konca" hint="opcijsko" htmlFor="event-date-end">
                  <input
                    id="event-date-end"
                    type="date"
                    value={dateEndStr}
                    onChange={(e) => setDateEndStr(e.target.value)}
                    className="crm-event-form__input"
                  />
                </Field>
              </div>
              <div className="crm-event-form__row crm-event-form__row--2">
                <Field label="Ura začetka" htmlFor="event-time-start">
                  <input
                    id="event-time-start"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="19:00"
                    className="crm-event-form__input"
                  />
                </Field>
                <Field label="Ura konca" hint="opcijsko" htmlFor="event-time-end">
                  <input
                    id="event-time-end"
                    value={timeEnd}
                    onChange={(e) => setTimeEnd(e.target.value)}
                    placeholder="22:00"
                    className="crm-event-form__input"
                  />
                </Field>
              </div>
            </FormGroup>

            <FormDivider />

            <FormGroup
              id="crm-event-content"
              title="Vsebina"
              description="Kratek opis na kartici, podrobnosti na strani dogodka."
            >
              <Field label="Kratek opis">
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="V nekaj stavkih — kaj obiskovalec pričakuje."
                  className="crm-event-form__textarea"
                />
              </Field>
              <Field label="Podroben opis" hint="opcijsko">
                <textarea
                  rows={5}
                  value={longDescription}
                  onChange={(e) => setLongDescription(e.target.value)}
                  placeholder="Program, urnik, dodatne informacije …"
                  className="crm-event-form__textarea"
                />
              </Field>
            </FormGroup>

            <FormDivider />

            <FormGroup id="crm-event-meta" title="Kategorija in lokacija">
              <Field label="Filter na kartici">
                <div className="crm-event-form__filters">
                  {CRM_CARD_FILTERS.map((f) => (
                    <FilterPill
                      key={f}
                      label={f}
                      value={f}
                      selected={cardFilter === f}
                      onClick={() => setCardFilter(f)}
                      variant="soft"
                    />
                  ))}
                </div>
              </Field>
              <Field label="Lokacija" htmlFor="event-location">
                <input
                  id="event-location"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="npr. Osrednji trg, Nazarje"
                  className="crm-event-form__input"
                />
              </Field>
            </FormGroup>

            <FormDivider />

            <FormGroup id="crm-event-organizer" title="Organizator" description="Opcijsko — prikaže se na javni strani dogodka.">
              <Field label="Ime organizatorja" htmlFor="event-organizer-name">
                <input
                  id="event-organizer-name"
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
                  placeholder="npr. KD Nazarje"
                  className="crm-event-form__input"
                />
              </Field>
              <Field label="E-pošta organizatorja" htmlFor="event-organizer-email">
                <input
                  id="event-organizer-email"
                  type="email"
                  value={organizerEmail}
                  onChange={(e) => setOrganizerEmail(e.target.value)}
                  placeholder="kontakt@primer.si"
                  className="crm-event-form__input"
                />
              </Field>
              <Field label="Telefon organizatorja" htmlFor="event-organizer-phone">
                <input
                  id="event-organizer-phone"
                  type="tel"
                  value={organizerPhone}
                  onChange={(e) => setOrganizerPhone(e.target.value)}
                  placeholder="+386 ..."
                  className="crm-event-form__input"
                />
              </Field>
            </FormGroup>

            <FormDivider />

            <FormGroup
              id="crm-event-media"
              title="Slika in dokumenti"
              description="Vse datoteke se naložijo na strežnik ob shranjevanju."
            >
              <div className="crm-event-form__media-block">
                <p className="crm-event-form__subhead">Slika</p>
                <Field label="Fotografija" hint="opcijsko · JPEG, PNG, WebP, GIF">
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept={EVENT_IMAGE_ACCEPT}
                    onChange={onImageFileChange}
                    disabled={saving || uploadingImage}
                    className="crm-event-form__file"
                  />
                  {selectedImageFile && (
                    <p className="crm-event-form__file-name">{selectedImageFile.name}</p>
                  )}
                  {uploadingImage && <p className="crm-event-form__status">Nalagam sliko…</p>}
                  {previewImageUrl && (
                    <div className="crm-event-form__image-preview">
                      <img src={previewImageUrl} alt="Predogled slike" />
                    </div>
                  )}
                </Field>
              </div>
              <div className="crm-event-form__media-block">
                <p className="crm-event-form__subhead">PDF priponke</p>
                <Field label="Dokumenti" hint="opcijsko · več datotek">
                  <input
                    ref={documentInputRef}
                    type="file"
                    accept={EVENT_DOCUMENT_ACCEPT}
                    multiple
                    onChange={onDocumentFileChange}
                    disabled={saving || uploadingDocuments}
                    className="crm-event-form__file"
                  />
                  {uploadingDocuments && <p className="crm-event-form__status">Nalagam PDF…</p>}
                </Field>
                {attachmentItems.length > 0 && (
                  <ul className="crm-event-form__attachments">
                    {attachmentItems.map((item) => (
                      <li key={item.key} className="crm-event-form__attachment">
                        <span className="crm-event-form__attachment-icon" aria-hidden>
                          <FileText />
                        </span>
                        <div className="crm-event-form__attachment-info">
                          <p className="crm-event-form__attachment-name">{item.name}</p>
                          <p className="crm-event-form__attachment-meta">
                            {item.pendingFile ? (
                              'Naloži se ob shranjevanju'
                            ) : item.url ? (
                              <a href={item.url} target="_blank" rel="noopener noreferrer">
                                Odpri datoteko
                              </a>
                            ) : null}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(item.key)}
                          disabled={saving || uploadingDocuments}
                          className="crm-event-form__attachment-remove"
                          aria-label={`Odstrani ${item.name}`}
                        >
                          <Trash2 />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </FormGroup>

            <details className="crm-event-form__advanced">
              <summary className="crm-event-form__advanced-summary">
                Dodatne nastavitve
              </summary>
              <div className="crm-event-form__advanced-body">
                <Field label="Slug (URL)" hint="opcijsko" htmlFor="event-slug">
                  <input
                    id="event-slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="poletni-koncert-nazarje"
                    className="crm-event-form__input"
                  />
                </Field>
                <Field label="URL zemljevida" hint="opcijsko">
                  <input
                    value={locationMapUrl}
                    onChange={(e) => setLocationMapUrl(e.target.value)}
                    placeholder="Prazno = privzeti zemljevid Nazarij"
                    className="crm-event-form__input"
                  />
                  <p className="crm-event-form__helper">
                    OpenStreetMap embed URL. Če pustiš prazno, se uporabi privzeti zemljevid.
                  </p>
                </Field>
              </div>
            </details>
          </div>

          {saveError && <p className="crm-event-form__error">{saveError}</p>}

          <div className="crm-event-form__actions">
            <button
              type="submit"
              disabled={saving || uploadingImage || uploadingDocuments}
              className="crm-event-form__btn crm-event-form__btn--primary"
            >
              <Save />
              {saveLabel}
            </button>
            <Link to={backPath} className="crm-event-form__btn crm-event-form__btn--ghost">
              <X />
              Prekliči
            </Link>
            {isEdit && (
              <button
                type="button"
                disabled={saving}
                onClick={onDelete}
                className="crm-event-form__btn crm-event-form__btn--danger"
              >
                <Trash2 />
                Izbriši
              </button>
            )}
          </div>
        </div>

        <aside className="crm-event-form__preview" aria-label="Predogled dogodka">
          <div className="crm-event-form__preview-card">
            <div className="crm-event-form__preview-head">
              <p className="crm-event-form__preview-title">Predogled</p>
              <p className="crm-event-form__preview-desc">
                {previewTab === 'card'
                  ? 'Kartica med prihajajočimi dogodki.'
                  : 'Stran po kliku na Preberi več.'}
              </p>
            </div>
            <div className="crm-event-form__preview-tabs" role="tablist">
              {(
                [
                  { id: 'card' as const, label: 'Kartica' },
                  { id: 'detail' as const, label: 'Stran dogodka' },
                ]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={previewTab === tab.id}
                  onClick={() => setPreviewTab(tab.id)}
                  className={`crm-event-form__preview-tab${
                    previewTab === tab.id ? ' crm-event-form__preview-tab--active' : ''
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="crm-event-form__preview-body">
              <div className="crm-event-form__preview-frame">
                {previewTab === 'card' ? (
                  <EventCardPreview
                    title={title}
                    date={previewDate}
                    dateEnd={previewDateEnd}
                    time={time}
                    timeEnd={timeEnd}
                    description={description}
                    cardFilter={cardFilter}
                    imageUrl={previewImageUrl}
                    location={location}
                    attachmentCount={attachmentCount}
                  />
                ) : (
                  <EventDetailPreview
                    title={title}
                    date={previewDate}
                    dateEnd={previewDateEnd}
                    time={time}
                    timeEnd={timeEnd}
                    longDescription={longDescription}
                    cardFilter={cardFilter}
                    imageUrl={previewImageUrl}
                    location={location}
                    attachments={previewAttachments}
                  />
                )}
              </div>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
