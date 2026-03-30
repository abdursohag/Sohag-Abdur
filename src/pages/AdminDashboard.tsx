import { useState, useEffect } from 'react';
import { Users, FileText, Briefcase, LayoutDashboard, CheckCircle, Clock, XCircle, Search, ArrowLeft, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads' | 'tutors' | 'applications'>('dashboard');
  const [tutors, setTutors] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [tutorsRes, leadsRes, appsRes] = await Promise.all([
          fetch('/api/tutors'),
          fetch('/api/leads'),
          fetch('/api/applications')
        ]);
        
        setTutors(await tutorsRes.json());
        setLeads(await leadsRes.json());
        setApplications(await appsRes.json());
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderTabContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div></div>;
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Users size={28} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Total Tutors</p>
                  <h3 className="text-3xl font-bold text-slate-800">{tutors.length}</h3>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                  <FileText size={28} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">New Leads</p>
                  <h3 className="text-3xl font-bold text-slate-800">{leads.length}</h3>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                  <Briefcase size={28} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Pending Applications</p>
                  <h3 className="text-3xl font-bold text-slate-800">{applications.length}</h3>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Recent Leads</h3>
                {leads.length === 0 ? (
                  <p className="text-slate-500 text-sm">No leads yet.</p>
                ) : (
                  <div className="space-y-3">
                    {leads.slice(0, 5).map(lead => (
                      <div key={lead.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors">
                        <div>
                          <p className="font-semibold text-slate-800">{lead.subject} - Class {lead.studentClass}</p>
                          <p className="text-xs text-slate-500">{lead.area} • {lead.phone}</p>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                          {lead.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Recent Applications</h3>
                {applications.length === 0 ? (
                  <p className="text-slate-500 text-sm">No applications yet.</p>
                ) : (
                  <div className="space-y-3">
                    {applications.slice(0, 5).map(app => (
                      <div key={app.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors">
                        <div>
                          <p className="font-semibold text-slate-800">{app.fullName}</p>
                          <p className="text-xs text-slate-500">{app.experience} exp • {app.phone}</p>
                        </div>
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                          {app.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'leads':
        return (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">Parent Leads</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="text" placeholder="Search leads..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Subject & Class</th>
                    <th className="px-6 py-3 font-medium">Area</th>
                    <th className="px-6 py-3 font-medium">Budget</th>
                    <th className="px-6 py-3 font-medium">Contact</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No leads found</td></tr>
                  ) : leads.map(lead => (
                    <tr key={lead.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-slate-600">{new Date(lead.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {lead.subject} <span className="text-slate-400 font-normal">({lead.studentClass})</span>
                        {lead.urgency && <span className="ml-2 inline-block w-2 h-2 bg-red-500 rounded-full" title="Urgent"></span>}
                      </td>
                      <td className="px-6 py-4 text-slate-600">{lead.area}</td>
                      <td className="px-6 py-4 text-slate-600">৳{lead.budget}</td>
                      <td className="px-6 py-4 text-slate-600">{lead.phone}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">{lead.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'tutors':
        return (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">Verified Tutors</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Subjects</th>
                    <th className="px-6 py-3 font-medium">Areas</th>
                    <th className="px-6 py-3 font-medium">Rating</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tutors.map(tutor => (
                    <tr key={tutor.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-800">{tutor.name}</td>
                      <td className="px-6 py-4 text-slate-600">{tutor.subjects.join(', ')}</td>
                      <td className="px-6 py-4 text-slate-600">{tutor.areas.join(', ')}</td>
                      <td className="px-6 py-4 text-slate-600 flex items-center gap-1">
                        <Star size={14} className="fill-amber-500 text-amber-500" /> {tutor.rating}
                      </td>
                      <td className="px-6 py-4">
                        {tutor.isAvailableNow ? (
                          <span className="flex items-center gap-1 text-green-600 text-xs font-bold"><CheckCircle size={14} /> Available</span>
                        ) : (
                          <span className="flex items-center gap-1 text-slate-500 text-xs font-bold"><XCircle size={14} /> Busy</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'applications':
        return (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">Tutor Applications</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Applicant</th>
                    <th className="px-6 py-3 font-medium">Contact</th>
                    <th className="px-6 py-3 font-medium">Experience</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No applications found</td></tr>
                  ) : applications.map(app => (
                    <tr key={app.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-slate-600">{new Date(app.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-medium text-slate-800">{app.fullName}</td>
                      <td className="px-6 py-4 text-slate-600">
                        <div>{app.email}</div>
                        <div className="text-xs">{app.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{app.experience}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full flex items-center gap-1 w-max">
                          <Clock size={12} /> {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-brand-primary hover:underline font-medium text-xs">Review</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2 text-white hover:text-brand-primary transition-colors mb-6">
            <ArrowLeft size={16} /> Back to Site
          </Link>
          <div className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center font-bold">T</div>
            <span className="font-display font-bold text-xl tracking-tight">Admin Panel</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'dashboard' ? 'bg-brand-primary text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('leads')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'leads' ? 'bg-brand-primary text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <FileText size={20} />
            <span className="font-medium">Parent Leads</span>
          </button>
          <button 
            onClick={() => setActiveTab('tutors')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'tutors' ? 'bg-brand-primary text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <Users size={20} />
            <span className="font-medium">Verified Tutors</span>
          </button>
          <button 
            onClick={() => setActiveTab('applications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'applications' ? 'bg-brand-primary text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <Briefcase size={20} />
            <span className="font-medium">Applications</span>
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
          Tutor Tech Admin v1.0
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold font-display text-slate-900 capitalize">{activeTab}</h1>
              <p className="text-slate-500 mt-1">Manage your tutoring agency operations.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold">
                A
              </div>
            </div>
          </header>

          {renderTabContent()}
        </div>
      </main>
    </div>
  );
}
