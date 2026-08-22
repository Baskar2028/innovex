import Reveal from './Reveal';
import innovexLogo from '../assets/innovex-logo.png';
import hodImage from '../assets/HOD.jpeg';
import staffImage from '../assets/staff.jpeg';
import presidentImage from '../assets/president.jpeg';
import vicePresidentImage from '../assets/founder.jpeg';

export default function Community() {
  const Card = ({ image, name, role, desc, imageClassName = 'object-center', alignmentClassName = 'mx-auto', roleClassName = '' }) => (
    <div className={`flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-2xl p-10 w-full max-w-[400px] ${alignmentClassName} transition-all duration-500 hover:-translate-y-2 hover:border-primary/60 hover:bg-primary/5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]`}>
      {/* Perfect Circle Image Container */}
      <div className="flex items-center justify-center w-[155px] h-[155px] p-1 border-4 border-primary/60 rounded-full bg-[#0a1019] shadow-[0_12px_24px_rgba(0,0,0,0.3)] mb-6 shrink-0">
        <img src={image} alt={name} className={`w-full h-full object-cover ${imageClassName} rounded-full`} />
      </div>
      
      <div className="text-center">
        <h4 className="whitespace-nowrap text-[0.88rem] font-bold tracking-tight text-white mb-2 font-space md:text-base">{name}</h4>
        <p className={`text-primary-2 text-[0.85rem] font-bold tracking-[0.1em] uppercase mb-3 ${roleClassName}`}>
          {role}
        </p>
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
            <h2 className="font-space font-bold text-3xl md:text-4xl tracking-tight text-white">Community</h2>
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
                name="Mrs. K.NANDHINI"
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
                desc="Leads the student team and helps shape the participant experience." 
              />
              <Card 
                image={vicePresidentImage} 
                name="BASKAR K" 
                role="Student Vice President" 
                desc="Supports team coordination and ensures every event runs as planned." 
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
