import Reveal from './Reveal';

import hodImage from '../assets/HOD.jpeg';
import staffImage from '../assets/staff.jpeg';
import presidentImage from '../assets/president.jpeg';
import vicePresidentImage from '../assets/founder.jpeg';

export default function Community() {
  const Card = ({ image, name, role, desc, phone, imageClassName = 'object-center', alignmentClassName = 'mx-auto', roleClassName = '' }) => (
    <div className={`flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-2xl p-10 w-full max-w-[400px] ${alignmentClassName} transition-all duration-500 hover:-translate-y-2 hover:border-primary/60 hover:bg-primary/5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]`}>
      {/* Perfect Circle Image Container */}
      <div className="flex items-center justify-center w-[155px] h-[155px] p-1 border-4 border-primary/60 rounded-full bg-[#0a1019] shadow-[0_12px_24px_rgba(0,0,0,0.3)] mb-6 shrink-0">
        <img src={image} alt={name} className={`w-full h-full object-cover ${imageClassName} rounded-full`} />
      </div>

      <div className="text-center">
        <h4 className="whitespace-nowrap text-[0.88rem] font-bold tracking-tight text-white mb-2 font-space md:text-base">
          {name}
        </h4>

        <p className={`text-primary-2 text-[0.85rem] font-bold tracking-[0.1em] uppercase mb-3 ${roleClassName}`}>
          {role}
        </p>

        {/* Unique Gradient Phone Number (Positioned directly below Role) */}
        {phone && (
          <div className="mb-4">
            <a
              href={`tel:${phone}`}
              className="group relative inline-flex items-center gap-2 px-5 py-2 rounded-full overflow-hidden border border-sky-500/30 bg-gradient-to-r from-sky-500/10 to-blue-600/10 hover:border-sky-400/70 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(14,165,233,0.3)]"
              aria-label={`Call ${role}`}
            >
              {/* Animated Blue Glow */}
              <span className="absolute inset-0 bg-gradient-to-r from-sky-500/0 via-sky-400/20 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Phone Icon */}
              <span className="relative text-sky-400 text-sm group-hover:rotate-12 transition-transform duration-300">
                📞
              </span>

              {/* Number with Two-Blue Gradient */}
              <span className="relative font-space font-bold text-sm tracking-[0.12em] bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                {phone}
              </span>

              {/* Small decorative glow */}
              <span className="absolute -right-2 -top-2 w-6 h-6 rounded-full bg-sky-500/20 blur-md group-hover:bg-sky-400/40 transition-all duration-500" />
            </a>
          </div>
        )}

        <p className="max-w-[285px] text-muted text-[0.88rem] leading-relaxed mx-auto">
          {desc}
        </p>
      </div>
    </div>
  );

  return (
    <section id="community" className="py-24 bg-gradient-to-t from-slate-900/30 to-bg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-14">
            <h2 className="font-space font-bold text-3xl md:text-4xl tracking-tight text-white">
              Community
            </h2>
            <div className="underline-gradient"></div>
          </div>

          <div className="flex flex-col gap-8 max-w-[900px] mx-auto">
            {/* HOD */}
            <div className="flex justify-start w-full">
              <Card
                image={hodImage}
                imageClassName="object-[center_25%]"
                name="Mr.C. PRAKASH NARAYANAN.,M.E.,HOD"
                role="Head of Department"
                desc="Provides academic guidance and oversees the symposium’s overall direction."
                alignmentClassName="mx-0"
                roleClassName="whitespace-nowrap"
              />
            </div>

            {/* Staff Coordinator */}
            <div className="flex justify-start w-full">
              <Card
                image={staffImage}
                imageClassName="object-[center_25%]"
                name="Mrs. K.NANDINI"
                role="Staff Coordinator"
                desc="Coordinates the event team, schedules, and smooth on-ground execution."
                alignmentClassName="mx-0"
              />
            </div>

            {/* Student President and Vice President */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              <Card
                image={presidentImage}
                imageClassName="object-[center_18%]"
                name="ARASU V"
                role="Student President"
                phone="7845469973"
                desc="Leads the student team and helps shape the participant experience."
              />

              <Card
                image={vicePresidentImage}
                name="BASKAR K"
                role="Student Vice President"
                phone="7708872251"
                desc="Supports team coordination and ensures every event runs as planned."
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}