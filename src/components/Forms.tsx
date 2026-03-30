import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'motion/react';
import { Calculator, Send, AlertCircle, Star } from 'lucide-react';
import { useState } from 'react';

const parentSchema = z.object({
  subject: z.string().min(2, 'Subject is required'),
  studentClass: z.string().min(1, 'Class is required'),
  area: z.string().min(2, 'Area is required'),
  budget: z.string().min(1, 'Budget is required'),
  urgency: z.boolean(),
  phone: z.string().regex(/^(\+88)?01[3-9]\d{8}$/, 'Invalid BD phone number'),
});

type ParentFormData = z.infer<typeof parentSchema>;

export const ParentForm = ({ defaultArea }: { defaultArea?: string }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [matches, setMatches] = useState<any[]>([]);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ParentFormData>({
    resolver: zodResolver(parentSchema),
    defaultValues: {
      urgency: false,
      area: defaultArea || '',
    }
  });

  const onSubmit = async (data: ParentFormData) => {
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      setMatches(result.matches || []);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting lead:', error);
      // Fallback if server fails
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="glass-card p-8 rounded-3xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-2">Request Sent!</h3>
          <p className="text-slate-600">We've analyzed your requirements.</p>
        </div>

        {matches.length > 0 ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h4 className="font-bold text-lg text-slate-800 border-b pb-2">Top Matched Tutors:</h4>
            {matches.map((tutor, idx) => (
              <div key={idx} className="p-4 border border-slate-200 rounded-2xl bg-white flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <h5 className="font-bold text-brand-primary text-lg">{tutor.name}</h5>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{tutor.subjects.join(', ')} • {tutor.areas.join(', ')}</p>
                  <div className="flex items-center gap-1 mt-2 text-amber-500 text-sm font-bold">
                    <Star size={14} className="fill-amber-500" /> {tutor.rating}
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <div className="font-bold text-slate-700 text-lg">৳{tutor.rate}<span className="text-xs font-normal text-slate-400">/mo</span></div>
                  {tutor.isAvailableNow ? (
                    <span className="text-[10px] px-2.5 py-1 bg-green-100 text-green-700 rounded-full font-bold uppercase tracking-wider">Available Now</span>
                  ) : (
                    <span className="text-[10px] px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-bold uppercase tracking-wider">Busy</span>
                  )}
                </div>
              </div>
            ))}
            <p className="text-xs text-center text-slate-500 mt-4 pt-4">Our coordinator will call you shortly to finalize the trial class.</p>
          </div>
        ) : (
          <p className="text-center text-slate-500 mt-4">Our team is manually reviewing your request to find the perfect match. We will contact you within 24 hours.</p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Subject</label>
          <input
            {...register('subject')}
            placeholder="e.g. Physics, Math"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
          />
          {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Student Class</label>
          <select
            {...register('studentClass')}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
          >
            <option value="">Select Class</option>
            <option value="9">Class 9</option>
            <option value="10">Class 10</option>
            <option value="HSC-1">HSC 1st Year</option>
            <option value="HSC-2">HSC 2nd Year</option>
            <option value="Admission">Admission</option>
          </select>
          {errors.studentClass && <p className="text-red-500 text-xs mt-1">{errors.studentClass.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Area (Dinajpur)</label>
        <select
          {...register('area')}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
        >
          <option value="">Select Area</option>
          <option value="Balubari">Balubari</option>
          <option value="Suihari">Suihari</option>
          <option value="Mission Road">Mission Road</option>
          <option value="Ghashipara">Ghashipara</option>
          <option value="Paharpur">Paharpur</option>
        </select>
        {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Monthly Budget (BDT)</label>
          <input
            {...register('budget')}
            type="number"
            placeholder="e.g. 5000"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
          />
          {errors.budget && <p className="text-red-500 text-xs mt-1">{errors.budget.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
          <input
            {...register('phone')}
            placeholder="017XXXXXXXX"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-brand-primary/5 rounded-xl border border-brand-primary/10">
        <input
          type="checkbox"
          {...register('urgency')}
          className="w-5 h-5 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
        />
        <label className="text-sm font-medium text-slate-700">
          Need a tutor within 24 hours? (Urgent)
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-brand-primary text-white rounded-2xl font-bold hover:bg-brand-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSubmitting ? 'Processing...' : 'Find My Tutor'}
      </button>
    </form>
  );
};

export const MediaFeeCalculator = () => {
  const [salary, setSalary] = useState<number>(5000);
  const mediaFee = salary * 0.5;

  return (
    <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-xl">
      <div className="flex items-center gap-2 mb-6 text-brand-primary">
        <Calculator size={24} />
        <h4 className="font-bold uppercase tracking-wider text-sm">Media Fee Calculator</h4>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Expected Monthly Salary</label>
          <input
            type="range"
            min="2000"
            max="20000"
            step="500"
            value={salary}
            onChange={(e) => setSalary(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-primary"
          />
          <div className="flex justify-between mt-2 text-xl font-bold">
            <span>৳{salary}</span>
          </div>
        </div>

        <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700">
          <div className="flex justify-between items-center mb-1">
            <span className="text-slate-400 text-sm">One-time Media Fee (50%)</span>
            <span className="text-brand-primary font-bold">৳{mediaFee}</span>
          </div>
          <p className="text-[10px] text-slate-500 italic">
            *This fee is only applicable for the first month of tutoring.
          </p>
        </div>

        <div className="flex gap-2 items-start text-xs text-slate-400">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <p>Transparency is our priority. No hidden charges beyond the 50% media fee.</p>
        </div>
      </div>
    </div>
  );
};

const tutorSchema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^(\+88)?01[3-9]\d{8}$/, 'Invalid BD phone number'),
  background: z.string().min(10, 'Please provide more detail about your background'),
  experience: z.string().min(1, 'Experience is required'),
});

type TutorFormData = z.infer<typeof tutorSchema>;

export const TutorForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TutorFormData>({
    resolver: zodResolver(tutorSchema),
  });

  const onSubmit = async (data: TutorFormData) => {
    try {
      await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting application:', error);
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="glass-card p-8 rounded-3xl text-center">
        <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Send size={32} />
        </div>
        <h3 className="text-2xl font-bold mb-2">Application Received!</h3>
        <p className="text-slate-600">Our HR team will review your profile and contact you for an interview.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
        <input
          {...register('fullName')}
          placeholder="John Doe"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
        />
        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
          <input
            {...register('email')}
            type="email"
            placeholder="john@example.com"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Phone</label>
          <input
            {...register('phone')}
            placeholder="017XXXXXXXX"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Academic Background</label>
        <textarea
          {...register('background')}
          placeholder="e.g. B.Sc in Physics from HSTU, Dinajpur"
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
        />
        {errors.background && <p className="text-red-500 text-xs mt-1">{errors.background.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Tutoring Experience</label>
        <select
          {...register('experience')}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
        >
          <option value="">Select Experience</option>
          <option value="0-1">0-1 Year</option>
          <option value="1-3">1-3 Years</option>
          <option value="3+">3+ Years</option>
        </select>
        {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Apply Now'}
      </button>
    </form>
  );
};
