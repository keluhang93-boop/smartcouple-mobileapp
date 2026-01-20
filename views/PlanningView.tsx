
import React, { useState } from 'react';
import { CalendarEvent, UserSettings } from '../types';
import { Plus, ChevronLeft, ChevronRight, MapPin, Clock, Info, Tag, X, Calendar as CalendarIcon, LayoutList, Columns } from 'lucide-react';

interface PlanningViewProps {
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  settings: UserSettings;
}

const PlanningView: React.FC<PlanningViewProps> = ({ events, setEvents, settings }) => {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());
  const [isAdding, setIsAdding] = useState(false);
  const [calendarMode, setCalendarMode] = useState<'month' | 'week'>('month');
  
  const [form, setForm] = useState({
    title: '',
    date: new Date().toLocaleDateString('en-CA'),
    time: '20:00',
    place: '',
    desc: '',
    category: settings.eventCategories[0] || 'Moments Ensemble'
  });

  const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    if (calendarMode === 'month') {
      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    } else {
      setViewDate(new Date(viewDate.getTime() - 7 * 24 * 60 * 60 * 1000));
    }
  };

  const handleNextMonth = () => {
    if (calendarMode === 'month') {
      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    } else {
      setViewDate(new Date(viewDate.getTime() + 7 * 24 * 60 * 60 * 1000));
    }
  };

  const addEvent = () => {
    if (!form.title || !form.date) return;
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      ...form
    };
    setEvents([...events, newEvent]);
    setIsAdding(false);
    setForm({
      title: '',
      date: new Date().toLocaleDateString('en-CA'),
      time: '20:00',
      place: '',
      desc: '',
      category: settings.eventCategories[0] || 'Moments Ensemble'
    });
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const getEventForDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    // Sorting by time here
    return events
      .filter(e => e.date === dateStr)
      .sort((a, b) => (a.time || '00:00').localeCompare(b.time || '00:00'));
  };

  const daysInMonth = getDaysInMonth(viewDate.getMonth(), viewDate.getFullYear());
  const firstDay = getFirstDayOfMonth(viewDate.getMonth(), viewDate.getFullYear());
  const offset = firstDay === 0 ? 6 : firstDay - 1;

  const getWeekDays = () => {
    const tempDate = new Date(viewDate);
    const day = tempDate.getDay();
    const diff = tempDate.getDate() - day + (day === 0 ? -6 : 1); 
    const startOfWeek = new Date(tempDate.setDate(diff));
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  };

  const currentWeekDays = getWeekDays();

  const monthStart = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const monthEnd = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
  
  const monthlyAgendaEvents = events
    .filter(e => {
      const ed = new Date(e.date + 'T00:00:00');
      return ed >= monthStart && ed <= monthEnd;
    })
    .sort((a, b) => {
      // Primary sort by date
      const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateDiff !== 0) return dateDiff;
      // Secondary sort by time
      return (a.time || '00:00').localeCompare(b.time || '00:00');
    });

  return (
    <div className="p-6 space-y-6 animate-in slide-in-from-right duration-500 pb-24">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif text-[var(--primary-color)]">Smart Planning</h1>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Vos moments précieux</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setCalendarMode(calendarMode === 'month' ? 'week' : 'month')}
            className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center active:scale-95 transition-transform"
          >
            {calendarMode === 'month' ? <Columns size={20} /> : <CalendarIcon size={20} />}
          </button>
          <button 
            onClick={() => setIsAdding(true)}
            className="w-12 h-12 bg-slate-900 text-[var(--secondary-color)] rounded-2xl shadow-xl flex items-center justify-center active:scale-95 transition-transform"
          >
            <Plus size={28} />
          </button>
        </div>
      </header>

      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-8 px-2">
          <button onClick={handlePrevMonth} className="p-2 text-gray-300 active:text-[var(--primary-color)] transition-colors"><ChevronLeft size={20} /></button>
          <h2 className="font-bold text-[var(--primary-color)] uppercase tracking-[0.2em] text-[10px]">
            {calendarMode === 'month' ? `${months[viewDate.getMonth()]} ${viewDate.getFullYear()}` : `Semaine du ${currentWeekDays[0].getDate()} ${months[currentWeekDays[0].getMonth()]}`}
          </h2>
          <button onClick={handleNextMonth} className="p-2 text-gray-300 active:text-[var(--primary-color)] transition-colors"><ChevronRight size={20} /></button>
        </div>

        <div className="grid grid-cols-7 text-center mb-4">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(d => (
            <span key={d} className="text-[10px] font-bold text-gray-300">{d}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-3">
          {calendarMode === 'month' ? (
            <>
              {Array.from({ length: offset }).map((_, i) => <div key={`off-${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
                const dateEvents = getEventForDate(d);
                const isToday = new Date().toDateString() === d.toDateString();
                const isSelected = selectedDay === day;

                return (
                  <div 
                    key={day} 
                    className="flex flex-col items-center py-0.5 cursor-pointer relative"
                    onClick={() => setSelectedDay(day)}
                  >
                    <span className={`
                      w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all relative z-10
                      ${isSelected ? 'bg-slate-900 text-white shadow-lg' : isToday ? 'text-[var(--primary-color)] font-extrabold ring-1 ring-inset ring-[var(--primary-color)]/20' : 'text-slate-600'}
                    `}>
                      {day}
                    </span>
                    <div className="flex gap-0.5 mt-1 min-h-[4px]">
                      {dateEvents.slice(0, 3).map((e, idx) => (
                        <div 
                          key={idx} 
                          className="w-1.5 h-1.5 rounded-full" 
                          style={{ backgroundColor: settings.categoryColors[e.category] || 'var(--primary-color)' }}
                        ></div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            currentWeekDays.map((d, i) => {
              const dateEvents = getEventForDate(d);
              const isToday = new Date().toDateString() === d.toDateString();
              const isSelected = selectedDay === d.getDate();

              return (
                <div 
                  key={i} 
                  className="flex flex-col items-center py-0.5 cursor-pointer relative"
                  onClick={() => setSelectedDay(d.getDate())}
                >
                  <span className={`
                    w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all relative z-10
                    ${isSelected ? 'bg-slate-900 text-white shadow-lg' : isToday ? 'text-[var(--primary-color)] font-extrabold ring-1 ring-inset ring-[var(--primary-color)]/20' : 'text-slate-600'}
                  `}>
                    {d.getDate()}
                  </span>
                  <div className="flex gap-0.5 mt-1 min-h-[4px]">
                    {dateEvents.slice(0, 3).map((e, idx) => (
                      <div 
                        key={idx} 
                        className="w-1.5 h-1.5 rounded-full" 
                        style={{ backgroundColor: settings.categoryColors[e.category] || 'var(--primary-color)' }}
                      ></div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
           <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {settings.planningDisplayMode === 'daily' ? 'Programme du jour' : 'Agenda du mois'}
           </h2>
        </div>
        
        <div className="space-y-4">
          {settings.planningDisplayMode === 'daily' ? (
            selectedDay ? (
              getEventForDate(new Date(viewDate.getFullYear(), viewDate.getMonth(), selectedDay)).length > 0 ? (
                getEventForDate(new Date(viewDate.getFullYear(), viewDate.getMonth(), selectedDay)).map(event => (
                  <EventCard key={event.id} event={event} colors={settings.categoryColors} onDelete={deleteEvent} />
                ))
              ) : (
                <EmptyAgenda message="Rien de prévu ce jour" />
              )
            ) : null
          ) : (
            monthlyAgendaEvents.length > 0 ? (
              monthlyAgendaEvents.map(event => (
                <div key={event.id} className="relative pl-4 border-l-2 border-gray-100 py-1">
                   <div className="absolute -left-[5px] top-4 w-2 h-2 rounded-full" style={{ backgroundColor: settings.categoryColors[event.category] }}></div>
                   <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                      {new Date(event.date + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} • {event.time}
                   </div>
                   <EventCard event={event} colors={settings.categoryColors} onDelete={deleteEvent} />
                </div>
              ))
            ) : (
              <EmptyAgenda message="Aucun événement ce mois-ci" />
            )
          )}
        </div>
      </section>

      {isAdding && (
        <div className="fixed inset-0 z-[2500] bg-white animate-in slide-in-from-bottom duration-500 overflow-y-auto p-6 flex flex-col pb-40">
          <header className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-serif text-[var(--primary-color)]">Nouvel Événement</h2>
            <button onClick={() => setIsAdding(false)} className="p-3 bg-gray-50 rounded-full text-gray-400">
              <X size={20} />
            </button>
          </header>

          <div className="space-y-6 flex-1">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 tracking-widest">Titre</label>
              <input 
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-lg font-bold outline-none"
                placeholder="Ex: Restaurant Anniversaire"
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 tracking-widest">Date</label>
                <input 
                  type="date"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 text-sm font-bold outline-none"
                  value={form.date}
                  onChange={e => setForm({...form, date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 tracking-widest">Heure</label>
                <input 
                  type="time"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 text-sm font-bold outline-none"
                  value={form.time}
                  onChange={e => setForm({...form, time: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 tracking-widest">Catégorie</label>
              <div className="flex flex-wrap gap-2">
                {settings.eventCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setForm({...form, category: cat})}
                    className={`px-4 py-2.5 rounded-full text-[10px] font-bold uppercase transition-all flex items-center gap-2 ${
                      form.category === cat ? 'bg-slate-900 text-white shadow-lg' : 'bg-gray-50 text-gray-400 border border-gray-100'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: settings.categoryColors[cat] || 'var(--primary-color)' }}></div>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 tracking-widest">Lieu</label>
              <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl px-4">
                <MapPin size={18} className="text-gray-300 ml-2" />
                <input 
                  className="w-full bg-transparent px-3 py-4 text-sm font-medium outline-none"
                  placeholder="Lieu"
                  value={form.place}
                  onChange={e => setForm({...form, place: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 tracking-widest">Description</label>
              <textarea 
                rows={3}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-medium outline-none"
                placeholder="Détails..."
                value={form.desc}
                onChange={e => setForm({...form, desc: e.target.value})}
              />
            </div>
            
            <button 
              onClick={addEvent}
              className="w-full bg-slate-900 text-[var(--secondary-color)] py-6 rounded-[2rem] font-bold uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-transform mt-8"
            >
              Confirmer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const EventCard: React.FC<{ event: CalendarEvent, colors: Record<string, string>, onDelete: (id: string) => void }> = ({ event, colors, onDelete }) => (
  <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-50 relative group">
    <div className="flex items-start gap-4">
      <div className="flex flex-col items-center justify-center bg-gray-50 w-16 p-3 rounded-2xl border border-gray-100">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-1">{event.time}</span>
        <Clock size={16} className="text-gray-300" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[event.category] }}></div>
          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{event.category}</span>
        </div>
        <p className="font-bold text-slate-800 text-lg leading-tight mb-2">{event.title}</p>
        {event.place && (
          <div className="flex items-center gap-1.5 text-gray-500 mb-1">
            <MapPin size={12} className="text-gray-300" />
            <span className="text-[10px] font-medium">{event.place}</span>
          </div>
        )}
      </div>
      <button onClick={() => onDelete(event.id)} className="p-2 text-red-200">
        <X size={16} />
      </button>
    </div>
  </div>
);

const EmptyAgenda = ({ message }: { message: string }) => (
  <div className="text-center py-10 bg-white rounded-[2rem] border border-dashed border-gray-200">
    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{message}</p>
  </div>
);

export default PlanningView;
