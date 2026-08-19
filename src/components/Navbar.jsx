import { useState, useEffect } from 'react';

export default function Navbar({ onRegister }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Hide navbar if not on Home section
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
      if (!entry.isIntersecting) setIsOpen(false);
    }, { threshold: 0.1 });
    
    const homeEl = document.getElementById('home');
    if (homeEl) observer.observe(homeEl);
    return () => observer.disconnect();
  }, []);

  const navigateTo = (event, target) => {
    event.preventDefault();
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setIsOpen(false);
  };

  return (
    <nav className={`fixed left-1/2 -translate-x-1/2 w-[90%] max-w-[1000px] h-[70px] rounded-full bg-surface/80 border border-white/10 backdrop-blur-md z-50 transition-all duration-500 ease-out flex items-center justify-between px-6 md:px-8 ${isVisible ? 'top-6 opacity-100' : '-top-10 opacity-0 pointer-events-none'}`}>
      
      <div className="font-orbitron font-bold text-xl tracking-tight text-white">
        <a href="#home" onClick={(event) => navigateTo(event, '#home')}>INNOVEX<span className="text-primary-2">-2K26</span></a>
      </div>

      <ul className={`absolute md:static top-[80px] left-0 w-full md:w-auto bg-surface md:bg-transparent border md:border-none border-white/10 md:flex rounded-2xl md:rounded-none p-5 md:p-0 flex-col md:flex-row gap-5 md:gap-8 transition-all ${isOpen ? 'flex' : 'hidden'}`}>
        {['Home', 'About', 'Events', 'Community'].map((item) => (
          <li key={item}>
            <a href={`#${item.toLowerCase()}`} onClick={(event) => navigateTo(event, `#${item.toLowerCase()}`)} className="text-muted hover:text-white font-medium text-sm transition-colors">
              {item}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-4">
        <button type="button" onClick={onRegister} className="hidden md:inline-flex items-center justify-center bg-gradient-to-br from-violet-600 to-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:shadow-[0_10px_25px_rgba(124,58,237,0.4)] transition-all hover:-translate-y-0.5">
          Register Now
        </button>
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white text-xl">
          <i className="fas fa-bars"></i>
        </button>
      </div>
    </nav>
  );
}
