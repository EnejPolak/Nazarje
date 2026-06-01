import { FormEvent, ReactNode, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router';
import {
  AlignLeft,
  AlertTriangle,
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
} from '../api/admin';
import { newCrmEventId, toDateInputValue } from '../api/mappers';
import { ApiError } from '../api/client';
import { CRM_CATEGORIES, DEFAULT_MAP_EMBED } from './crm-constants';
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
  const [category, setCategory] = useState<string>('Kultura');
  const [secondaryFilter, setSecondaryFilter] = useState<string>('');
  const [location, setLocation] = useState('');
  const [locationMapUrl, setLocationMapUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [attachName, setAttachName] = useState('');
  const [attachUrl, setAttachUrl] = useState('');
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
        setCategory(existing.category);
        setSecondaryFilter(existing.secondaryFilter ?? '');
        setLocation(existing.location);
        setLocationMapUrl(existing.locationMapUrl ?? '');
        setImageUrl(existing.imageUrl ?? '');
        setIsImportant(Boolean(existing.isImportant));
        setPublished(existing.published !== false);
        setSlug(existing.slug ?? '');
        const a = existing.attachments?.[0];
        setAttachName(a?.name ?? '');
        setAttachUrl(a?.url ?? '');
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
  const hasAttachment = Boolean(attachName.trim() && attachUrl.trim());

  const buildPayload = (eventId: string): EventData => {
    const date = fromDateInput(dateStr) ?? new Date();
    const dateEnd = fromDateInput(dateEndStr) ?? undefined;
    const attachments = hasAttachment
      ? [{ name: attachName.trim(), url: attachUrl.trim() }]
      : undefined;

    return {
      id: eventId,
      title: title.trim(),
      date,
      dateEnd,
      time: time.trim(),
      timeEnd: timeEnd.trim() || undefined,
      description: description.trim(),
      longDescription: longDescription.trim() || description.trim(),
      category,
      secondaryFilter:
        isImportant && secondaryFilter.trim() ? secondaryFilter.trim() : undefined,
      location: location.trim(),
      locationMapUrl: locationMapUrl.trim() || DEFAULT_MAP_EMBED,
      isImportant,
      imageUrl: imageUrl.trim() || undefined,
      attachments,
      published,
      slug: slug.trim() || undefined,
    };
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setSaving(true);
    try {
      const eventId = isEdit && id ? id : newCrmEventId();
      const payload = buildPayload(eventId);
      const saved = isEdit
        ? await adminUpdateEvent(payload)
        : await adminCreateEvent(payload);
      navigate(`/admin/dashboard/dogodek/${saved.id}`, {
        replace: true,
        state: { from: backPath },
      });
    } catch (err) {
      setSaveError(
        err instanceof ApiError
          ? err.message
          : 'Shranjevanje ni uspelo. Preveri admin API na strežniku.'
      );
    } finally {
      setSaving(false);
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
            title="Filtri na kartici"
            description="Izberi eno kategorijo. Če je dogodek nujen, lahko dodaš še en filter."
          >
            <div>
              <FieldLabel>Glavni filter (kategorija)</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {CRM_CATEGORIES.map((c) => (
                  <FilterPill
                    key={c}
                    label={c}
                    value={c}
                    selected={category === c}
                    onClick={() => setCategory(c)}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[#18201B]/10 bg-[#F7F4EE]/60 p-3">
              <button
                type="button"
                onClick={() => {
                  const v = !isImportant;
                  setIsImportant(v);
                  if (!v) setSecondaryFilter('');
                }}
                aria-pressed={isImportant}
                className={`w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                  isImportant
                    ? 'bg-[#9B3A32] text-white'
                    : 'bg-white text-[#18201B] border border-[#18201B]/10 hover:border-[#9B3A32]/40'
                }`}
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <AlertTriangle className="size-4" />
                  Nujen / pomemben dogodek
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] ${
                    isImportant ? 'bg-white/20' : 'bg-[#18201B]/5 text-[#18201B]/55'
                  }`}
                >
                  {isImportant ? 'Vklopljeno' : 'Izklopljeno'}
                </span>
              </button>

              {isImportant && (
                <div className="mt-3 pt-3 border-t border-[#18201B]/10">
                  <FieldLabel hint="opcijsko">Drugi filter</FieldLabel>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setSecondaryFilter('')}
                      aria-pressed={secondaryFilter === ''}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                        secondaryFilter === ''
                          ? 'bg-[#9B3A32] text-white border-[#9B3A32]'
                          : 'bg-white text-[#18201B] border-[#18201B]/15 hover:border-[#9B3A32]/40'
                      }`}
                    >
                      <AlertTriangle className="size-3.5" />
                      Samo «Nujno»
                    </button>
                    {CRM_CATEGORIES.map((c) => (
                      <FilterPill
                        key={c}
                        label={c}
                        value={c}
                        selected={secondaryFilter === c}
                        onClick={() =>
                          setSecondaryFilter((prev) => (prev === c ? '' : c))
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
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
            title="Slika"
            description="URL naslovne fotografije, ki se prikaže na kartici in v heroju."
          >
            <div>
              <FieldLabel hint="opcijsko">URL slike</FieldLabel>
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className={inputCls}
              />
              {imageUrl && (
                <div className="mt-3 rounded-lg overflow-hidden border border-[#18201B]/10 bg-[#EAF1EA] aspect-[16/7]">
                  <img src={imageUrl} alt="Predogled slike" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </Section>

          <Section
            icon={<Paperclip className="size-5" />}
            title="Priloga"
            description="Opcijska ena datoteka (npr. program v PDF)."
          >
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <FieldLabel>Ime datoteke</FieldLabel>
                <input
                  value={attachName}
                  onChange={(e) => setAttachName(e.target.value)}
                  placeholder="npr. Program sejma (PDF)"
                  className={inputCls}
                />
              </div>
              <div>
                <FieldLabel>Povezava</FieldLabel>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#18201B]/35" />
                  <input
                    value={attachUrl}
                    onChange={(e) => setAttachUrl(e.target.value)}
                    placeholder="https://..."
                    className={`${inputCls} pl-9`}
                  />
                </div>
              </div>
            </div>
          </Section>

          {saveError && (
            <p className="text-sm text-red-700 rounded-lg bg-red-50 border border-red-100 px-4 py-3">
              {saveError}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2F5D46] px-5 py-3 text-white text-sm font-medium shadow-sm hover:bg-[#1E3A2F] transition-colors disabled:opacity-60"
            >
              <Save className="size-4" />
              {saving ? 'Shranjujem…' : isEdit ? 'Shrani spremembe' : 'Shrani dogodek'}
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
                    category={category}
                    secondaryFilter={isImportant ? secondaryFilter || undefined : undefined}
                    isImportant={isImportant}
                    imageUrl={imageUrl.trim() || undefined}
                    location={location}
                    hasAttachment={hasAttachment}
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
                  category={category}
                  secondaryFilter={isImportant ? secondaryFilter || undefined : undefined}
                  isImportant={isImportant}
                  imageUrl={imageUrl.trim() || undefined}
                  location={location}
                  attachName={attachName}
                  attachUrl={attachUrl}
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
