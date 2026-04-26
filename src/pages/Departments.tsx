import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Department } from '../types';
import { motion } from 'motion/react';
import { 
  Activity, 
  Heart, 
  Brain, 
  Stethoscope, 
  Baby, 
  Bone, 
  Eye, 
  Dna,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const iconMap: Record<string, any> = {
  Activity, Heart, Brain, Stethoscope, Baby, Bone, Eye, Dna
};

export default function Departments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'departments'));
        const depts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Department));
        setDepartments(depts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDepts();
  }, []);

  const defaultDepts: Partial<Department>[] = [
    { name: 'Cardiology', description: 'Heart and vascular system care with advanced diagnostics.', iconName: 'Heart' },
    { name: 'Neurology', description: 'Expertise in brain, spinal cord, and nerve disorders.', iconName: 'Brain' },
    { name: 'Pediatrics', description: 'Specialized medical care for infants, children, and adolescents.', iconName: 'Baby' },
    { name: 'Orthopedics', description: 'Treatment for musculoskeletal injuries and conditions.', iconName: 'Bone' },
    { name: 'Ophthalmology', description: 'Comprehensive eye care and surgical procedures.', iconName: 'Eye' },
    { name: 'General Medicine', description: 'Primary healthcare for common illnesses and checkups.', iconName: 'Stethoscope' },
    { name: 'Genetics', description: 'Consultation and testing for hereditary medical conditions.', iconName: 'Dna' },
    { name: 'Emergency', description: '24/7 immediate trauma and acute care services.', iconName: 'Activity' }
  ];

  const displayedDepts = departments.length > 0 ? departments : defaultDepts as Department[];

  return (
    <div className="py-32 bg-ivory-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div className="max-w-2xl text-left">
            <h2 className="small-caps text-emerald-600 mb-6">Our Infrastructure</h2>
            <h1 className="text-5xl md:text-7xl font-serif italic text-emerald-950 mb-8 leading-[0.9]">Specialized <br/>Medical Wings.</h1>
            <p className="text-slate-500 font-medium text-lg leading-relaxed">
              Explore the institute's formal divisions. Each department represents a core pillar of our medical excellence and research.
            </p>
          </div>
          <div className="hidden md:block pb-2">
            <div className="h-[2px] w-32 bg-emerald-950"></div>
          </div>
        </div>

        {loading && departments.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayedDepts.map((dept, idx) => {
              const Icon = iconMap[dept.iconName || 'Activity'] || Activity;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.8 }}
                  className="bg-white p-10 rounded-[2.5rem] border border-emerald-100 shadow-2xl shadow-emerald-950/[0.03] hover:bg-emerald-950 transition-all group"
                >
                  <div className="bg-ivory-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-emerald-900 group-hover:text-emerald-400 transition-colors">
                    <Icon className="w-7 h-7 text-emerald-700 transition-colors" />
                  </div>
                  <h3 className="text-2xl font-serif italic font-bold text-emerald-950 mb-4 group-hover:text-white">{dept.name}</h3>
                  <p className="text-slate-400 text-sm mb-10 leading-relaxed font-medium group-hover:text-emerald-200/50">
                    {dept.description}
                  </p>
                  <Link to="/doctors" className="flex items-center text-emerald-700 font-bold text-[10px] uppercase tracking-widest group-hover:text-emerald-400">
                    Faculty <ArrowRight className="ml-2 w-3.5 h-3.5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
