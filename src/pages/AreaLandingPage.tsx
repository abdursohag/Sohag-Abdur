import { motion } from 'motion/react';
import { Search, ShieldCheck, Zap, Star, MapPin, Mail, Phone, Facebook } from 'lucide-react';
import { ParentForm } from '../components/Forms';

interface AreaProps {
  areaName: string;
  keywords: string[];
}

const AreaLandingPage = ({ areaName, keywords }: AreaProps) => {
  return (
    <div className="min-h-screen pt-32 pb-20 mesh-gradient">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <h1 className="text-5xl lg:text-6xl font-bold font-display mb-6">
            Best Home Tutors in <span className="text-brand-primary">{areaName}</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Looking for expert tutoring in {areaName}? Tutor Tech connects you with the highest-rated 
            educators specializing in {keywords.join(', ')}.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {keywords.map((k, i) => (
              <span key={i} className="px-4 py-2 bg-white rounded-full border border-slate-200 text-sm font-semibold text-slate-700">
                #{k.replace(' ', '')}
              </span>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 space-y-12">
            <section className="glass-card p-10 rounded-[2.5rem]">
              <h2 className="text-3xl font-bold mb-6">Why {areaName} Parents Trust Us</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Local Verification</h4>
                    <p className="text-sm text-slate-500">We personally verify tutors residing in or near {areaName}.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Quick Matching</h4>
                    <p className="text-sm text-slate-500">Get a tutor recommendation for {areaName} within hours.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-2xl font-bold">Frequently Asked Questions for {areaName}</h3>
              {[
                { q: `Are there tutors available in ${areaName} for HSC?`, a: `Yes, we have over 40+ verified HSC specialists covering all subjects in ${areaName}.` },
                { q: `How much does a tutor cost in ${areaName}?`, a: `Rates vary by class and subject, typically ranging from 3,000 to 10,000 BDT per month.` }
              ].map((faq, i) => (
                <div key={i} className="p-6 bg-white rounded-2xl border border-slate-100">
                  <h4 className="font-bold mb-2">{faq.q}</h4>
                  <p className="text-slate-600 text-sm">{faq.a}</p>
                </div>
              ))}
            </section>
          </div>

          <div className="lg:col-span-1 sticky top-32">
            <div className="glass-card p-8 rounded-[2rem]">
              <h3 className="text-xl font-bold mb-6">Request a Tutor in {areaName}</h3>
              <ParentForm defaultArea={areaName} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaLandingPage;
