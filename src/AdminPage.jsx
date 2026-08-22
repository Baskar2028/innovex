import React, { useState } from 'react';

export default function AdminPage() {
  const [passcode, setPasscode] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      // Validates passcode against server using the key stored in your .env
      const res = await fetch(`/api/export-excel?key=${encodeURIComponent(passcode)}`);
      
      if (res.status === 401) {
        setErrorMsg('Invalid Passcode');
      } else if (res.status === 404 || res.ok) {
        // If 200 (data exists) or 404 (no registrations yet), the passcode is valid!
        setIsAuth(true);
      } else {
        setErrorMsg('Authentication failed. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Server connection failed.');
    }
  };

  const downloadFile = () => {
    // Sends the entered passcode directly to authorization route
    window.open(`/api/export-excel?key=${encodeURIComponent(passcode)}`, '_blank');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
      {!isAuth ? (
        <form onSubmit={handleLogin} className="p-6 bg-slate-800 rounded-xl space-y-4 shadow-xl w-80">
          <h2 className="text-xl font-bold">Developer Portal</h2>
          {errorMsg && <p className="text-red-400 text-sm font-medium">{errorMsg}</p>}
          <input 
            type="password" 
            placeholder="Enter Admin Password" 
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="w-full p-3 rounded bg-slate-700 text-white outline-none border border-slate-600 focus:border-indigo-500"
          />
          <button type="submit" className="w-full bg-indigo-600 py-2 rounded font-medium hover:bg-indigo-500">
            Authenticate
          </button>
        </form>
      ) : (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-green-400">Authenticated as Developer</h2>
          <button 
            onClick={downloadFile} 
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-500 transition-all shadow-lg"
          >
            📥 Download Registrations (.xlsx)
          </button>
        </div>
      )}
    </div>
  );
}