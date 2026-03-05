import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-24 h-24 rounded-3xl bg-indigo-600/10 text-indigo-500 flex items-center justify-center mb-8"
      >
        <BookOpen className="h-12 w-12" />
      </motion.div>
      
      <h1 className="text-6xl font-black text-zinc-100 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-zinc-300 mb-6">Vault Entry Not Found</h2>
      <p className="text-zinc-500 max-w-md mb-10">
        The page you are looking for doesn't exist or has been moved to a different sector of the MindVault.
      </p>
      
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
      >
        <Home className="h-5 w-5" />
        Return to Safety
      </Link>
    </div>
  );
}
