import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Events from './components/Events';
import Community from './components/Community';
import Contact from './components/Contact';
import Modal from './components/Modal';
import RegisterModal from './components/RegisterModal';
// import Reveal from './components/Reveal';
import { eventsData } from './data/events';
import AdminPage from './AdminPage';

function MainSite() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <div className="relative">
      <Navbar onRegister={() => setIsRegisterOpen(true)} />
      
      <main>
        <Hero onRegister={() => setIsRegisterOpen(true)} />
        <About />
        <Events onOpenModal={(id) => setSelectedEvent(eventsData.find(e => e.id === id))} />
        <Community />
        <Contact />
      </main>

      <footer className="border-t border-white/10 bg-[#020617] py-8 text-center text-muted text-sm">
        <p>&copy; 2026 INNOVEX-2K26. All Rights Reserved.</p>
        <p className="mt-2 flex items-center justify-center gap-2">
          <i className="fas fa-map-marker-alt"></i> Krishnagiri, Tamil Nadu, India
        </p>
      </footer>

      {/* Rules Modal */}
      {selectedEvent && (
        <Modal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
      {isRegisterOpen && <RegisterModal onClose={() => setIsRegisterOpen(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main public website */}
        <Route path="/" element={<MainSite />} />

        {/* Hidden Developer Portal */}
        <Route path="/developer-admin-portal" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}