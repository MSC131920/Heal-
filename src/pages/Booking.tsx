import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../App';
import { Doctor } from '../types';
import { motion } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  MessageSquare,
  ArrowRight,
  ChevronLeft,
  CheckCircle2
} from 'lucide-react';
import { format, addDays, startOfToday } from 'date-fns';

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
];

export default function Booking() {
  const { doctorId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!doctorId) return;
      const docRef = doc(db, 'doctors', doctorId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDoctor({ id: docSnap.id, ...docSnap.data() } as Doctor);
      }
      setLoading(false);
    };
    fetchDoctor();
  }, [doctorId]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !doctor || !selectedTime) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'appointments'), {
        patientId: user.uid,
        doctorId: doctor.id,
        doctorName: doctor.name,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        status: 'pending',
        notes,
        createdAt: Date.now()
      });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error(err);
      alert('Failed to book appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div></div>;
  if (!doctor) return <div className="p-12 text-center text-slate-600">Doctor not found.</div>;

  const dates = Array.from({ length: 7 }, (_, i) => addDays(startOfToday(), i));

  return (
    <div className="py-20 bg-ivory-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <button onClick={() => navigate(-1)} className="flex items-center text-slate-400 font-bold text-xs uppercase tracking-widest mb-12 hover:text-emerald-900 transition-colors group">
          <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Return
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Doctor Info Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-[2.5rem] p-8 border border-emerald-100 shadow-2xl shadow-emerald-950/5 sticky top-24">
              <div className="aspect-square rounded-[2rem] overflow-hidden mb-8 shadow-2xl grayscale hover:grayscale-0 transition-all duration-700">
                <img 
                  src={doctor.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.name}`} 
                  className="w-full h-full object-cover"
                  alt={doctor.name}
                />
              </div>
              <h2 className="text-2xl font-serif italic font-bold text-emerald-950 mb-1">{doctor.name}</h2>
              <p className="small-caps text-emerald-600 mb-6">{doctor.specialty}</p>
              <div className="space-y-4 pt-8 border-t border-ivory-50">
                <div className="flex items-start text-xs text-slate-500 leading-relaxed italic">
                  <MapPin className="w-3.5 h-3.5 mr-3 text-emerald-400 shrink-0" />
                  <span>Located at the {doctor.department} Institute wing.</span>
                </div>
                <div className="flex items-start text-xs text-slate-500 leading-relaxed italic">
                  <Clock className="w-3.5 h-3.5 mr-3 text-emerald-400 shrink-0" />
                  <span>Formal medical consultation (15m).</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="md:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-[3rem] p-12 border border-emerald-100 shadow-2xl shadow-emerald-950/5 relative overflow-hidden"
            >
              {success ? (
                <div className="text-center py-20">
                  <div className="bg-ivory-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-3xl font-serif italic text-emerald-950 mb-3">Encounter Recorded.</h3>
                  <p className="text-slate-400 font-medium">Your request is being processed by the institute concierge.</p>
                </div>
              ) : (
                <form onSubmit={handleBooking} className="space-y-12">
                  <div>
                    <h3 className="small-caps text-emerald-600 mb-6 flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-2" /> 01. Appointment Date
                    </h3>
                    <div className="flex space-x-4 overflow-x-auto pb-6 scrollbar-hide">
                      {dates.map((date, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedDate(date)}
                          className={`flex flex-col items-center justify-center min-w-[80px] h-28 rounded-[1.5rem] border transition-all ${
                            format(selectedDate, 'PP') === format(date, 'PP')
                              ? 'bg-emerald-950 border-emerald-950 text-white shadow-2xl shadow-emerald-950/30 -translate-y-1'
                              : 'bg-ivory-50 border-emerald-50 text-slate-400 hover:border-emerald-200'
                          }`}
                        >
                          <span className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-60">{format(date, 'EEE')}</span>
                          <span className="text-2xl font-serif italic font-bold">{format(date, 'd')}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="small-caps text-emerald-600 mb-6 flex items-center">
                      <Clock className="w-4 h-4 mr-2" /> 02. Secure Time Window
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                            selectedTime === time
                              ? 'bg-emerald-900 border-emerald-900 text-white shadow-xl shadow-emerald-900/20'
                              : 'bg-ivory-50 border-emerald-50 text-slate-400 hover:border-emerald-200'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="small-caps text-emerald-600 mb-6 flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2" /> 03. Medical Directives
                    </h3>
                    <textarea
                      placeholder="Specify requirements or preliminary symptoms..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full p-6 bg-ivory-50 border border-emerald-50 rounded-[1.5rem] outline-none focus:border-emerald-500 min-h-[160px] transition-all font-medium text-slate-700 italic text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedTime}
                    className="w-full bg-emerald-950 text-white font-bold text-xs uppercase tracking-[0.3em] py-6 rounded-full hover:bg-emerald-800 transition-all flex items-center justify-center space-x-3 shadow-2xl shadow-emerald-950/30 active:scale-95 disabled:opacity-30"
                  >
                    <span>{isSubmitting ? 'Authenticating...' : 'Submit Request'}</span>
                    {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
