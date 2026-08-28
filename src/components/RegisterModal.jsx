import { useEffect, useState } from 'react';
import payImage from '../assets/pay.jpeg';

const degrees = ['BE', 'BTech'];
const branches = ['CSE', 'IT', 'AIDS', 'AIML', 'DS', 'CSE(CS)', 'ECE', 'EEE', 'CIVIL', 'MECH'];
const years = ['I', 'II', 'III', 'IV'];
const events = ['PREZI', 'PROTOSPARK', 'TRY CRACK ME','QUIZMANIA', 'ARTNOVA'];
const emptyMember = () => ({ name: '', email: '', department: '', contact: '', college: '' });
const inputClass = 'mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-primary';

export default function RegisterModal({ onClose }) {
  const [form, setForm] = useState({ name: '', email: '', contact: '', college: '', degree: '', degreeDetail: '', branch: '', year: '', teamMembers: '', members: [], events: [], payment: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleEscape = (event) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError('');
  };

  const updateTeamSize = (event) => {
    const teamMembers = Number(event.target.value);
    setForm((current) => ({
      ...current,
      teamMembers,
      members: Array.from({ length: teamMembers }, (_, index) => current.members[index] || emptyMember()),
    }));
    setError('');
  };

  const updateMember = (index, event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      members: current.members.map((member, memberIndex) => memberIndex === index ? { ...member, [name]: value } : member),
    }));
    setError('');
  };

  const toggleEvent = (eventName) => {
    setForm((current) => {
      const selected = current.events.includes(eventName);
      if (!selected && current.events.length === 2) {
        setError('You can select a maximum of two events.');
        return current;
      }
      setError('');
      return { ...current, events: selected ? current.events.filter((event) => event !== eventName) : [...current.events, eventName] };
    });
  };

  const needsDegreeDetail = form.degree === 'Others' || form.branch === 'ARTS AND SCIENCE';

  const submitRegistration = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const responseText = await response.text();
      let result = {};
      if (responseText) {
        try {
          result = JSON.parse(responseText);
        } catch {
          throw new Error('The registration server returned an invalid response. Restart the site with npm run dev and try again.');
        }
      }
      if (!response.ok) throw new Error(result.message || 'Unable to save your registration. Please try again.');
      setIsSuccess(true);
    } catch (submissionError) {
      setError(submissionError.message || 'Registration service is unavailable. Start the site with npm run dev and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
        <div className="w-full max-w-md rounded-2xl border border-primary/40 bg-surface p-8 text-center shadow-2xl">
          <i className="fas fa-circle-check mb-4 text-5xl text-primary-2"></i>
          <h2 className="font-space text-2xl font-bold text-white">Registration Successful!</h2>
          <p className="mt-3 text-muted">Your registration has been saved.</p>
          <button onClick={onClose} className="mt-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white">Done</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-surface shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <h2 className="font-space text-2xl font-bold text-white">Welcome to Tech War!</h2>
          <button onClick={onClose} aria-label="Close registration form" className="text-2xl text-muted transition-colors hover:text-white"><i className="fas fa-times"></i></button>
        </div>

        <form onSubmit={submitRegistration} className="space-y-5 p-6">
          <label className="block text-sm font-medium text-slate-200">Name
            <input required name="name" value={form.name} onChange={updateField} className={inputClass} />
          </label>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <label className="block text-sm font-medium text-slate-200">Email ID
              <input required type="email" name="email" value={form.email} onChange={updateField} className={inputClass} />
            </label>
            <label className="block text-sm font-medium text-slate-200">Contact Number
              <input required type="tel" name="contact" value={form.contact} onChange={updateField} className={inputClass} />
            </label>
            <label className="block text-sm font-medium text-slate-200">College Name
              <input required name="college" value={form.college} onChange={updateField} className={inputClass} />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <label className="block text-sm font-medium text-slate-200">Degree
              <select required name="degree" value={form.degree} onChange={updateField} className={inputClass}>
                <option value="">Select degree</option>
                {degrees.map((degree) => <option key={degree} value={degree}>{degree}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-200">Branch
              <select required name="branch" value={form.branch} onChange={updateField} className={inputClass}>
                <option value="">Select branch</option>
                {branches.map((branch) => <option key={branch} value={branch}>{branch}</option>)}
              </select>
            </label>
          </div>

          {needsDegreeDetail && <label className="block text-sm font-medium text-slate-200">{form.degree === 'Others' ? 'Enter your degree' : 'Enter your Arts & Science degree'}
            <input required name="degreeDetail" value={form.degreeDetail} onChange={updateField} className={inputClass} />
          </label>}

          <label className="block text-sm font-medium text-slate-200">Year
            <select required name="year" value={form.year} onChange={updateField} className={inputClass}>
              <option value="">Select year</option>
              {years.map((year) => <option key={year} value={year}>{year}</option>)}
            </select>
          </label>

          <fieldset>
            <legend className="text-sm font-medium text-slate-200">Number of Team Members</legend>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((count) => <label key={count} className={`flex cursor-pointer items-center justify-center rounded-lg border p-3 text-sm font-bold transition-colors ${form.teamMembers === count ? 'border-primary bg-primary/20 text-white' : 'border-white/10 bg-white/5 text-muted'}`}>
                <input required type="radio" name="teamMembers" value={count} checked={form.teamMembers === count} onChange={updateTeamSize} className="sr-only" />
                {count}
              </label>)}
            </div>
          </fieldset>

          {form.members.map((member, index) => <fieldset key={index} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <legend className="px-2 text-sm font-bold text-primary-2">Team Member {index + 1}</legend>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {['name', 'email', 'department', 'contact', 'college'].map((field) => <label key={field} className="block text-sm font-medium capitalize text-slate-200">{field === 'email' ? 'Email ID' : field === 'contact' ? 'Contact Number' : field === 'college' ? 'College Name' : field === 'department' ? 'Department' : 'Name'}
                <input required type={field === 'email' ? 'email' : field === 'contact' ? 'tel' : 'text'} name={field} value={member[field]} onChange={(event) => updateMember(index, event)} className={inputClass} />
              </label>)}
            </div>
          </fieldset>)}

          <fieldset>
            <legend className="text-sm font-medium text-slate-200">Events <span className="text-muted">(choose up to 2)</span></legend>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {events.map((eventName) => <label key={eventName} className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
                <input type="checkbox" checked={form.events.includes(eventName)} onChange={() => toggleEvent(eventName)} className="accent-violet-500" />
                {eventName}
              </label>)}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-medium text-slate-200">Payment</legend>
            <div className="mt-3 flex gap-5">
              {['Online', 'Offline'].map((payment) => <label key={payment} className="flex cursor-pointer items-center gap-2 text-slate-200">
                <input required type="radio" name="payment" value={payment} checked={form.payment === payment} onChange={updateField} className="accent-violet-500" />
                {payment}
              </label>)}
            </div>
          </fieldset>

          {form.payment === 'Online' && <div className="rounded-xl border border-dashed border-primary/50 bg-primary/5 p-5 text-center">
            <p className="mb-3 text-sm text-slate-200">Scan to pay</p>
            <img src={payImage} alt="qr" className="mx-auto h-44 w-44 rounded-lg bg-white object-contain" />
          </div>}

          {error && <p className="rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
          <button disabled={isSubmitting} type="submit" className="w-full rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 px-6 py-3 font-bold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? 'Submitting...' : 'Submit Registration'}
          </button>
        </form>
      </div>
    </div>
  );
}
