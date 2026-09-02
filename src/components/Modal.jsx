import { useEffect } from 'react';

export default function Modal({ event, onClose }) {
  
  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  if (!event) return null;

  return (
    <div 
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md animate-[fadeIn_0.3s_ease]" 
      onClick={onClose}
    >
      <div 
        className="flex flex-col w-full max-w-[600px] max-h-[90vh] bg-surface border border-white/10 rounded-2xl shadow-2xl animate-[slideUp_0.3s_ease]"
        onClick={(e) => e.stopPropagation()} // Prevent clicking inside modal from closing it
      >
        
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-white/10">
          <div>
            <h3 className="text-2xl font-space font-bold text-white mb-1">{event.title}</h3>
            <h5 className="text-base font-medium font-sans text-white mb-1">{event.subtitle}</h5>
            <span className="text-primary-2 text-sm font-medium">
              <i className="far fa-clock mr-2"></i>{event.time}
            </span>
          </div>
          <button onClick={onClose} className="text-muted hover:text-white transition-colors">
            <i className="fas fa-times text-2xl"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <ul className="list-disc pl-5 text-muted space-y-3">
            {event.rules.map((rule, idx) => (
              <li key={idx} className="leading-relaxed">{rule}</li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/10 text-right">
          <button onClick={onClose} className="bg-primary hover:bg-primary/80 text-white font-bold py-2.5 px-8 rounded-lg transition-colors">
            OK
          </button>
        </div>
      </div>
    </div>
  );
}