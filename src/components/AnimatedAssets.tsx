import { motion } from 'motion/react';

export const StudentTutorSVG = () => (
  <motion.svg
    viewBox="0 0 400 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-auto max-w-lg"
    initial="initial"
    animate="animate"
  >
    {/* Tutor */}
    <motion.circle
      cx="120"
      cy="100"
      r="40"
      fill="url(#tutor_grad)"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    />
    <motion.rect
      x="80"
      y="150"
      width="80"
      height="100"
      rx="20"
      fill="url(#tutor_grad)"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.8 }}
    />
    
    {/* Student */}
    <motion.circle
      cx="280"
      cy="140"
      r="35"
      fill="url(#student_grad)"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.8 }}
    />
    <motion.rect
      x="245"
      y="185"
      width="70"
      height="80"
      rx="15"
      fill="url(#student_grad)"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.8 }}
    />

    {/* Interaction Lines/Sparkles */}
    <motion.path
      d="M180 120 Q200 100 220 120"
      stroke="#2563eb"
      strokeWidth="4"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 1, duration: 1 }}
    />
    
    <defs>
      <linearGradient id="tutor_grad" x1="120" y1="60" x2="120" y2="250" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2563eb" />
        <stop offset="1" stopColor="#1d4ed8" />
      </linearGradient>
      <linearGradient id="student_grad" x1="280" y1="105" x2="280" y2="265" gradientUnits="userSpaceOnUse">
        <stop stopColor="#7c3aed" />
        <stop offset="1" stopColor="#6d28d9" />
      </linearGradient>
    </defs>
  </motion.svg>
);
