import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  Plus, 
  LogOut, 
  Trash2, 
  BookOpen, 
  Search, 
  Calendar, 
  Clock,
  ChevronRight,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from './store/authStore';
import { cn, getGreeting } from './lib/utils';
import { format } from 'date-fns';
import NotFound from './pages/NotFound';

// --- Components ---

const VaultEntrance = () => {
  const setAuth = useAuthStore(state => state.setAuth);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleUnlock = async () => {
    setIsUnlocking(true);
    try {
      // Attempt to login with demo credentials
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'demo@mindvault.io', password: 'demo-password-123' }),
      });

      if (!res.ok) {
        // If demo user doesn't exist, register it
        const regRes = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'Demo Explorer', email: 'demo@mindvault.io', password: 'demo-password-123' }),
        });
        
        if (regRes.ok) {
          const data = await regRes.json();
          setAuth(data.user, data.token);
          toast.success('Vault Unlocked. Welcome, Explorer.');
          return;
        }
      } else {
        const data = await res.json();
        setAuth(data.user, data.token);
        toast.success('Vault Unlocked. Welcome back, Explorer.');
        return;
      }
      
      throw new Error('Demo initialization failed');
    } catch (err) {
      console.error(err);
      // Fallback to local-only guest mode if server is unavailable
      setAuth({ id: -1, name: 'Guest Explorer', email: 'guest@mindvault.demo' }, 'guest-token');
      toast.info('Entering as Guest (Local Session)');
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0502] flex items-center justify-center font-serif selection:bg-orange-500/30">
      {/* Immersive Background (Recipe 7: Atmospheric) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,#3a1510_0%,transparent_60%)] opacity-80 blur-[80px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_80%,#ff4e00_0%,transparent_50%)] opacity-40 blur-[80px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-center px-6 max-w-2xl"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.02, 1],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 mx-auto mb-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-2xl flex items-center justify-center shadow-[0_0_60px_rgba(255,78,0,0.15)]"
        >
          <BookOpen className="h-10 w-10 text-orange-500/80" />
        </motion.div>

        <h1 className="text-6xl md:text-8xl font-light tracking-tighter text-white mb-6 drop-shadow-2xl">
          MindVault
        </h1>
        
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent mx-auto mb-8" />

        <p className="text-zinc-400 text-lg md:text-xl max-w-md mx-auto mb-16 font-sans font-light leading-relaxed tracking-wide">
          A digital sanctuary for your most profound reflections. 
          <span className="block mt-2 text-zinc-600 italic text-base">Secure. Private. Timeless.</span>
        </p>

        <button
          onClick={handleUnlock}
          disabled={isUnlocking}
          className="group relative px-16 py-5 bg-transparent border border-white/10 rounded-full overflow-hidden transition-all duration-500 hover:border-orange-500/40 hover:scale-105 active:scale-95"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="relative z-10 text-white font-sans tracking-[0.2em] uppercase text-xs font-semibold flex items-center gap-4">
            {isUnlocking ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                Synchronizing...
              </>
            ) : (
              <>
                Unlock the Vault
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </>
            )}
          </span>
        </button>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-20 flex items-center justify-center gap-12 opacity-20 grayscale hover:opacity-40 transition-opacity duration-700"
        >
          <div className="flex flex-col items-center gap-2">
            <Clock className="h-5 w-5 text-white" />
            <span className="text-[9px] uppercase tracking-[0.3em] font-sans">Ephemeral</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Plus className="h-5 w-5 text-white" />
            <span className="text-[9px] uppercase tracking-[0.3em] font-sans">Infinite</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Search className="h-5 w-5 text-white" />
            <span className="text-[9px] uppercase tracking-[0.3em] font-sans">Insight</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Footer Micro-detail */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-20 text-[10px] uppercase tracking-[0.5em] text-white font-sans pointer-events-none">
        Demo Experience v1.0
      </div>
    </div>
  );
};

const Button = ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }: any) => {
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20',
    secondary: 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700',
    danger: 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20',
    ghost: 'bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button 
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant as keyof typeof variants],
        sizes[size as keyof typeof sizes],
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

const Input = ({ className, ...props }: any) => (
  <input 
    className={cn(
      'w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all',
      className
    )}
    {...props}
  />
);

const Modal = ({ isOpen, onClose, title, children }: any) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-zinc-100">{title}</h3>
            <button onClick={onClose} className="text-zinc-500 hover:text-zinc-100 transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// --- Pages ---

const Dashboard = () => {
  const { user, token, logout } = useAuthStore();
  const [journals, setJournals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchJournals = async () => {
    try {
      const res = await fetch('/api/journals', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned invalid response format');
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load journals');
      
      if (Array.isArray(data)) {
        setJournals(data);
      } else {
        console.error('Expected array of journals, got:', data);
        setJournals([]);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to load journals');
      setJournals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournals();
    // Load draft from local storage
    const draft = localStorage.getItem('mindvault-draft');
    if (draft) {
      const { title, content } = JSON.parse(draft);
      setNewTitle(title);
      setNewContent(content);
    }
  }, []);

  // Auto-save draft
  useEffect(() => {
    if (newTitle || newContent) {
      localStorage.setItem('mindvault-draft', JSON.stringify({ title: newTitle, content: newContent }));
    }
  }, [newTitle, newContent]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const res = await fetch('/api/journals', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: newTitle, content: newContent }),
      });
      if (res.ok) {
        setNewTitle('');
        setNewContent('');
        localStorage.removeItem('mindvault-draft');
        setIsModalOpen(false);
        fetchJournals();
        toast.success('Journal entry saved to vault');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to save journal entry');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/journals/${deleteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setJournals(prev => Array.isArray(prev) ? prev.filter(j => j.id !== deleteId) : []);
        setDeleteId(null);
        toast.success('Entry deleted successfully');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete entry');
    }
  };

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully');
  };

  const filteredJournals = Array.isArray(journals) ? journals.filter(j => 
    j.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    j.content?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const wordCount = newContent.trim() ? newContent.trim().split(/\s+/).length : 0;
  const charLimit = 2000;
  const charProgress = (newContent.length / charLimit) * 100;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">MindVault</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium text-zinc-100">{user?.name}</span>
              <span className="text-xs text-zinc-500">{user?.email}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-5 w-5 md:mr-2" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-12">
        {/* Welcome Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-bold text-zinc-100 mb-2"
            >
              {getGreeting(user?.name || '')}
            </motion.h2>
            <p className="text-zinc-500">Capture your thoughts, dreams, and daily reflections.</p>
          </div>
          <Button size="lg" onClick={() => setIsModalOpen(true)} className="rounded-2xl h-14 px-8">
            <Plus className="h-6 w-6 mr-2" />
            New Entry
          </Button>
        </div>

        {/* Search & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search your journals..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Total Entries</p>
                <p className="text-xl font-bold">{journals.length}</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-zinc-700" />
          </div>
        </div>

        {/* Journal List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-500 mb-4" />
            <p className="text-zinc-500">Loading your vault...</p>
          </div>
        ) : filteredJournals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredJournals.map((journal, index) => (
                <motion.div
                  key={journal.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-zinc-900/40 border border-zinc-800 hover:border-indigo-500/50 rounded-3xl p-6 transition-all hover:shadow-2xl hover:shadow-indigo-500/5 cursor-pointer relative overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 bg-zinc-800/50 px-3 py-1 rounded-full">
                      <Clock className="h-3 w-3" />
                      {format(new Date(journal.created_at), 'MMM d, yyyy')}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(journal.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-100 mb-3 line-clamp-1 group-hover:text-indigo-400 transition-colors">{journal.title}</h3>
                  <p className="text-zinc-400 line-clamp-4 leading-relaxed text-sm">{journal.content}</p>
                  
                  <div className="mt-6 pt-6 border-t border-zinc-800/50 flex items-center justify-between">
                    <span className="text-xs text-zinc-600 font-medium">
                      {journal.content.split(/\s+/).length} words
                    </span>
                    <ChevronRight className="h-4 w-4 text-zinc-700 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-24 h-24 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 shadow-inner">
              <BookOpen className="h-10 w-10 text-zinc-700" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-100 mb-2">Your vault is empty</h3>
            <p className="text-zinc-500 max-w-sm mb-8">Every great story starts with a single word. Begin your journey today by creating your first entry.</p>
            <Button size="lg" onClick={() => setIsModalOpen(true)}>
              <Plus className="h-5 w-5 mr-2" />
              Start Journaling
            </Button>
          </motion.div>
        )}
      </main>

      {/* New Entry Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="New Journal Entry"
      >
        <form onSubmit={handleCreate} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 ml-1">Title</label>
            <Input 
              placeholder="What's on your mind?" 
              value={newTitle} 
              onChange={(e: any) => setNewTitle(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-medium text-zinc-400">Content</label>
              <span className="text-xs text-zinc-500">{wordCount} words</span>
            </div>
            <textarea 
              className="w-full h-64 bg-zinc-900/50 border border-zinc-800 rounded-2xl px-4 py-4 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
              placeholder="Write your thoughts here..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              maxLength={charLimit}
              required
            />
            <div className="flex items-center gap-4">
              <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  className={cn("h-full transition-colors", charProgress > 90 ? "bg-red-500" : "bg-indigo-500")}
                  initial={{ width: 0 }}
                  animate={{ width: `${charProgress}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                {newContent.length} / {charLimit}
              </span>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" isLoading={isCreating}>Save Entry</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        title="Delete Entry"
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
            <Trash2 className="h-8 w-8" />
          </div>
          <p className="text-zinc-300 mb-8">Are you sure you want to delete this entry? This action cannot be undone.</p>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" className="flex-1" onClick={handleDelete}>Delete Forever</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// --- Auth Wrapper ---

const AuthWrapper = () => {
  const { token } = useAuthStore();

  if (!token) {
    return <VaultEntrance />;
  }

  return <Dashboard />;
};

// --- Main App ---

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthWrapper />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
