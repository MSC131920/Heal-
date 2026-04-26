import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ShieldCheck, 
  Calendar, 
  Stethoscope, 
  Clock, 
  Star,
  Activity,
  Heart,
  Brain,
  ChevronRight
} from 'lucide-react';

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 md:pt-32 md:pb-48 bg-ivory-50">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-emerald-100/30 rounded-full blur-3xl opacity-60"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center space-x-2 bg-emerald-900 text-emerald-100 px-5 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold mb-8 shadow-xl shadow-emerald-900/10">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Excellence in Care since 1994</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-serif font-bold text-emerald-950 italic leading-[0.9] mb-8">
                Medicine as an <span className="text-emerald-700 underline decoration-emerald-200 underline-offset-8">Art Form.</span>
              </h1>
              <p className="text-lg text-slate-500 mb-12 leading-relaxed max-w-lg font-medium">
                Our institute combines clinical precision with a refined environment, ensuring your journey to recovery is guided by world-class experts.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                <Link to="/doctors" className="bg-emerald-900 text-white px-10 py-5 rounded-full font-bold text-sm uppercase tracking-widest flex items-center justify-center hover:bg-emerald-800 transition-all shadow-2xl shadow-emerald-900/20 active:scale-95">
                  Book Consultation <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <Link to="/departments" className="bg-transparent text-emerald-900 border border-emerald-900/20 px-10 py-5 rounded-full font-bold text-sm uppercase tracking-widest flex items-center justify-center hover:bg-emerald-50 transition-all active:scale-95">
                  The Institute
                </Link>
              </div>
              
              <div className="mt-12 flex items-center space-x-8">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=doctor${i}`} className="w-12 h-12 rounded-full border-4 border-white bg-slate-100" alt="patient" />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center text-amber-500 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-slate-600 font-medium">4.9/5 Average Patient Rating</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-emerald-200 aspect-[4/5] max-w-md mx-auto">
                <img 
                  src="https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&q=80&w=800" 
                  alt="Medical professional" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Floating Cards */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-4 top-1/4 bg-white p-4 rounded-2xl shadow-xl border border-emerald-50 flex items-center space-x-3"
              >
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <Activity className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Heart Rate</p>
                  <p className="text-lg font-bold text-slate-800">72 BPM</p>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -right-8 bottom-1/4 bg-white p-4 rounded-2xl shadow-xl border border-emerald-50 flex items-center space-x-3"
              >
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Next Slot</p>
                  <p className="text-lg font-bold text-slate-800">10:30 AM</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="small-caps text-emerald-600 mb-4">Our Expertise</h2>
              <h3 className="text-5xl font-serif italic text-emerald-950 leading-tight">Advanced Medical Care, Delivered with Human Warmth.</h3>
            </div>
            <p className="text-slate-500 max-w-xs text-sm leading-relaxed pb-2">
              We operate at the intersection of medical innovation and personalized attention.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Emergency Care', icon: Activity, description: 'Instant surgical and acute intervention available 24/7.' },
              { title: 'Cardiology', icon: Heart, description: 'Leaders in metabolic and heart rhythm diagnostics.' },
              { title: 'Neurology', icon: Brain, description: 'Specialized focus on neurodegenerative restoration.' },
              { title: 'Primary Care', icon: Stethoscope, description: 'The foundation of lifelong well-being and prevention.' }
            ].map((service, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className="bg-ivory-50 p-10 rounded-[2.5rem] border border-emerald-100 transition-all group hover:bg-emerald-900"
              >
                <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center mb-10 shadow-sm group-hover:bg-emerald-800">
                  <service.icon className="w-7 h-7 text-emerald-700 group-hover:text-emerald-100" />
                </div>
                <h4 className="text-2xl font-serif font-bold italic text-emerald-950 mb-4 group-hover:text-white">{service.title}</h4>
                <p className="text-slate-500 leading-relaxed text-sm mb-10 group-hover:text-emerald-100/60 truncate-2-lines">{service.description}</p>
                <Link to="/departments" className="text-emerald-700 font-bold text-xs uppercase tracking-widest inline-flex items-center group-hover:text-emerald-400">
                  Explore <ArrowRight className="ml-2 w-3.5 h-3.5" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800" 
                alt="Hospital interior" 
                className="rounded-[2.5rem] shadow-2xl"
              />
            </div>
            <div className="lg:w-1/2">
              <h3 className="text-4xl font-bold text-slate-900 mb-8 leading-tight">Better Healthcare for a <span className="text-emerald-600">Better Life</span></h3>
              <div className="space-y-6">
                {[
                  { title: 'Advanced Technology', description: 'Equipped with the latest medical diagnostics and therapeutic technology.' },
                  { title: 'Certified Doctors', description: 'All our medical professionals are highly experienced and board-certified.' },
                  { title: 'Patient-First Approach', description: 'We design our services around your comfort and health outcomes.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-4">
                    <div className="bg-emerald-100 p-2 rounded-full mt-1">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-slate-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Link to="/signup" className="inline-block bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all">
                  Join Our Community
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
