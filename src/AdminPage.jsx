import { useEffect, useMemo, useState } from 'react';

const formatDate = (value) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

export default function AdminPage() {
  const [passcode, setPasscode] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchRegistrations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/registrations?key=${encodeURIComponent(passcode)}`);
      if (!res.ok) {
        throw new Error('Unable to load registrations');
      }
      const data = await res.json();
      setRegistrations(Array.isArray(data) ? data : []);
      setErrorMsg('');
    } catch (error) {
      setErrorMsg(error.message || 'Unable to load registrations.');
      setIsAuth(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });

      if (!res.ok) {
        setErrorMsg('Invalid Passcode');
        return;
      }

      setIsAuth(true);
      await fetchRegistrations();
    } catch (error) {
      setErrorMsg('Server connection failed.');
    }
  };

  const handleDelete = async (id) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/registrations/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': passcode },
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.message || 'Failed to delete registration.');
        return;
      }

      setRegistrations((prev) => prev.filter((reg) => reg.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      setErrorMsg('Failed to delete registration. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredRegistrations = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return registrations;

    return registrations.filter((entry) => {
      const values = [
        entry.name,
        entry.email,
        entry.contact,
        entry.college,
        entry.degree,
        entry.branch,
        entry.year,
        entry.payment,
        entry.teamMembers,
        Array.isArray(entry.members) ? entry.members.map(m => Object.values(m).join(' ')).join(' ') : '',
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return values.includes(query);
    });
  }, [registrations, searchTerm]);

  const stats = useMemo(() => {
    const total = registrations.length;
    const teamMembers = registrations.reduce((sum, item) => sum + Number(item.teamMembers || 0), 0);
    const online = registrations.filter((item) => item.payment === 'Online').length;
    const offline = registrations.filter((item) => item.payment === 'Offline').length;

    return { total, teamMembers, online, offline };
  }, [registrations]);

  const toggleRow = (id) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const exportCsv = () => {
    if (!passcode) return;
    window.open(`/api/export-csv?key=${encodeURIComponent(passcode)}`, '_blank');
  };

  useEffect(() => {
    if (!isAuth) {
      setRegistrations([]);
    }
  }, [isAuth]);

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-white md:p-8">
      {!isAuth ? (
        <div className="flex min-h-screen items-center justify-center">
          <form onSubmit={handleLogin} className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-white">Developer Portal</h2>
            <p className="mt-2 text-sm text-slate-400">Access the registration dashboard.</p>
            {errorMsg && <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{errorMsg}</p>}
            <input
              type="password"
              placeholder="Enter Admin Password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="mt-5 w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white outline-none transition focus:border-indigo-500"
            />
            <button type="submit" className="mt-5 w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500">
              Authenticate
            </button>
          </form>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-indigo-300">Registration Dashboard</p>
              <h1 className="mt-2 text-3xl font-bold text-white">Innovex 2K26</h1>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search registrations..."
                className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none"
              />
              <button
                onClick={exportCsv}
                className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
              >
                Export CSV
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">Total Registrations</p>
              <h2 className="mt-3 text-3xl font-bold text-white">{stats.total}</h2>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">Team Members</p>
              <h2 className="mt-3 text-3xl font-bold text-white">{stats.teamMembers}</h2>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">Online</p>
              <h2 className="mt-3 text-3xl font-bold text-emerald-400">{stats.online}</h2>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">Offline</p>
              <h2 className="mt-3 text-3xl font-bold text-amber-400">{stats.offline}</h2>
            </div>
          </div>

          {errorMsg && <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{errorMsg}</div>}

          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-200">
                <thead className="bg-slate-800 text-xs font-semibold uppercase tracking-[0.12em] text-slate-300 sticky top-0">
                  <tr>
                    <th className="whitespace-nowrap px-4 py-3">#</th>
                    <th className="whitespace-nowrap px-4 py-3">Name</th>
                    <th className="whitespace-nowrap px-4 py-3">Email</th>
                    <th className="whitespace-nowrap px-4 py-3">Phone</th>
                    <th className="whitespace-nowrap px-4 py-3">College</th>
                    <th className="whitespace-nowrap px-4 py-3">Degree</th>
                    <th className="whitespace-nowrap px-4 py-3">Branch</th>
                    <th className="whitespace-nowrap px-4 py-3">Year</th>
                    <th className="whitespace-nowrap px-4 py-3">Members</th>
                    <th className="whitespace-nowrap px-4 py-3">Events</th>
                    <th className="whitespace-nowrap px-4 py-3">Payment</th>
                    <th className="whitespace-nowrap px-4 py-3">Registered At</th>
                    <th className="whitespace-nowrap px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="13" className="px-4 py-6 text-center text-slate-400">
                        Loading registrations...
                      </td>
                    </tr>
                  ) : filteredRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan="13" className="px-4 py-6 text-center text-slate-400">
                        No registrations found.
                      </td>
                    </tr>
                  ) : (
                    filteredRegistrations.map((entry, index) => (
                      <tbody key={entry.id ?? index}>
                        <tr className="border-t border-slate-800 align-top hover:bg-slate-800/30 transition">
                          <td className="whitespace-nowrap px-4 py-3 text-slate-400">{index + 1}</td>
                          <td className="whitespace-nowrap px-4 py-3 font-medium text-white">{entry.name}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-slate-300">{entry.email}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-slate-300">{entry.contact}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-slate-300">{entry.college}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-slate-300">{entry.degree}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-slate-300">{entry.branch}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-slate-300">{entry.year}</td>
                          <td className="whitespace-nowrap px-4 py-3">
                            {Array.isArray(entry.members) && entry.members.length > 0 ? (
                              <button
                                onClick={() => toggleRow(entry.id ?? index)}
                                className="inline-flex items-center gap-1 rounded bg-indigo-900/40 px-2 py-1 text-indigo-200 transition hover:bg-indigo-900/60"
                              >
                                <span className="font-semibold">{entry.members.length}</span>
                                <span>{expandedRows.has(entry.id ?? index) ? '▲' : '▼'}</span>
                              </button>
                            ) : (
                              <span className="text-slate-500">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-300">{Array.isArray(entry.events) ? entry.events.join(', ') : 'N/A'}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-slate-300">{entry.payment}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-slate-300 text-xs">{formatDate(entry.registeredAt)}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-center">
                            <button
                              onClick={() => setDeleteConfirm(entry.id)}
                              className="inline-flex items-center justify-center rounded-lg bg-red-900/30 p-2 text-red-400 transition hover:bg-red-900/60 hover:text-red-300"
                              title="Delete registration"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </td>
                        </tr>
                        {expandedRows.has(entry.id ?? index) && Array.isArray(entry.members) && entry.members.length > 0 && (
                          <tr className="border-t border-slate-700 bg-slate-800/50">
                            <td colSpan="13" className="px-4 py-4">
                              <div className="space-y-3">
                                {entry.members.map((member, memberIndex) => (
                                  <div key={memberIndex} className="rounded-lg border border-slate-700 bg-slate-900/50 p-3">
                                    <p className="text-xs font-semibold text-slate-400">Member {memberIndex + 1}</p>
                                    <div className="mt-2 grid grid-cols-1 gap-2 text-sm md:grid-cols-2 lg:grid-cols-5">
                                      <div>
                                        <p className="text-xs text-slate-500">Name</p>
                                        <p className="font-medium text-slate-200">{member.name || '—'}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-slate-500">Email</p>
                                        <p className="text-slate-300">{member.email || '—'}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-slate-500">Department</p>
                                        <p className="text-slate-300">{member.department || '—'}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-slate-500">Phone</p>
                                        <p className="text-slate-300">{member.contact || '—'}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-slate-500">College</p>
                                        <p className="text-slate-300">{member.college || '—'}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {deleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
              <div className="w-full max-w-sm rounded-2xl border border-red-600/50 bg-slate-900 p-6 shadow-2xl">
                <h3 className="text-lg font-bold text-white">Confirm Delete</h3>
                <p className="mt-3 text-sm text-slate-300">Are you sure you want to delete this registration? This action cannot be undone.</p>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    disabled={isDeleting}
                    className="flex-1 rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    disabled={isDeleting}
                    className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
