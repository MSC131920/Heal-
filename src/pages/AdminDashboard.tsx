import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, setDoc, doc, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../App';
import { Appointment, Doctor, UserProfile } from '../types';
import { motion } from 'motion/react';
import { 
  Users, 
  Stethoscope, 
  Calendar, 
  Settings, 
  Database,
  Trash2,
  Check,
  X,
  Filter,
  Plus,
  RefreshCw,
  Search,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'appointments' | 'doctors'>('appointments');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const apptSnap = await getDocs(query(collection(db, 'appointments'), orderBy('createdAt', 'desc')));
      setAppointments(apptSnap.docs.map(d => ({ id: d.id, ...d.data() } as Appointment)));

      const doctorSnap = await getDocs(collection(db, 'doctors'));
      setDoctors(doctorSnap.docs.map(d => ({ id: d.id, ...d.data() } as Doctor)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const seedData = async () => {
    if (!window.confirm('This will seed the database with sample doctors and departments. Continue?')) return;
    
    setLoading(true);
    try {
      // Seed Departments
      const depts = [
        { name: 'Cardiology', description: 'Heart and vascular system care.', iconName: 'Heart' },
        { name: 'Neurology', description: 'Expertise in brain and spinal cord.', iconName: 'Brain' },
        { name: 'Pediatrics', description: 'Specialized care for children.', iconName: 'Baby' },
        { name: 'Orthopedics', description: 'Musculoskeletal injuries treatment.', iconName: 'Bone' }
      ];
      
      for (const dept of depts) {
        await addDoc(collection(db, 'departments'), dept);
      }

      // Seed Doctors
      const sampleDoctors = [
        { name: 'Dr. Sarah Smith', department: 'Cardiology', specialty: 'Heart Surgeon', bio: 'Expert in bypass surgeries and cardiac rehabilitation with 15 years experience.', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400', active: true },
        { name: 'Dr. James Wilson', department: 'Neurology', specialty: 'Neurologist', bio: 'Specializes in neurodegenerative diseases and stroke recovery.', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400', active: true },
        { name: 'Dr. Emily Brown', department: 'Pediatrics', specialty: 'Child Specialist', bio: 'Dedicated to providing compassionate care for children and infants.', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400', active: true },
        { name: 'Dr. Michael Chen', department: 'Orthopedics', specialty: 'Bone Surgeon', bio: 'Expert in sports injuries and joint replacement surgeries.', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400', active: true }
      ];

      for (const doctor of sampleDoctors) {
        await addDoc(collection(db, 'doctors'), doctor);
      }

      alert('Database seeded successfully!');
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Seeding failed');
    } finally {
      setLoading(false);
    }
  };

  const updateApptStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'appointments', id), { status });
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } as Appointment : a));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteDoctor = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;
    try {
      await deleteDoc(doc(db, 'doctors', id));
      setDoctors(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredAppts = appointments.filter(a => 
    a.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-20 bg-ivory-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <h1 className="text-5xl font-serif italic text-emerald-950 mb-2">Central Operations</h1>
            <p className="text-slate-500 font-medium text-lg leading-relaxed">Hospital resource management and formal record oversight.</p>
          </div>
          <div className="flex items-center space-x-4">
             <button onClick={fetchData} className="p-4 bg-white border border-emerald-100 rounded-full hover:bg-emerald-50 transition-all text-emerald-900 shadow-xl shadow-emerald-900/5">
               <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
             </button>
             <button onClick={seedData} className="flex items-center space-x-2 bg-emerald-900 text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-emerald-800 transition-all shadow-2xl shadow-emerald-900/20 active:scale-95">
               <Database className="w-4 h-4 text-emerald-400" />
               <span>Initialize Registry</span>
             </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16">
          {[
            { label: 'Visits Logged', value: appointments.length, icon: Calendar, color: 'emerald' },
            { label: 'Experts Active', value: doctors.length, icon: Stethoscope, color: 'emerald' },
            { label: 'Awaiting Review', value: appointments.filter(a => a.status === 'pending').length, icon: Clock, color: 'amber' },
            { label: 'Nexus Status', value: 'Prime', icon: Settings, color: 'emerald' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2rem] border border-emerald-100 shadow-xl shadow-emerald-900/5 group hover:bg-emerald-950 transition-all">
              <div className="bg-ivory-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-900">
                <stat.icon className="w-5 h-5 text-emerald-900 group-hover:text-emerald-400" />
              </div>
              <p className="small-caps text-slate-400 mb-2 group-hover:text-emerald-200/50">{stat.label}</p>
              <p className="text-3xl font-serif italic font-bold text-emerald-950 group-hover:text-white leading-none">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[3rem] border border-emerald-100 shadow-2xl shadow-emerald-950/5 overflow-hidden">
          <div className="flex border-b border-ivory-50">
            <button 
              onClick={() => setActiveTab('appointments')}
              className={`flex-1 py-6 text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-3 transition-all ${activeTab === 'appointments' ? 'text-emerald-950 bg-ivory-50 border-r border-emerald-100 shadow-inner' : 'text-slate-300 hover:text-emerald-600'}`}
            >
              <Calendar className="w-4 h-4" />
              <span>Patient Schedule</span>
            </button>
            <button 
              onClick={() => setActiveTab('doctors')}
              className={`flex-1 py-6 text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-3 transition-all ${activeTab === 'doctors' ? 'text-emerald-950 bg-ivory-50 border-l border-emerald-100 shadow-inner' : 'text-slate-300 hover:text-emerald-600'}`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Medical Faculty</span>
            </button>
          </div>

          <div className="p-8">
            <div className="mb-8 relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder={`Filter ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 transition-all font-medium text-slate-700" 
              />
            </div>

            {loading ? (
              <div className="py-20 flex justify-center"><RefreshCw className="animate-spin text-emerald-600 w-10 h-10" /></div>
            ) : (
              <div className="overflow-x-auto">
                {activeTab === 'appointments' ? (
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-slate-100 uppercase text-[10px] font-black tracking-widest text-slate-400">
                        <th className="pb-4 px-4 font-bold">Patient ID</th>
                        <th className="pb-4 px-4 font-bold">Doctor</th>
                        <th className="pb-4 px-4 font-bold">Date & Time</th>
                        <th className="pb-4 px-4 font-bold text-center">Status</th>
                        <th className="pb-4 px-4 text-right font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredAppts.map((appt) => (
                        <tr key={appt.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="py-5 px-4">
                            <p className="text-sm font-bold text-slate-700 font-mono truncate max-w-[100px]">{appt.patientId}</p>
                          </td>
                          <td className="py-5 px-4">
                            <p className="text-sm font-bold text-slate-900">{appt.doctorName}</p>
                          </td>
                          <td className="py-5 px-4">
                            <p className="text-sm text-slate-700">{format(new Date(appt.date), 'MMM d, yyyy')}</p>
                            <p className="text-xs text-slate-400">{appt.time}</p>
                          </td>
                          <td className="py-5 px-4">
                            <div className="flex justify-center">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                appt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                                appt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {appt.status}
                              </span>
                            </div>
                          </td>
                          <td className="py-5 px-4 text-right">
                             <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => updateApptStatus(appt.id, 'confirmed')} className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all"><Check className="w-4 h-4" /></button>
                                <button onClick={() => updateApptStatus(appt.id, 'cancelled')} className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"><X className="w-4 h-4" /></button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {doctors.map(doctor => (
                      <div key={doctor.id} className="p-6 border border-slate-100 rounded-3xl flex items-center justify-between hover:border-emerald-200 transition-all">
                        <div className="flex items-center space-x-4">
                          <img src={doctor.image} className="w-14 h-14 rounded-2xl object-cover" alt={doctor.name} />
                          <div>
                            <p className="font-bold text-slate-900">{doctor.name}</p>
                            <p className="text-xs text-emerald-600 font-bold uppercase">{doctor.specialty}</p>
                          </div>
                        </div>
                        <button onClick={() => deleteDoctor(doctor.id)} className="p-2 text-slate-300 hover:text-red-500 transition-all">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    <button className="p-6 border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center text-slate-400 hover:border-emerald-300 hover:text-emerald-500 transition-all font-bold">
                       <Plus className="w-6 h-6 mr-2" /> Add New Doctor
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
