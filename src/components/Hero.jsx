import { useEffect, useState } from 'react';
import Reveal from './Reveal';

export default function Hero({ onRegister }) {
  const [typedText, setTypedText] = useState("");
  
  useEffect(() => {
    const codeLines = [
      "import { TechnicalSymposium } from 'PSVCET';\n\n",
      "const event = new TechnicalSymposium('INNOVEX-2K26');\n",
      "event.registerDepartment('Computer Science');\n",
      "event.loadModules(['PPT', 'Expo', 'Quiz', 'Design']);\n\n",
      "await event.initialize();\n",
      "> System Online. Ready to Innovate_"
    ];
    
    let currentText = "";
    let lineIdx = 0;
    let charIdx = 0;
    let timeoutId;

    const typeCode = () => {
      if (lineIdx < codeLines.length) {
        if (charIdx < codeLines[lineIdx].length) {
          currentText += codeLines[lineIdx].charAt(charIdx);
          setTypedText(currentText);
          charIdx++;
          timeoutId = setTimeout(typeCode, 20 + Math.random() * 30);
        } else {
          lineIdx++;
          charIdx = 0;
          timeoutId = setTimeout(typeCode, 300);
        }
      } else {
        timeoutId = setTimeout(() => {
          currentText = "";
          lineIdx = 0;
          charIdx = 0;
          setTypedText("");
          timeoutId = setTimeout(typeCode, 700);
        }, 1800);
      }
    };

    timeoutId = setTimeout(typeCode, 1000);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <section id="home" className="relative flex items-center justify-center min-h-screen pt-[70px] text-center overflow-hidden">
      {/* IDE Background */}
      <div className="absolute inset-4 md:inset-6 rounded-2xl bg-[#09090b] border border-white/5 ide-bg-glow z-0 overflow-hidden">
        <div className="h-11 bg-white/5 border-b border-white/5 flex items-center px-5">
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]"></span>
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]"></span>
            <span className="w-3 h-3 rounded-full bg-[#27c93f]"></span>
          </div>
          <div className="mx-auto text-slate-500 font-code text-sm pr-11">Innovex-2k26.ts</div>
        </div>
        <div className="p-8 text-left font-code text-[1.1rem] leading-relaxed text-slate-600 whitespace-pre-wrap">
          {typedText}<span className="inline-block w-2 h-[1.1rem] bg-primary-2 animate-blink align-bottom ml-0.5"></span>
        </div>
        <div className="absolute inset-0 ide-overlay pointer-events-none"></div>
      </div>

      {/* Foreground Content */}
      <Reveal className="relative z-10 w-full max-w-4xl px-4">
        <div className="mb-6">
          <h3 className="text-slate-200 uppercase tracking-[0.12em] font-bold text-lg md:text-xl mb-2">
            P.S.V College of Engineering and Technology
          </h3>
          <h4 className="text-primary-2 font-medium tracking-wide text-sm md:text-base">
            Department of Computer Science and Engineering
          </h4>
        </div>
        
        <h1 className="font-orbitron font-black text-5xl md:text-7xl lg:text-8xl tracking-tight leading-none text-white whitespace-nowrap drop-shadow-[0_0_40px_rgba(139,92,246,0.4)]">
          INNOVEX<span className="text-primary">-2K26</span>
        </h1>
        
        <h2 className="mt-6 mb-4 font-semibold text-xl md:text-2xl text-slate-200">
          National Level Technical Symposium
        </h2>
        <p className="text-muted text-lg">Innovate. Compete. Create the Future.</p>
        
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <button type="button" onClick={onRegister} className="inline-flex items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-[0_10px_25px_rgba(124,58,237,0.4)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(124,58,237,0.55)]">
            REGISTER NOW
          </button>
          <a href="#events" className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white shadow-[0_6px_16px_rgba(0,0,0,0.22)] transition-all hover:-translate-y-0.5 hover:border-primary-2 hover:bg-white/10 hover:shadow-[0_8px_20px_rgba(56,189,248,0.18)]">
            EXPLORE EVENTS
          </a>
        </div>
      </Reveal>
    </section>
  );
}
