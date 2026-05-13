import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Tag, CalendarDays } from 'lucide-react';
import { categoryColorHex } from '../../../data/events';

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
    <div className="w-full flex flex-col lg:flex-row gap-0 bg-white rounded-2xl shadow-md border border-[#1E3A2F]/8 overflow-hidden">
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
          <div className="flex items-center gap-1">
            <button
              onClick={previousMonth}
              className="w-7 h-7 flex items-center justify-center hover:bg-[#EAF1EA] rounded-lg transition-colors"
              aria-label="Prejšnji mesec"
            >
              <ChevronLeft className="w-4 h-4 text-[#1E3A2F]" />
            </button>
            <button
              onClick={() => {
                setCurrentDate(new Date());
                setSelectedDay(new Date().getDate());
              }}
              className="px-2.5 h-7 text-xs text-[#2F5D46] bg-[#EAF1EA] hover:bg-[#d4e8d4] rounded-lg transition-colors"
            >
              Danes
            </button>
            <button
              onClick={nextMonth}
              className="w-7 h-7 flex items-center justify-center hover:bg-[#EAF1EA] rounded-lg transition-colors"
              aria-label="Naslednji mesec"
            >
              <ChevronRight className="w-4 h-4 text-[#1E3A2F]" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-1.5 mb-4 pb-3 border-b border-[#1E3A2F]/8">
          {[
            { color: '#9B3A32', label: 'Nujni' },
              { color: categoryColorHex('Kultura'), label: 'Kultura' },
              { color: categoryColorHex('Šport'), label: 'Šport' },
              { color: categoryColorHex('Sejem'), label: 'Sejem' },
              { color: categoryColorHex('Delavnica'), label: 'Delavnica' },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#F7F4EE]"
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-[10px]" style={{ color: item.color }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 mb-1">
          {dayNames.map((day, i) => (
            <div
              key={day}
              className={`text-center text-[11px] py-1 uppercase tracking-widest ${
                i >= 5 ? 'text-[#9B3A32]/50' : 'text-[#3D6F7A]/60'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 flex-1 content-start">
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

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(isSelected ? null : day)}
                className={`relative h-16 flex flex-col items-center justify-start pt-1.5 px-1 rounded-xl transition-all cursor-pointer
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
                <span
                  className={`text-sm leading-none transition-colors mb-0.5 font-semibold
                    ${isSelected
                      ? 'text-white'
                      : isTodayDate
                      ? 'text-[#2F5D46]'
                      : isWeekend
                      ? 'text-[#9B3A32]/60'
                      : 'text-[#18201B]/80'}
                  `}
                >
                  {day}
                </span>

                {/* Event title under the day number */}
                {hasEvents && (
                  <p
                    className="text-[9px] leading-tight text-center line-clamp-2 w-full px-0.5"
                    style={{ color: isSelected ? 'rgba(255,255,255,0.9)' : eventColor }}
                  >
                    {firstEvent.title}
                  </p>
                )}

                {/* Multiple events indicator */}
                {dayEvents.length > 1 && (
                  <div
                    className="absolute bottom-1 right-1 text-[8px] px-1 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: isSelected ? 'rgba(0,0,0,0.2)' : eventColor }}
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
      <div className="hidden lg:block w-px bg-[#1E3A2F]/8 self-stretch" />
      <div className="lg:hidden h-px bg-[#1E3A2F]/8 mx-5" />

      {/* Right: Event Panel */}
      <div className="w-full lg:w-64 xl:w-72 p-5 lg:p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm text-[#18201B]/60 uppercase tracking-widest">{panelTitle}</h3>
          {selectedEvents.length === 0 && (
            <span className="text-[11px] text-[#18201B]/40">{monthEvents.length} skupaj</span>
          )}
        </div>

        {displayEvents.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
            <CalendarDays className="w-8 h-8 text-[#18201B]/15 mb-2" />
            <p className="text-sm text-[#18201B]/40">Ni dogodkov</p>
            <p className="text-[11px] text-[#18201B]/30 mt-0.5">za izbrani dan</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto">
            {displayEvents.map((event) => {
              const color = event.isImportant ? '#9B3A32' : categoryColorHex(event.category);
              return (
                <div
                  key={event.id}
                  className="group flex gap-3 p-3 rounded-xl hover:bg-[#F7F4EE] transition-colors cursor-pointer"
                  onClick={() => onEventClick?.(event.id)}
                >
                  <div
                    className="w-0.5 rounded-full shrink-0 self-stretch"
                    style={{ backgroundColor: color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#18201B] leading-snug line-clamp-2 group-hover:text-[#1E3A2F] transition-colors">
                      {event.title}
                    </p>
                    <div className="flex flex-wrap gap-x-2.5 gap-y-0.5 mt-1.5">
                      {selectedEvents.length === 0 && (
                        <span className="text-[11px] text-[#18201B]/50 flex items-center gap-1">
                          <CalendarDays className="w-3 h-3" />
                          {event.date.getDate()}. {monthNames[event.date.getMonth()]}
                        </span>
                      )}
                      {event.time && (
                        <span className="text-[11px] text-[#18201B]/50 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {event.time}
                        </span>
                      )}
                      <span
                        className="text-[11px] flex items-center gap-1"
                        style={{ color }}
                      >
                        <Tag className="w-3 h-3" />
                        {event.category}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {selectedEvents.length === 0 && monthEvents.length > 4 && (
          <button className="mt-3 text-xs text-[#3D6F7A] hover:text-[#2F5D46] transition-colors self-start">
            Vsi dogodki →
          </button>
        )}

        {/* Newsletter CTA */}
        
      </div>
    </div>
  );
}