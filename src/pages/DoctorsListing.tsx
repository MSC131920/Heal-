import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Doctor } from '../types';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Calendar,
  ArrowRight,
  User
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DoctorsListing() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('All');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'doctors'));
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor));
        setDoctors(docs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === 'All' || doctor.department === filterDept;
    return matchesSearch && matchesDept;
  });

  const departments = ['All', ...new Set(doctors.map(d => d.department))];

  return (
    <div className="py-20 bg-ivory-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 space-y-10 md:space-y-0">
          <div>
            <h2 className="small-caps text-emerald-600 mb-4">Our Faculty</h2>
            <h1 className="text-5xl md:text-6xl font-serif italic text-emerald-950">Exceptional Minds.</h1>
            <p className="text-slate-500 font-medium text-lg mt-4">Consult with the most distinguished medical experts in the field.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or field..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-4 bg-white border border-emerald-100 rounded-full focus:border-emerald-500 outline-none w-full sm:w-80 transition-all font-medium text-sm shadow-xl shadow-emerald-900/5"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 shadow-xl" />
              <select
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="pl-12 pr-10 py-4 bg-white border border-emerald-100 rounded-full focus:border-emerald-500 outline-none w-full sm:w-auto appearance-none transition-all font-bold text-xs uppercase tracking-widest text-emerald-900 cursor-pointer shadow-xl shadow-emerald-900/5"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-emerald-50 shadow-sm">
            <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-emerald-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No Doctors Found</h3>
            <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doctor, idx) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
                className="bg-white rounded-[3rem] overflow-hidden border border-emerald-50 shadow-2xl shadow-emerald-950/5 group hover:border-emerald-200 transition-all flex flex-col"
              >
                <div className="aspect-[4/5] overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-700">
                  <img 
                    src={doctor.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.name}`} 
                    alt={doctor.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute top-6 right-6 bg-emerald-950 text-emerald-400 px-4 py-1.5 rounded-full flex items-center space-x-2 shadow-xl border border-white/10">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Premium Care</span>
                  </div>
                </div>
                
                <div className="p-10 flex-1 flex flex-col">
                  <div className="mb-8">
                    <span className="small-caps text-emerald-600 block mb-3">
                      {doctor.specialty}
                    </span>
                    <h3 className="text-3xl font-serif italic text-emerald-950 leading-tight mb-2">{doctor.name}</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-2" /> {doctor.department} Institute
                    </p>
                  </div>
                  
                  <p className="text-slate-500 text-sm leading-relaxed italic mb-10 flex-1">
                    "{doctor.bio}"
                  </p>
                  
                  <div className="flex items-center justify-between pt-8 border-t border-ivory-50">
                    <div className="text-slate-400 flex flex-col">
                      <span className="text-[10px] uppercase font-bold tracking-widest mb-1 opacity-50">Availability</span>
                      <span className="text-xs font-bold text-emerald-900 italic">Open for Consults</span>
                    </div>
                    <Link 
                      to={`/book/${doctor.id}`}
                      className="bg-emerald-950 text-white px-8 py-4 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-950/20 flex items-center active:scale-95"
                    >
                      Enquire <ArrowRight className="ml-2 w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
