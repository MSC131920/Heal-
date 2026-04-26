import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../App';
import { Appointment, MedicalReport } from '../types';
import { motion } from 'motion/react';
import { 
  Calendar, 
  FileText, 
  Clock, 
  Plus, 
  ChevronRight, 
  User, 
  Stethoscope,
  Upload,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function PatientDashboard() {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      try {
        // Appointments
        const apptQuery = query(
          collection(db, 'appointments'),
          where('patientId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const apptSnap = await getDocs(apptQuery);
        setAppointments(apptSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment)));

        // Reports
        const reportsQuery = query(
          collection(db, 'reports'),
          where('patientId', '==', user.uid),
          orderBy('uploadDate', 'desc')
        );
        const reportsSnap = await getDocs(reportsQuery);
        setReports(reportsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as MedicalReport)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleSimulateUpload = async () => {
    if (!user) return;
    setUploading(true);
    const reportNames = ['Blood Test Results', 'X-Ray Chest', 'MRI Scan Report', 'Annual Checkup Summary'];
    const randomName = reportNames[Math.floor(Math.random() * reportNames.length)];
    
    try {
      const newReport = {
        patientId: user.uid,
        name: `${randomName} - ${format(new Date(), 'MMM yyyy')}`,
        fileUrl: '#',
        uploadDate: Date.now()
      };
      const docRef = await addDoc(collection(db, 'reports'), newReport);
      setReports(prev => [{ id: docRef.id, ...newReport } as MedicalReport, ...prev]);
    } catch (err) {
      console.error(err);
      alert('Failed to simulate upload');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-sans"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div></div>;

  return (
    <div className="py-20 bg-ivory-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <h1 className="text-5xl md:text-6xl font-serif italic text-emerald-950 mb-4">
              Peace of mind, <span className="text-emerald-700">{profile?.displayName?.split(' ')[0] || 'Member'}</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg">Your health institute portal. All records curated for your convenience.</p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white border border-emerald-100 px-8 py-3 rounded-full shadow-xl shadow-emerald-900/5">
              <span className="small-caps text-emerald-600">Member Status: Distinguished</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column - Appointments */}
          <div className="lg:col-span-2 space-y-16">
            <section>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="bg-emerald-950 p-2 rounded-lg mr-4">
                    <Calendar className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-serif italic text-emerald-950">Active Appointments</h2>
                </div>
                <Link to="/doctors" className="bg-emerald-900 text-white p-3 rounded-full hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-900/20 active:scale-95">
                  <Plus className="w-5 h-5" />
                </Link>
              </div>

              {appointments.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-16 text-center border border-emerald-100">
                  <div className="bg-ivory-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-10 h-10 text-emerald-200" />
                  </div>
                  <h3 className="text-xl font-serif italic text-emerald-950 mb-2">No scheduled visits.</h3>
                  <p className="text-slate-400 text-sm mb-8 font-medium">The institute is ready when you are.</p>
                  <Link to="/doctors" className="bg-emerald-900 text-white px-8 py-3 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-800 transition-all">
                    Request Consultation
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.slice(0, 5).map((appt) => (
                    <motion.div 
                      key={appt.id}
                      whileHover={{ x: 10 }}
                      className="bg-white rounded-[1.5rem] p-6 border border-emerald-50 shadow-xl shadow-emerald-900/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all group hover:border-emerald-200"
                    >
                      <div className="flex items-center space-x-5">
                        <div className="bg-ivory-50 p-4 rounded-2xl group-hover:bg-emerald-50 transition-colors">
                          <Stethoscope className="w-6 h-6 text-emerald-700" />
                        </div>
                        <div>
                          <h4 className="font-serif font-bold italic text-xl text-emerald-950 mb-1 leading-none">{appt.doctorName}</h4>
                          <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                            <span className="small-caps text-emerald-600">{appt.status}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-8 sm:text-right border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-50">
                        <div>
                          <p className="text-emerald-950 font-bold font-serif italic text-lg leading-none mb-1">{format(new Date(appt.date), 'EEE, MMM d, yyyy')}</p>
                          <p className="small-caps text-slate-400">{appt.time}</p>
                        </div>
                        <ChevronRight className="text-emerald-200 w-5 h-5 group-hover:text-emerald-900 group-hover:translate-x-1 transition-all" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="bg-emerald-950 p-2 rounded-lg mr-4">
                    <FileText className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-serif italic text-emerald-950">Institute Records</h2>
                </div>
                <button 
                  onClick={handleSimulateUpload}
                  disabled={uploading}
                  className="bg-ivory-50 border border-emerald-200 text-emerald-900 px-6 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-widest flex items-center hover:bg-emerald-50 transition-all disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5 mr-2" />
                  {uploading ? 'Archiving...' : 'Add Record'}
                </button>
              </div>

              {reports.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-16 text-center border border-emerald-100">
                  <FileText className="w-12 h-12 text-emerald-100 mx-auto mb-6 opacity-40" />
                  <h3 className="text-lg font-serif italic text-emerald-950 mb-2">No records found.</h3>
                  <p className="text-slate-400 text-sm font-medium">Your formal reports will appear securely here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {reports.map((report) => (
                    <motion.div 
                      key={report.id} 
                      whileHover={{ y: -4 }}
                      className="bg-white p-6 rounded-[1.5rem] border border-emerald-50 flex items-center justify-between shadow-xl shadow-emerald-900/5 group hover:border-emerald-200 transition-all"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-emerald-900 p-3 rounded-xl group-hover:bg-emerald-800 transition-colors">
                          <FileText className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <p className="font-serif font-bold italic text-emerald-950 text-base leading-none mb-1 truncate max-w-[150px]">{report.name}</p>
                          <p className="small-caps text-slate-400">{format(report.uploadDate, 'PPP')}</p>
                        </div>
                      </div>
                      <button className="text-emerald-700 font-bold text-[10px] uppercase tracking-widest hover:text-emerald-900 hover:underline underline-offset-4">Open</button>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar - Profile & Actions */}
          <div className="space-y-8">
            <div className="bg-emerald-950 rounded-[3rem] p-10 text-emerald-50 shadow-2xl shadow-emerald-950/20 relative overflow-hidden">
               <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-900/40 rounded-full blur-3xl"></div>
               <div className="relative z-10 text-center">
                  <div className="w-28 h-28 rounded-[2rem] bg-emerald-900 p-1 mx-auto mb-8 shadow-2xl">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.displayName}`} 
                      className="w-full h-full rounded-[1.8rem] object-cover bg-ivory-50"
                      alt="avatar"
                    />
                  </div>
                  <h3 className="text-3xl font-serif italic font-bold mb-1 tracking-tight">{profile?.displayName}</h3>
                  <p className="small-caps text-emerald-400/60 mb-8">{user?.email}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-900/50 backdrop-blur-md rounded-2xl p-5 border border-white/5">
                      <p className="small-caps text-emerald-200/50 mb-1">Records</p>
                      <p className="text-2xl font-serif italic font-bold">{reports.length}</p>
                    </div>
                    <div className="bg-emerald-900/50 backdrop-blur-md rounded-2xl p-5 border border-white/5">
                      <p className="small-caps text-emerald-200/50 mb-1">Consults</p>
                      <p className="text-2xl font-serif italic font-bold">{appointments.length}</p>
                    </div>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-emerald-100 shadow-xl shadow-emerald-900/5">
                <h4 className="small-caps text-emerald-600 mb-6 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" /> Daily Wellness
                </h4>
                <div className="space-y-6">
                  <div className="bg-ivory-50 p-5 rounded-2xl border border-emerald-50">
                    <p className="text-sm text-emerald-950 leading-relaxed italic font-medium">
                      "Drinking at least 8 glasses of pure water daily supports restorative clinical recovery."
                    </p>
                  </div>
                  <div className="bg-ivory-50 p-5 rounded-2xl border border-emerald-50">
                    <p className="text-sm text-emerald-950 leading-relaxed italic font-medium">
                      "A morning walk promotes heart rhythm stability and long-term vitality."
                    </p>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
