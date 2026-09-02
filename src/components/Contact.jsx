import Reveal from './Reveal';

export default function Contact() {
  return (
    <section id="contact" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden border border-white/10 rounded-2xl bg-surface shadow-2xl">
            
            {/* Info Side */}
            <div className="p-10 md:p-14">
              <h2 className="font-space font-bold text-3xl tracking-tight text-white mb-2">FIND BATTLE FIELD</h2>
              <div className="underline-left"></div>
              
              <div className="mb-10">
                <h4 className="text-xl font-bold text-white mb-2">P.S.V College of Engineering and Technology</h4>
                <p className="text-muted mb-4">Department of Computer Science and Engineering</p>
                <p className="text-slate-200 font-medium flex items-center">
                  <i className="fas fa-map-marker-alt text-primary-2 mr-3 text-lg"></i> 
                  Krishnagiri, Tamil Nadu, India
                </p>
              </div>

              <div className="flex gap-4">
                <a href="mailto:innovex2k26@gmail.com" aria-label="Email" className="w-12 h-12 flex items-center justify-center border border-white/10 rounded-full text-white bg-white/5 transition-all hover:bg-primary hover:border-primary hover:-translate-y-1">
                  <i className="fas fa-envelope text-xl"></i>
                </a>
                <a href="https://wa.me/917845469973" aria-label="WhatsApp" className="w-12 h-12 flex items-center justify-center border border-white/10 rounded-full text-white bg-white/5 transition-all hover:bg-primary hover:border-primary hover:-translate-y-1">
                  <i className="fab fa-whatsapp text-xl"></i>
                </a>
                <a href="#" aria-label="Instagram" className="w-12 h-12 flex items-center justify-center border border-white/10 rounded-full text-white bg-white/5 transition-all hover:bg-primary hover:border-primary hover:-translate-y-1">
                  <i className="fab fa-instagram text-xl"></i>
                </a>
              </div>
            </div>
            
            {/* Map Side */}
           <div className="relative w-full h-[350px] lg:h-full grayscale-[0.8] contrast-[1.2] brightness-[0.6] rounded-2xl overflow-hidden">
            <iframe
    src="https://maps.google.com/maps?q=PSV%20College%20of%20Engineering%20%26%20Technology&t=&z=15&ie=UTF8&iwloc=&output=embed"
    className="w-full h-full border-0"
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    title="PSV College Location Map"
               />
            </div>
            
          </div>
        </Reveal>
      </div>
    </section>
  );
}
