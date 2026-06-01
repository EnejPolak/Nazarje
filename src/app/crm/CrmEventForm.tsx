import { ChangeEvent, FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router';
import {
  AlignLeft,
  Calendar as CalendarIcon,
  Clock,
  FileText,
  Image as ImageIconLu,
  MapPin,
  Paperclip,
  Save,
  Tag,
  Trash2,
  Type,
  X,
} from 'lucide-react';
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

interface SectionProps {
  icon: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
}

function Section({ icon, title, description, children }: SectionProps) {
  return (
    <section className="rounded-2xl border border-[#18201B]/10 bg-white p-5 sm:p-6 shadow-sm">
      <header className="flex items-start gap-3 mb-4">
        <span className="inline-flex size-9 items-center justify-center rounded-xl bg-[#EAF1EA] text-[#2F5D46] shrink-0">
          {icon}
        </span>
        <div>
          <h2 className="text-base font-semibold text-[#18201B] tracking-tight">{title}</h2>
          {description && (
            <p className="text-[13px] text-[#18201B]/60 leading-snug mt-0.5">{description}</p>
          )}
        </div>
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function FieldLabel({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 mb-1.5">
      <label className="block text-sm font-medium text-[#18201B]">{children}</label>
      {hint && <span className="text-[11px] text-[#18201B]/45">{hint}</span>}
    </div>
  );
}

const inputCls =
  'w-full rounded-lg border border-[#18201B]/18 bg-[#FAFAF8] px-3 py-2.5 text-sm text-[#18201B] placeholder:text-[#18201B]/35 outline-none focus:border-[#2F5D46]/50 focus:ring-1 focus:ring-[#2F5D46]/25';

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

  return (
    <div className="crm-page">
      <header className="crm-page__header">
        {isEdit && (
          <Link to={backPath} state={backState ?? undefined} className="crm-back-link">
            ← Nazaj
          </Link>
        )}
        <p className="crm-page__eyebrow">CRM</p>
        <h1 className="crm-page__title">{isEdit ? 'Uredi dogodek' : 'Ustvari dogodek'}</h1>
        <p className="crm-page__subtitle">
          Levo izpolni obrazec, desno v živo vidiš, kako bo izgledala kartica na strani.
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-6 items-start"
      >
        <div className="space-y-5 min-w-0">
          <Section
            icon={<Type className="size-5" />}
            title="Osnove"
            description="Naslov, ki se pojavi na kartici in na strani dogodka."
          >
            <div>
              <FieldLabel hint={`${title.length} znakov`}>Naslov</FieldLabel>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="npr. Poletni koncert ob Savinji"
                className={inputCls}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div>
                <FieldLabel hint="opcijsko">Slug (URL)</FieldLabel>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="poletni-koncert-nazarje"
                  className={inputCls}
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer pb-2.5">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="size-4 rounded border-[#18201B]/20"
                  />
                  <span className="text-sm text-[#18201B]">Objavljeno na javni strani</span>
                </label>
              </div>
            </div>
          </Section>

          <Section
            icon={<CalendarIcon className="size-5" />}
            title="Datum in čas"
            description="Enodnevni ali večdnevni dogodek. Ura konca je opcijska."
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>Datum začetka</FieldLabel>
                <input
                  type="date"
                  required
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <FieldLabel hint="opcijsko">Datum konca</FieldLabel>
                <input
                  type="date"
                  value={dateEndStr}
                  onChange={(e) => setDateEndStr(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>Ura začetka</FieldLabel>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#18201B]/35" />
                  <input
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="19:00"
                    className={`${inputCls} pl-9`}
                  />
                </div>
              </div>
              <div>
                <FieldLabel hint="opcijsko">Ura konca</FieldLabel>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#18201B]/35" />
                  <input
                    value={timeEnd}
                    onChange={(e) => setTimeEnd(e.target.value)}
                    placeholder="22:00"
                    className={`${inputCls} pl-9`}
                  />
                </div>
              </div>
            </div>
          </Section>

          <Section
            icon={<AlignLeft className="size-5" />}
            title="Opis"
            description="Kratek opis je viden na kartici, dolgi pa na strani dogodka."
          >
            <div>
              <FieldLabel hint={`${description.length} znakov`}>Kratek opis</FieldLabel>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="V nekaj stavkih povej, kaj lahko obiskovalec pričakuje."
                className={inputCls}
              />
            </div>
            <div>
              <FieldLabel hint="opcijsko">Dolgi opis</FieldLabel>
              <textarea
                rows={6}
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                placeholder="Podrobnejši opis, program, urnik, razstavljavci..."
                className={inputCls}
              />
            </div>
          </Section>

          <Section
            icon={<Tag className="size-5" />}
            title="Filter na kartici"
            description="Izberi en filter — prikazan bo na kartici in strani dogodka."
          >
            <div>
              <FieldLabel>Filter</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {CRM_CARD_FILTERS.map((f) => (
                  <FilterPill
                    key={f}
                    label={f}
                    value={f}
                    selected={cardFilter === f}
                    onClick={() => setCardFilter(f)}
                  />
                ))}
              </div>
            </div>
          </Section>

          <Section
            icon={<MapPin className="size-5" />}
            title="Lokacija"
            description="Besedilo lokacije. URL zemljevida je opcijski — če ga pustiš prazen, ob shranitvi uporabimo privzeti zemljevid okolice Nazarij."
          >
            <div>
              <FieldLabel>Lokacija (besedilo)</FieldLabel>
              <input
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="npr. Osrednji trg, Nazarje"
                className={inputCls}
              />
            </div>
            <div>
              <FieldLabel hint="opcijsko · iframe embed">URL zemljevida</FieldLabel>
              <input
                value={locationMapUrl}
                onChange={(e) => setLocationMapUrl(e.target.value)}
                placeholder="Pusti prazno za privzeti zemljevid ali prilepi svoj OpenStreetMap embed URL …"
                className={inputCls}
              />
              <p className="text-[11px] text-[#18201B]/45 mt-1.5 leading-snug">
                Privzeti URL se ne prikaže v polju, da ostane pregledno — shranjen je v podatku dogodka, če polje ostane prazno.
              </p>
            </div>
          </Section>

          <Section
            icon={<ImageIconLu className="size-5" />}
            title="Slika dogodka"
            description="Naloži fotografijo (JPEG, PNG, WebP ali GIF). Prikaže se na kartici in strani dogodka."
          >
            <div>
              <FieldLabel hint="opcijsko">Slika dogodka</FieldLabel>
              <input
                ref={imageInputRef}
                type="file"
                accept={EVENT_IMAGE_ACCEPT}
                onChange={onImageFileChange}
                disabled={saving || uploadingImage}
                className="block w-full text-sm text-[#18201B] file:mr-3 file:rounded-lg file:border-0 file:bg-[#EAF1EA] file:px-3 file:py-2 file:text-sm file:font-medium file:text-[#2F5D46] hover:file:bg-[#dce8dc] disabled:opacity-60"
              />
              {selectedImageFile && (
                <p className="text-[11px] text-[#18201B]/55 mt-1.5 truncate">
                  Izbrana datoteka: {selectedImageFile.name}
                </p>
              )}
              {uploadingImage && (
                <p className="text-sm text-[#2F5D46] font-medium mt-2">Nalagam sliko…</p>
              )}
              {previewImageUrl && (
                <div className="mt-3 rounded-lg overflow-hidden border border-[#18201B]/10 bg-[#EAF1EA] aspect-[16/7]">
                  <img
                    src={previewImageUrl}
                    alt="Predogled slike"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </Section>

          <Section
            icon={<Paperclip className="size-5" />}
            title="PDF priponke"
            description="Dodaj enega ali več PDF dokumentov (npr. program dogodka). Datoteke se naložijo na strežnik ob shranjevanju."
          >
            <div>
              <FieldLabel hint="več datotek">PDF dokumenti</FieldLabel>
              <input
                ref={documentInputRef}
                type="file"
                accept={EVENT_DOCUMENT_ACCEPT}
                multiple
                onChange={onDocumentFileChange}
                disabled={saving || uploadingDocuments}
                className="block w-full text-sm text-[#18201B] file:mr-3 file:rounded-lg file:border-0 file:bg-[#EAF1EA] file:px-3 file:py-2 file:text-sm file:font-medium file:text-[#2F5D46] hover:file:bg-[#dce8dc] disabled:opacity-60"
              />
              {uploadingDocuments && (
                <p className="text-sm text-[#2F5D46] font-medium mt-2">Nalagam PDF…</p>
              )}
            </div>
            {attachmentItems.length > 0 && (
              <ul className="space-y-2">
                {attachmentItems.map((item) => (
                  <li
                    key={item.key}
                    className="flex items-center gap-3 rounded-lg border border-[#18201B]/10 bg-[#FAFAF8] px-3 py-2.5"
                  >
                    <span className="inline-flex size-8 items-center justify-center rounded-lg bg-red-50 border border-red-100 shrink-0">
                      <FileText className="size-4 text-red-500" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#18201B] truncate">{item.name}</p>
                      {item.pendingFile ? (
                        <p className="text-[11px] text-[#2F5D46]">Čaka naložitev ob shranjevanju</p>
                      ) : item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-[#3D6F7A] hover:underline truncate block"
                        >
                          {item.url}
                        </a>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(item.key)}
                      disabled={saving || uploadingDocuments}
                      className="inline-flex size-8 items-center justify-center rounded-lg text-[#18201B]/45 hover:text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50 shrink-0"
                      aria-label={`Odstrani ${item.name}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          {saveError && (
            <p className="text-sm text-red-700 rounded-lg bg-red-50 border border-red-100 px-4 py-3">
              {saveError}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving || uploadingImage || uploadingDocuments}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2F5D46] px-5 py-3 text-white text-sm font-medium shadow-sm hover:bg-[#1E3A2F] transition-colors disabled:opacity-60"
            >
              <Save className="size-4" />
              {uploadingImage
                ? 'Nalagam sliko…'
                : uploadingDocuments
                  ? 'Nalagam PDF…'
                  : saving
                  ? 'Shranjujem…'
                  : isEdit
                    ? 'Shrani spremembe'
                    : 'Shrani dogodek'}
            </button>
            <Link
              to={backPath}
              className="inline-flex items-center gap-2 rounded-xl border border-[#18201B]/15 bg-white px-5 py-3 text-sm text-[#18201B] hover:bg-[#F7F4EE] transition-colors"
            >
              <X className="size-4" />
              Prekliči
            </Link>
            {isEdit && (
              <button
                type="button"
                disabled={saving}
                onClick={onDelete}
                className="ml-auto inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-800 hover:bg-red-100 transition-colors disabled:opacity-60"
              >
                <Trash2 className="size-4" />
                Izbriši
              </button>
            )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-20 self-start">
          <div className="rounded-2xl border border-[#18201B]/10 bg-white shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-0">
              <span className="text-xs uppercase tracking-widest text-[#18201B]/50">Predogled</span>
              <span className="text-[11px] text-[#18201B]/40 italic">v živo</span>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-4 pt-3 pb-0">
              {(
                [
                  { id: 'card', label: 'Kartica' },
                  { id: 'detail', label: 'Stran dogodka' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPreviewTab(tab.id)}
                  className={`flex-1 rounded-lg py-2 text-[13px] font-medium transition-colors ${
                    previewTab === tab.id
                      ? 'bg-[#2F5D46] text-white shadow-sm'
                      : 'bg-[#F7F4EE] text-[#18201B]/65 hover:text-[#18201B]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Preview body */}
            <div className="p-4">
              {previewTab === 'card' ? (
                <div className="bg-[#EAF1EA] rounded-xl p-4">
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
                </div>
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

            <p className="text-[11px] text-[#18201B]/40 text-center pb-4 px-4 leading-snug">
              {previewTab === 'card'
                ? 'Kartica na domači strani med prihajajočimi dogodki.'
                : 'Stran, ki jo obiskovalec vidi, ko klikne »Preberi več«.'}
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
