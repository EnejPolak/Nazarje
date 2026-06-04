import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Tag, CalendarDays } from 'lucide-react';
import { categoryColorHex } from '../../../data/events';
import { formatAriaDate } from '../../../utils/a11y-date';

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  category: string;
  isImportant?: boolean;
  time?: string;
}

interface EventCalendarProps {
  events: CalendarEvent[];
  onEventClick?: (id: string) => void;
}

export function EventCalendar({ events, onEventClick }: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());

  const monthNames = [
    'Januar', 'Februar', 'Marec', 'April', 'Maj', 'Junij',
    'Julij', 'Avgust', 'September', 'Oktober', 'November', 'December',
  ];
  const dayNames = ['Pon', 'Tor', 'Sre', 'Čet', 'Pet', 'Sob', 'Ned'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    return { daysInMonth, startingDayOfWeek };
  };

  const getEventsForDate = (date: Date) =>
    events.filter(
      (e) =>
        e.date.getDate() === date.getDate() &&
        e.date.getMonth() === date.getMonth() &&
        e.date.getFullYear() === date.getFullYear()
    );

  const previousMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: startingDayOfWeek }, (_, i) => i);

  const today = new Date();
  const isToday = (day: number) =>
    day === today.getDate() &&
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear();

  const dayNumberColor = (isWeekend: boolean, isTodayDate: boolean, isSelected: boolean) => {
    if (isSelected) return 'text-white';
    if (isTodayDate) return 'text-[#2F5D46]';
    return isWeekend ? 'text-[#9ca39f]' : 'text-[#5a5f5c]';
  };

  const selectedDate = selectedDay
    ? new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay)
    : null;
  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  const monthEvents = events
    .filter(
      (e) =>
        e.date.getMonth() === currentDate.getMonth() &&
        e.date.getFullYear() === currentDate.getFullYear()
    )
    .sort((a, b) => a.date.getDate() - b.date.getDate());

  const displayEvents = selectedEvents.length > 0 ? selectedEvents : monthEvents.slice(0, 4);
  const panelTitle = selectedEvents.length > 0
    ? `${selectedDay} ${monthNames[currentDate.getMonth()]}`
    : 'Prihajajoči dogodki';

  return (
    <section
      className="w-full flex flex-col lg:flex-row gap-0 bg-white shadow-md border border-[#1E3A2F]/8 overflow-hidden"
      aria-label="Koledar dogodkov"
    >
      {/* Left: Calendar */}
      <div className="flex-1 p-5 lg:p-6 min-w-0 flex flex-col">
        {/* Calendar Header */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-xl text-[#1E3A2F] tracking-tight leading-tight">
              {monthNames[currentDate.getMonth()]}
              <span className="text-sm text-[#18201B]/25 ml-2">{currentDate.getFullYear()}</span>
            </h2>
            <p className="text-[11px] text-[#3D6F7A]/70 mt-0.5 tracking-wide">
              Kliknite na dan za podrobnosti
            </p>
          </div>
          <nav
            className="flex items-center gap-0 shrink-0"
            aria-label="Navigacija po mesecih"
          >
            <button
              type="button"
              onClick={previousMonth}
              className="flex size-9 items-center justify-center rounded-full text-[#18201B] transition-colors hover:text-[#2F5D46] hover:bg-[#F7F4EE]"
              aria-label="Prejšnji mesec"
            >
              <ChevronLeft className="size-5" strokeWidth={2.25} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentDate(new Date());
                setSelectedDay(new Date().getDate());
              }}
              className="min-w-[4.5rem] px-2 py-1.5 text-sm font-bold tracking-tight text-[#18201B] transition-colors hover:text-[#2F5D46]"
              aria-label="Prikaži tekoči mesec in današnji dan"
            >
              Danes
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="flex size-9 items-center justify-center rounded-full text-[#18201B] transition-colors hover:text-[#2F5D46] hover:bg-[#F7F4EE]"
              aria-label="Naslednji mesec"
            >
              <ChevronRight className="size-5" strokeWidth={2.25} aria-hidden />
            </button>
          </nav>
        </div>

        {/* Legend — barva + besedilo (ne samo barva) */}
        <ul
          className="flex flex-wrap gap-1.5 mb-4 pb-3 border-b border-[#1E3A2F]/8 list-none m-0 p-0"
          aria-label="Legenda kategorij dogodkov"
        >
          {[
            { color: '#9B3A32', label: 'Nujni' },
            { color: categoryColorHex('Kultura'), label: 'Kultura' },
            { color: categoryColorHex('Šport'), label: 'Šport' },
            { color: categoryColorHex('Sejem'), label: 'Sejem' },
            { color: categoryColorHex('Delavnica'), label: 'Delavnica' },
          ].map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-1.5 px-2 py-0.5 bg-[#F7F4EE]"
            >
              <span className="w-1.5 h-1.5 shrink-0" style={{ backgroundColor: item.color }} aria-hidden />
              <span className="text-[10px]" style={{ color: item.color }}>
                {item.label}
              </span>
            </li>
          ))}
        </ul>

        {/* Day Names */}
        <div className="grid grid-cols-7 mb-1" role="row">
          {dayNames.map((day, i) => (
            <div
              key={day}
              role="columnheader"
              className={`text-center text-[11px] py-1 uppercase tracking-widest font-medium ${
                i >= 5 ? 'text-[#5a5f5c]' : 'text-[#18201B]'
              }`}
            >
              <abbr title={day} className="no-underline">
                {day}
              </abbr>
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div
          className="grid grid-cols-7 gap-1 flex-1 content-start"
          role="grid"
          aria-label={`Dnevi v mesecu ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
        >
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="h-16" />
          ))}
          {days.map((day) => {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dayEvents = getEventsForDate(date);
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            const isTodayDate = isToday(day);
            const isSelected = selectedDay === day;
            const hasEvents = dayEvents.length > 0;
            const firstEvent = dayEvents[0];
            const eventColor = hasEvents
              ? firstEvent.isImportant
                ? '#9B3A32'
                : categoryColorHex(firstEvent.category)
              : '';

            const ariaDayLabel = [
              formatAriaDate(date),
              hasEvents
                ? `${dayEvents.length} ${dayEvents.length === 1 ? 'dogodek' : 'dogodki'}`
                : 'brez dogodkov',
              isTodayDate ? 'danes' : '',
              isSelected ? 'izbrano' : '',
            ]
              .filter(Boolean)
              .join(', ');

            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(isSelected ? null : day)}
                aria-label={ariaDayLabel}
                aria-pressed={isSelected}
                className={`event-calendar-day relative h-16 flex items-center justify-center px-1 transition-all cursor-pointer
                  ${isSelected
                    ? hasEvents ? '' : 'bg-[#1E3A2F]'
                    : isTodayDate
                    ? 'bg-[#EAF1EA]'
                    : 'hover:bg-[#F7F4EE]'}
                `}
                style={
                  isSelected && hasEvents
                    ? { backgroundColor: eventColor, border: `2px solid ${eventColor}` }
                    : hasEvents && !isSelected
                    ? { border: `2px solid ${eventColor}` }
                    : undefined
                }
              >
                {hasEvents ? (
                  <div className="flex flex-col items-center justify-center gap-1 text-center w-full max-w-full px-1 pointer-events-none">
                    <span
                      className={`text-sm leading-none font-semibold ${dayNumberColor(isWeekend, isTodayDate, isSelected)}`}
                    >
                      {day}
                    </span>
                    <p
                      className={`text-[10px] leading-snug line-clamp-2 w-full font-bold tracking-tight ${
                        isSelected ? 'text-white' : 'text-[#18201B]'
                      }`}
                      style={
                        isSelected
                          ? { textShadow: '0 1px 2px rgba(0,0,0,0.2)' }
                          : undefined
                      }
                    >
                      {firstEvent.title}
                    </p>
                  </div>
                ) : (
                  <span
                    className={`text-sm leading-none font-semibold ${dayNumberColor(isWeekend, isTodayDate, isSelected)}`}
                  >
                    {day}
                  </span>
                )}

                {dayEvents.length > 1 && (
                  <div
                    className="absolute top-0.5 right-0.5 text-[8px] px-1 py-0.5 leading-none text-white pointer-events-none"
                    style={{ backgroundColor: isSelected ? 'rgba(0,0,0,0.25)' : eventColor }}
                  >
                    +{dayEvents.length - 1}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="hidden lg:block w-px bg-[#1E3A2F]/8 self-stretch" aria-hidden />
      <div className="lg:hidden h-px bg-[#1E3A2F]/8 mx-5" aria-hidden />

      {/* Right: Event Panel */}
      <aside
        className="w-full lg:w-72 xl:w-80 p-5 lg:p-6 flex flex-col shrink-0"
        aria-labelledby="calendar-events-panel-title"
        aria-live="polite"
      >
        <div className="mb-4 min-w-0">
          <h3
            id="calendar-events-panel-title"
            className="text-base font-semibold text-[#18201B]/60 uppercase tracking-wide whitespace-nowrap"
          >
            {panelTitle}
          </h3>
        </div>

        {displayEvents.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
            <CalendarDays className="w-8 h-8 text-[#18201B]/15 mb-2" aria-hidden />
            <p className="text-sm text-[#18201B]/40">Ni dogodkov</p>
            <p className="text-[11px] text-[#18201B]/30 mt-0.5">za izbrani dan</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2.5 flex-1 overflow-y-auto list-none m-0 p-0">
            {displayEvents.map((event) => {
              const color = event.isImportant ? '#9B3A32' : categoryColorHex(event.category);
              const eventAria = `${event.title}, ${formatAriaDate(event.date)}${event.time ? `, ${event.time}` : ''}, ${event.category}`;
              return (
                <li key={event.id}>
                  <button
                    type="button"
                    className="group flex gap-3 p-3 hover:bg-[#F7F4EE] transition-colors cursor-pointer w-full text-left"
                    onClick={() => onEventClick?.(event.id)}
                    aria-label={`Odpri dogodek: ${eventAria}`}
                  >
                    <div
                      className="w-0.5 shrink-0 self-stretch"
                      style={{ backgroundColor: color }}
                      aria-hidden
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#18201B] leading-snug line-clamp-2 group-hover:text-[#1E3A2F] transition-colors">
                        {event.title}
                      </p>
                      <div className="flex flex-wrap gap-x-2.5 gap-y-0.5 mt-1.5">
                        {selectedEvents.length === 0 && (
                          <span className="text-[11px] text-[#18201B]/50 flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" aria-hidden />
                            {event.date.getDate()}. {monthNames[event.date.getMonth()]}
                          </span>
                        )}
                        {event.time && (
                          <span className="text-[11px] text-[#18201B]/50 flex items-center gap-1">
                            <Clock className="w-3 h-3" aria-hidden />
                            {event.time}
                          </span>
                        )}
                        <span
                          className="text-[11px] flex items-center gap-1"
                          style={{ color }}
                        >
                          <Tag className="w-3 h-3" aria-hidden />
                          {event.category}
                        </span>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {selectedEvents.length === 0 && monthEvents.length > 4 && (
          <button
            type="button"
            className="mt-3 text-xs text-[#3D6F7A] hover:text-[#2F5D46] transition-colors self-start"
            aria-label="Prikaži vse dogodke na strani vsi dogodki"
          >
            Vsi dogodki →
          </button>
        )}
      </aside>
    </section>
  );
}