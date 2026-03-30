import { motion } from 'motion/react';
import { StudentTutorSVG } from './AnimatedAssets';
import { ArrowRight, CheckCircle, Users, GraduationCap } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden mesh-gradient">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 text-brand-primary font-semibold text-sm mb-6 border border-brand-primary/20 shadow-sm"
            >
              <CheckCircle size={16} />
              Dinajpur's #1 Rated Agency
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-7xl font-bold font-display tracking-tight text-slate-900 mb-6"
            >
              Unlock Your Potential with <span className="text-brand-primary">Tutor Tech</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0"
            >
              Connecting Dinajpur's brightest students with verified expert tutors. 
              Personalized home tutoring for academic excellence and admission success.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <button className="w-full sm:w-auto px-8 py-4 bg-brand-primary text-white rounded-2xl font-semibold shadow-lg shadow-brand-primary/30 hover:bg-brand-primary/90 transition-all flex items-center justify-center gap-2 group">
                Find a Tutor
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-semibold hover:bg-slate-50 transition-all">
                Become a Tutor
              </button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex items-center justify-center lg:justify-start gap-8 border-t border-slate-200 pt-8"
            >
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Users className="text-brand-primary" size={24} />
                  500+
                </span>
                <span className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Active Students</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="text-brand-secondary" size={24} />
                  150+
                </span>
                <span className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Verified Tutors</span>
              </div>
            </motion.div>
          </div>
          
          <div className="flex-1 w-full max-w-2xl">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-primary/20 blur-3xl rounded-full transform -rotate-12"></div>
              <div className="glass-card p-8 rounded-[2.5rem] relative z-10">
                <StudentTutorSVG />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
