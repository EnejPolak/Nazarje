import { Link } from 'react-router';
import { Plus, Calendar as CalendarIcon, Clock, MapPin, AlertTriangle, Sparkles } from 'lucide-react';
import { useCrmEventsList } from '../data/event-store';
import { categoryBadgeBgClass } from '../data/events';

function formatDate(d: Date) {
  return d.toLocaleDateString('sl-SI', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function CrmDashboard() {
  const events = useCrmEventsList();
  const sorted = events.slice().sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#2F5D46] font-medium">CRM</p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#18201B] tracking-tight mt-1">
            Moji dogodki
          </h1>
          <p className="text-sm text-[#18201B]/60 mt-1">
            Tukaj so dogodki, ki si jih dodal ti — prikazani so tudi na javni strani skupaj s privzetimi.
          </p>
        </div>
        <Link
          to="/admin/crm/nov"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2F5D46] px-5 py-3 text-white text-sm font-medium shadow-sm hover:bg-[#1E3A2F] transition-colors"
        >
          <Plus className="size-4" />
          Nov dogodek
        </Link>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#18201B]/20 bg-white p-12 text-center">
          <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#EAF1EA] text-[#2F5D46] mb-4">
            <Sparkles className="size-6" />
          </div>
          <h2 className="text-lg font-semibold text-[#18201B] mb-1">Še nimaš dogodkov</h2>
          <p className="text-sm text-[#18201B]/60 mb-5 max-w-sm mx-auto">
            Ustvari prvi dogodek. Med tipkanjem bo desno od obrazca viden <strong>živi predogled</strong> kartice.
          </p>
          <Link
            to="/admin/crm/nov"
            className="inline-flex items-center gap-2 rounded-xl bg-[#2F5D46] px-5 py-2.5 text-white text-sm font-medium hover:bg-[#1E3A2F] transition-colors"
          >
            <Plus className="size-4" />
            Ustvari prvega
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sorted.map((e) => (
            <li key={e.id}>
              <Link
                to={`/admin/crm/dogodek/${e.id}`}
                className="block h-full rounded-2xl border border-[#18201B]/10 bg-white p-4 hover:border-[#2F5D46]/30 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-base font-medium text-[#18201B] flex-1 min-w-0 pr-1">
                    {e.title}
                  </h3>
                  <div className="flex flex-wrap justify-end gap-1.5 shrink-0 max-w-[55%]">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] text-white whitespace-nowrap ${categoryBadgeBgClass(e.category)}`}
                    >
                      {e.category}
                    </span>
                    {e.isImportant && (
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] text-white whitespace-nowrap inline-flex items-center gap-1 ${
                          e.secondaryFilter ? categoryBadgeBgClass(e.secondaryFilter) : 'bg-[#9B3A32]'
                        }`}
                      >
                        {!e.secondaryFilter && <AlertTriangle className="size-3" />}
                        {e.secondaryFilter || 'Nujno'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-1 text-[13px] text-[#18201B]/65">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="size-3.5 text-[#3D6F7A]" />
                    <span>{formatDate(e.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-3.5 text-[#3D6F7A]" />
                    <span>{e.timeEnd ? `${e.time} – ${e.timeEnd}` : e.time}</span>
                  </div>
                  {e.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="size-3.5 text-[#3D6F7A]" />
                      <span className="truncate">{e.location}</span>
                    </div>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
