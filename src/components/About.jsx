import Reveal from './Reveal';

export default function About() {
  const features = [
    { icon: "fa-lightbulb", title: "Innovation", gradient: "from-primary to-primary-2" },
    { icon: "fa-microchip", title: "Technology", gradient: "from-[#00b9cf] to-[#4c70ff]" },
    { icon: "fa-palette", title: "Creativity", gradient: "from-[#db4bd5] to-[#8458f5]" },
    { icon: "fa-trophy", title: "Competition", gradient: "from-[#f59e0b] to-[#ef6c5d]" }
  ];

  return (
    <section id="about" className="py-24 bg-gradient-to-b from-slate-900/40 to-bg border-y border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-14">
            <h2 className="font-space font-bold text-3xl md:text-4xl tracking-tight text-white">About The Symposium</h2>
            <div className="underline-gradient"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-muted text-[1.05rem] leading-relaxed space-y-6">
              <p>
                <strong className="text-white font-semibold">INNOVEX-2K26</strong> is a premier National Level Technical Symposium proudly organized by the Department of Computer Science and Engineering at <strong className="text-white font-semibold">P.S.V College of Engineering and Technology</strong>.
              </p>
              <p>
                Designed to bridge the gap between theoretical knowledge and practical innovation, this symposium brings together brilliant minds from across the nation to showcase their technical prowess, creative problem-solving abilities, and visionary ideas.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {features.map((feat, idx) => (
                <div key={idx} className="p-8 border border-white/5 rounded-2xl bg-white/5 text-center transition-all duration-300 hover:border-primary/40 hover:-translate-y-1.5 hover:bg-white/10">
                  <div className={`w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-xl text-white text-xl bg-gradient-to-br ${feat.gradient} shadow-[0_10px_20px_rgba(0,0,0,0.3)]`}>
                    <i className={`fas ${feat.icon}`}></i>
                  </div>
                  <h4 className="text-white font-semibold">{feat.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}