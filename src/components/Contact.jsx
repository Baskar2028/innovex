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
                <a href="#" aria-label="Email" className="w-12 h-12 flex items-center justify-center border border-white/10 rounded-full text-white bg-white/5 transition-all hover:bg-primary hover:border-primary hover:-translate-y-1">
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
            <div className="min-h-[350px] lg:min-h-full grayscale-[0.8] contrast-[1.2] brightness-[0.6]">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124503.77443152668!2d78.14088927429447!3d12.520475283403248!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bac4f5b5522501d%3A0xa6131c9a09bd96!2sKrishnagiri%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map Location"
              ></iframe>
            </div>
            
          </div>
        </Reveal>
      </div>
    </section>
  );
}
