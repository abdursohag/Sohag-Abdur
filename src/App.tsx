import { motion } from 'motion/react';
import { Routes, Route, Link } from 'react-router-dom';
import { ParentForm, MediaFeeCalculator, TutorForm } from './components/Forms';
import { Hero } from './components/Hero';
import { Search, ShieldCheck, Zap, Star, MapPin, Mail, Phone, Facebook } from 'lucide-react';
import AreaLandingPage from './pages/AreaLandingPage';

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
    <div className="container mx-auto px-6 h-20 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">T</div>
        <span className="font-display font-bold text-2xl tracking-tight">Tutor Tech</span>
      </Link>
      <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
        <Link to="/" className="hover:text-brand-primary transition-colors">Home</Link>
        <a href="#services" className="hover:text-brand-primary transition-colors">Services</a>
        <a href="#areas" className="hover:text-brand-primary transition-colors">Areas</a>
        <a href="#tutor-apply" className="hover:text-brand-primary transition-colors">Become a Tutor</a>
      </div>
      <Link to="/portal" className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all">
        Login
      </Link>
    </div>
  </nav>
);

const HomePage = () => (
  <>
    <Hero />
    
    {/* Features Section */}
    <section id="services" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold font-display mb-4">Why Choose Tutor Tech?</h2>
          <p className="text-slate-600">We've streamlined the tutoring process to ensure safety, quality, and results.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: ShieldCheck, title: "Verified Tutors", desc: "Every tutor undergoes a rigorous background and academic check.", color: "bg-blue-50 text-blue-600" },
            { icon: Zap, title: "Instant Matching", desc: "Our algorithm finds the best match for your needs within 24 hours.", color: "bg-purple-50 text-purple-600" },
            { icon: Star, title: "Proven Results", desc: "95% of our students show significant improvement in their grades.", color: "bg-amber-50 text-amber-600" }
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all"
            >
              <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6`}>
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Lead Generation Section */}
    <section id="areas" className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="flex-1">
            <h2 className="text-4xl font-bold font-display mb-6">Find the Perfect Tutor Today</h2>
            <p className="text-slate-600 mb-10">Fill out the form below and let us handle the rest. We'll match you with a tutor who fits your schedule, budget, and academic goals.</p>
            
            <div className="glass-card p-8 rounded-[2.5rem]">
              <ParentForm />
            </div>
          </div>
          
          <div className="w-full lg:w-[400px] space-y-8">
            <MediaFeeCalculator />
            
            <div className="p-8 bg-brand-primary rounded-3xl text-white">
              <h4 className="font-bold text-xl mb-4 flex items-center gap-2">
                <Search size={24} />
                Areas We Cover
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {['Balubari', 'Suihari', 'Mission Road', 'Ghashipara', 'Paharpur', 'Kalitola'].map((area, i) => (
                  <Link 
                    key={i} 
                    to={`/area/${area.toLowerCase().replace(' ', '-')}`}
                    className="flex items-center gap-2 text-brand-primary-foreground/80 hover:text-white transition-colors"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                    {area}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Tutor Application Section */}
    <section id="tutor-apply" className="py-24 bg-white border-t border-slate-100">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-display mb-4">Become a Verified Tutor</h2>
            <p className="text-slate-600">Join Dinajpur's most professional tutoring network and start earning today.</p>
          </div>
          <div className="glass-card p-10 rounded-[2.5rem]">
            <TutorForm />
          </div>
        </div>
      </div>
    </section>

    {/* FAQ Section */}
    <section id="faq" className="py-24 bg-slate-50">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-4xl font-bold font-display text-center mb-16">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            { q: "How do you verify tutors?", a: "We verify academic certificates, NID, and conduct a personal interview for every tutor." },
            { q: "What is the media fee?", a: "We charge a one-time 50% commission from the tutor's first month's salary. No charges for parents." },
            { q: "Can I change my tutor?", a: "Yes, if you're not satisfied after the first 2 trial classes, we'll provide a replacement at no extra cost." }
          ].map((faq, i) => (
            <div key={i} className="p-6 rounded-2xl border border-slate-100 bg-white hover:border-brand-primary/20 transition-all">
              <h4 className="font-bold text-lg mb-2">{faq.q}</h4>
              <p className="text-slate-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>
);

const Footer = () => (
  <footer className="bg-slate-900 text-white pt-20 pb-10">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">T</div>
            <span className="font-display font-bold text-2xl tracking-tight">Tutor Tech</span>
          </div>
          <p className="text-slate-400 max-w-sm mb-8">
            Dinajpur's premier home tutoring agency. We provide verified, high-quality tutors for students of all levels.
          </p>
          <div className="flex gap-4">
            <a href="https://www.facebook.com/share/18M5kBSg19/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-primary transition-all">
              <Facebook size={20} />
            </a>
            <a href="mailto:bewithtutortech@gmail.com" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-primary transition-all">
              <Mail size={20} />
            </a>
            <a href="https://wa.me/8801700590261" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-primary transition-all">
              <Phone size={20} />
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-slate-400">
            <li><Link to="/" className="hover:text-white transition-colors">Find a Tutor</Link></li>
            <li><a href="#tutor-apply" className="hover:text-white transition-colors">Become a Tutor</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Media Fee Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">Contact Us</h4>
          <ul className="space-y-4 text-slate-400">
            <li className="flex items-center gap-3">
              <MapPin size={18} className="text-brand-primary" />
              Mission Road, Dinajpur
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-brand-primary" />
              +880 1700 590261 (WhatsApp)
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-brand-primary" />
              bewithtutortech@gmail.com
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
        © 2026 Tutor Tech - Dinajpur. All rights reserved. Built for 2026 SEO.
      </div>
    </div>
  </footer>
);

import AdminDashboard from './pages/AdminDashboard';
import ParentPortal from './pages/ParentPortal';

export default function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/portal" element={<ParentPortal />} />
        <Route path="*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/area/balubari" element={<AreaLandingPage areaName="Balubari" keywords={['Math Specialist', 'Physics', 'HSC']} />} />
              <Route path="/area/suihari" element={<AreaLandingPage areaName="Suihari" keywords={['English Medium', 'Admission', 'Chemistry']} />} />
              <Route path="/area/mission-road" element={<AreaLandingPage areaName="Mission Road" keywords={['Medical Prep', 'Biology', 'Engineering']} />} />
            </Routes>
            <Footer />
          </>
        } />
      </Routes>
    </div>
  );
}
