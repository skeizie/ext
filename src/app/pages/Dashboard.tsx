import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { 
  Trash2, 
  Edit3, 
  ExternalLink, 
  LogOut, 
  LayoutDashboard, 
  Package, 
  PlusCircle,
  X,
  Save,
  Loader2,
  MessageSquare
} from "lucide-react";
import { 
  fetchExtensions, 
  saveExtension, 
  deleteExtension, 
  migrateData,
  fetchTickets,
  replyToTicket,
  deleteTicket
} from "../api";
import { ChromeExtension, extensions as initialExtensions } from "../data";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { supabase } from "../supabaseClient";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

export function Dashboard() {
  const [extensions, setExtensions] = useState<ChromeExtension[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExtension, setEditingExtension] = useState<Partial<ChromeExtension> | null>(null);
  const [viewingExtension, setViewingExtension] = useState<ChromeExtension | null>(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'extensions' | 'support'>('extensions');
  const [supportTickets, setSupportTickets] = useState<any[]>([]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin");
      } else {
        setSession(session);
        loadExtensions();
        loadSupportTickets();
      }
    };
    checkSession();
  }, [navigate]);

  const loadExtensions = async () => {
    try {
      const data = await fetchExtensions();
      setExtensions(data);
    } catch (err) {
      console.error("Failed to load extensions:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadSupportTickets = async () => {
    try {
      const data = await fetchTickets();
      setSupportTickets(data);
    } catch (err) {
      console.error("Failed to load tickets:", err);
    }
  };

  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleReply = async (ticketId: string, replyText: string) => {
    if (!session) return;
    setReplyingTo(ticketId);
    try {
      await replyToTicket(ticketId, replyText, session.access_token);
      const el = document.getElementById(`reply-${ticketId}`) as HTMLTextAreaElement;
      if (el) el.value = '';
      loadSupportTickets();
    } catch (err: any) {
      console.error("Reply error:", err);
      alert(`Failed to send reply: ${err.message}`);
    } finally {
      setReplyingTo(null);
    }
  };

  const handleDeleteTicket = async (id: string) => {
    if (!session || !confirm("Are you sure you want to delete this message?")) return;
    try {
      await deleteTicket(id, session.access_token);
      loadSupportTickets();
    } catch (err: any) {
      alert(`Failed to delete: ${err.message}`);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  const handleMigrate = async () => {
    if (!session) return;
    setLoading(true);
    try {
      await migrateData(initialExtensions, session.access_token);
      await loadExtensions();
      alert("Initial data migrated successfully!");
    } catch (err) {
      alert("Migration failed");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingExtension({
      name: "",
      tagline: "",
      description: "",
      icon: "",
      screenshots: [],
      price: "Free",
      installCount: "0",
      rating: 5,
      url: "#",
      features: [""]
    });
    setIsModalOpen(true);
  };

  const openEditModal = (ext: ChromeExtension) => {
    setEditingExtension({ ...ext });
    setIsModalOpen(true);
  };

  const openViewModal = (ext: ChromeExtension) => {
    setViewingExtension(ext);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !editingExtension) return;
    setSaving(true);
    try {
      await saveExtension(editingExtension, session.access_token);
      await loadExtensions();
      setIsModalOpen(false);
      setEditingExtension(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!session || !confirm("Are you sure you want to delete this extension?")) return;
    try {
      await deleteExtension(id, session.access_token);
      await loadExtensions();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  if (loading && !extensions.length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-brand-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white dark">
      {/* Sidebar */}
      <div className="flex">
        <aside className="w-64 border-r border-white/5 h-screen sticky top-0 bg-black/20 p-6 flex flex-col">
          <div className="flex items-center space-x-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-brand-accent flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Console</span>
          </div>

          <nav className="space-y-2 flex-1">
            <button 
              onClick={() => setActiveTab('extensions')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'extensions' ? 'bg-brand-accent/10 text-brand-accent' : 'hover:bg-white/5 text-white/70'}`}
            >
              <Package className="w-5 h-5" />
              <span>Extensions</span>
            </button>
            <button 
              onClick={() => setActiveTab('support')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'support' ? 'bg-brand-accent/10 text-brand-accent' : 'hover:bg-white/5 text-white/70'}`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Support</span>
            </button>
            <a href="/" className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-white/5 text-white/70 rounded-xl font-medium transition-all">
              <ExternalLink className="w-5 h-5" />
              <span>Live Site</span>
            </a>
          </nav>

          <button 
            onClick={handleLogout}
            className="mt-auto w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-500/10 text-red-500 rounded-xl font-medium transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-10">
          {activeTab === 'extensions' ? (
            <>
              <header className="flex justify-between items-center mb-10">
                <div>
                  <h1 className="text-3xl font-bold">Extensions</h1>
                  <p className="text-muted-foreground mt-1">Manage your browser tool catalog</p>
                </div>
                <div className="flex space-x-4">
                  <button 
                    onClick={handleMigrate}
                    title="Sync from data.ts"
                    className="flex items-center space-x-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium text-sm transition-all text-white/70 hover:text-white"
                  >
                    <Save className="w-4 h-4 text-brand-accent" />
                    <span>Sync Code</span>
                  </button>
                  <button 
                    onClick={openAddModal}
                    className="flex items-center space-x-2 px-6 py-3 bg-brand-accent hover:bg-brand-accent/90 rounded-xl font-bold text-sm shadow-lg shadow-brand-accent/20 transition-all"
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span>Add Extension</span>
                  </button>
                </div>
              </header>

              <div className="grid grid-cols-1 gap-6">
                {extensions.length === 0 ? (
                  <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl bg-white/2 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                      <Package className="w-8 h-8 text-white/20" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Your database is empty</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto mb-8">
                      The dashboard reads from the database. Since you just set it up, you need to import the extensions you manually added to the code.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button 
                        onClick={handleMigrate}
                        className="flex items-center space-x-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl font-bold transition-all shadow-xl"
                      >
                        <Save className="w-5 h-5 text-brand-accent" />
                        <span>Sync from data.ts</span>
                      </button>
                      <button 
                        onClick={openAddModal}
                        className="flex items-center space-x-2 px-8 py-4 bg-brand-accent hover:bg-brand-accent/90 rounded-2xl font-bold transition-all shadow-xl shadow-brand-accent/20"
                      >
                        <PlusCircle className="w-5 h-5" />
                        <span>Add Manually</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  extensions.map((ext) => (
                    <div key={ext.id} className="bg-card border border-white/5 p-6 rounded-2xl flex items-center group hover:border-brand-accent/30 transition-all">
                      <div className="w-16 h-16 rounded-xl overflow-hidden ring-1 ring-white/10 shrink-0">
                        <ImageWithFallback src={ext.icon} alt={ext.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="ml-6 flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-bold group-hover:text-brand-accent transition-colors">{ext.name}</h3>
                          <span className="text-[10px] uppercase tracking-widest bg-brand-accent/10 text-brand-accent px-2 py-0.5 rounded-full font-bold">
                            {ext.price}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{ext.tagline}</p>
                      </div>
                      <div className="flex items-center space-x-3 ml-6">
                        <button 
                          onClick={() => openViewModal(ext)}
                          className="p-3 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-xl transition-all"
                          title="Quick View"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => openEditModal(ext)}
                          className="p-3 bg-white/5 hover:bg-brand-accent/10 hover:text-brand-accent rounded-xl transition-all"
                          title="Edit"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(ext.id)}
                          className="p-3 bg-white/5 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <>
              <header className="mb-10">
                <h1 className="text-3xl font-bold">Support Center</h1>
                <p className="text-muted-foreground mt-1">Answer questions and manage the public forum</p>
              </header>

              <div className="space-y-6">
                {supportTickets.length === 0 ? (
                  <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl bg-white/2">
                    <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-4" />
                    <p className="text-muted-foreground">No support requests yet</p>
                  </div>
                ) : (
                  supportTickets.map((ticket) => (
                    <div key={ticket.id} className="bg-card border border-white/5 p-8 rounded-3xl space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-white">{ticket.subject}</h3>
                          <p className="text-sm text-brand-accent font-medium mt-1">{ticket.email}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${ticket.reply ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                          {ticket.reply ? 'Answered' : 'Pending'}
                        </span>
                        <button 
                          onClick={() => handleDeleteTicket(ticket.id)}
                          className="p-2 ml-2 bg-white/5 hover:bg-red-500/10 text-white/30 hover:text-red-500 rounded-lg transition-all"
                          title="Delete Message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-white/70 bg-white/5 p-4 rounded-xl italic">"{ticket.message}"</p>
                      
                      {ticket.reply ? (
                        <div className="bg-brand-accent/5 border border-brand-accent/10 p-6 rounded-2xl">
                          <p className="text-xs font-bold text-brand-accent uppercase tracking-widest mb-2">Your Answer</p>
                          <p className="text-white/80">{ticket.reply}</p>
                        </div>
                      ) : (
                        <div className="pt-4">
                          <textarea 
                            id={`reply-${ticket.id}`}
                            placeholder="Type your answer here to post it to the forum..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:ring-2 focus:ring-brand-accent/50 outline-none transition-all resize-none mb-4"
                            rows={3}
                          />
                          <button 
                            disabled={replyingTo === ticket.id}
                            onClick={() => {
                              const el = document.getElementById(`reply-${ticket.id}`) as HTMLTextAreaElement;
                              if (el.value.trim()) {
                                handleReply(ticket.id, el.value.trim());
                              }
                            }}
                            className="px-6 py-3 bg-brand-accent hover:bg-brand-accent/90 disabled:opacity-50 rounded-xl font-bold transition-all flex items-center space-x-2"
                          >
                            {replyingTo === ticket.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            <span>{replyingTo === ticket.id ? 'Posting...' : 'Post Answer'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Quick View Overlay */}
      {viewingExtension && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-card border border-white/10 w-full max-w-5xl h-full max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-300">
            <header className="p-8 border-b border-white/5 flex justify-between items-center bg-white/2 shrink-0">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden ring-1 ring-white/10">
                  <ImageWithFallback src={viewingExtension.icon} alt={viewingExtension.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{viewingExtension.name}</h2>
                  <p className="text-brand-accent text-sm font-medium">{viewingExtension.tagline}</p>
                </div>
              </div>
              <button onClick={() => setViewingExtension(null)} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
                <X className="w-8 h-8" />
              </button>
            </header>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-12">
              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-6">
                {[
                  { label: "Price", value: viewingExtension.price },
                  { label: "Installs", value: viewingExtension.installCount },
                  { label: "Rating", value: viewingExtension.rating + " / 5.0" }
                ].map((stat, i) => (
                  <div key={i} className="bg-white/2 border border-white/5 rounded-2xl p-6 text-center">
                    <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-xl font-bold">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <section>
                    <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">About the Extension</h3>
                    <p className="text-lg leading-relaxed text-white/80">{viewingExtension.description}</p>
                  </section>
                  
                  <section>
                    <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">Key Features</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {viewingExtension.features?.map((feature, i) => (
                        <div key={i} className="flex items-center space-x-3 bg-white/2 p-4 rounded-xl border border-white/5">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0" />
                          <span className="text-white/70">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">Screenshots</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {viewingExtension.screenshots?.map((url, i) => (
                      <div key={i} className="aspect-video rounded-2xl overflow-hidden ring-1 ring-white/10 bg-white/5">
                        <ImageWithFallback src={url} alt={`Screenshot ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <footer className="p-8 border-t border-white/5 bg-white/2 shrink-0 flex justify-end">
              <a 
                href={viewingExtension.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-8 py-4 bg-brand-accent hover:bg-brand-accent/90 rounded-2xl font-bold transition-all shadow-xl shadow-brand-accent/20"
              >
                <ExternalLink className="w-5 h-5" />
                <span>View on Store</span>
              </a>
            </footer>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && editingExtension && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <header className="p-6 border-b border-white/5 flex justify-between items-center bg-white/2">
              <h2 className="text-xl font-bold">{editingExtension.id ? 'Edit Extension' : 'New Extension'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-lg transition-all">
                <X className="w-6 h-6" />
              </button>
            </header>
            
            <form onSubmit={handleSave} className="p-6 overflow-y-auto max-h-[80vh] space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1">Name</label>
                  <input 
                    required
                    value={editingExtension.name}
                    onChange={(e) => setEditingExtension({...editingExtension, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-accent/50 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1">Tagline</label>
                  <input 
                    required
                    value={editingExtension.tagline}
                    onChange={(e) => setEditingExtension({...editingExtension, tagline: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-accent/50 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1">Description</label>
                <textarea 
                  required
                  rows={3}
                  value={editingExtension.description}
                  onChange={(e) => setEditingExtension({...editingExtension, description: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-accent/50 outline-none transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1">Icon URL</label>
                  <input 
                    required
                    value={editingExtension.icon}
                    onChange={(e) => setEditingExtension({...editingExtension, icon: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-accent/50 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1">Store URL</label>
                  <input 
                    required
                    value={editingExtension.url}
                    onChange={(e) => setEditingExtension({...editingExtension, url: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-accent/50 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1">Screenshots (one per line)</label>
                <textarea 
                  required
                  rows={3}
                  value={editingExtension.screenshots?.join('\n')}
                  onChange={(e) => setEditingExtension({...editingExtension, screenshots: e.target.value.split('\n').filter(s => s.trim())})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-accent/50 outline-none transition-all resize-none"
                  placeholder="https://example.com/image1.jpg"
                />
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1">Price Label</label>
                  <input 
                    value={editingExtension.price}
                    onChange={(e) => setEditingExtension({...editingExtension, price: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-accent/50 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1">Installs</label>
                  <input 
                    value={editingExtension.installCount}
                    onChange={(e) => setEditingExtension({...editingExtension, installCount: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-accent/50 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1">Rating</label>
                  <input 
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={editingExtension.rating}
                    onChange={(e) => setEditingExtension({...editingExtension, rating: parseFloat(e.target.value)})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-accent/50 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1">Features (one per line)</label>
                <textarea 
                  rows={3}
                  value={editingExtension.features?.join('\n')}
                  onChange={(e) => setEditingExtension({...editingExtension, features: e.target.value.split('\n').filter(s => s.trim())})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-accent/50 outline-none transition-all resize-none"
                />
              </div>

              <div className="flex justify-end pt-4 space-x-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={saving}
                  className="flex items-center space-x-2 px-8 py-3 bg-brand-accent hover:bg-brand-accent/90 disabled:opacity-50 rounded-xl font-bold transition-all shadow-lg shadow-brand-accent/20"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  <span>Save Extension</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
