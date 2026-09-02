import Reveal from './Reveal';
import { eventsData } from '../data/events';

export default function Events({ onOpenModal }) {
  return (
    <section id="events" className="py-24 max-w-7xl mx-auto px-6">
      <Reveal>
        <div className="text-center mb-12">
          <h2 className="font-space font-bold text-4xl">Featured Events</h2>
          <div className="underline-gradient"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventsData.map((ev) => (
            <div key={ev.id} className="flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-primary-2 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group">
              <div className="w-full h-[180px] overflow-hidden bg-[#0a1019] relative">
                <img src={ev.image} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex flex-col flex-1 p-6">
                <span className="text-primary-2 text-xs font-bold uppercase tracking-widest">{ev.category}</span>
                <h3 className="font-space text-xl font-semibold mt-2 mb-1">{ev.title}</h3>
                <span className="text-sm font-medium text-slate-300 mb-3">{ev.subtitle}</span>
                <div className="inline-flex self-start bg-white/5 border border-white/10 rounded-md px-3 py-1.5 text-xs text-slate-300 mb-4">
                  <i className="far fa-clock text-primary-2 mr-2"></i>{ev.time}
                </div>
                <p className="text-muted text-sm flex-1 mb-6">{ev.desc}</p>
                <button onClick={() => onOpenModal(ev.id)} className="w-full py-3 rounded-lg border-2 border-primary/40 text-primary-2 bg-primary/5 hover:bg-primary hover:border-primary hover:text-white font-bold text-sm tracking-wide transition-colors">
                  VIEW RULES
                </button>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}