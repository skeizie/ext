import React, { useState, useEffect } from "react";
import { Header, Footer } from "../components/Layout";
import { 
  Send, 
  Mail, 
  MessageSquare, 
  Search, 
  ChevronDown, 
  ChevronUp,
  Loader2,
  AlertCircle
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export function Contact() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [openTickets, setOpenTickets] = useState<Set<string>>(new Set());
  
  // Form state
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-db9c8b65/support`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      console.error("Failed to load forum posts");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validation for Gmail
    if (!email.toLowerCase().endsWith("@gmail.com")) {
      setError("Please use a valid @gmail.com address to submit a support request.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-db9c8b65/support`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ email, subject, message })
      });
      
      if (res.ok) {
        setSuccess(true);
        setEmail("");
        setSubject("");
        setMessage("");
        loadTickets(); // Refresh list
      } else {
        throw new Error("Failed to send message");
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTicket = (id: string) => {
    const next = new Set(openTickets);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setOpenTickets(next);
  };

  const filteredTickets = tickets.filter(t => 
    (t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
     t.message.toLowerCase().includes(searchQuery.toLowerCase())) &&
    t.reply // Only show answered ones in the public forum
  );

  return (
    <div className="min-h-screen bg-background text-foreground dark selection:bg-brand-accent/30">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Support Form */}
          <section className="bg-card border border-white/5 p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-brand-accent/5">
            <div className="mb-10">
              <h1 className="text-4xl font-bold text-white mb-4">Contact Support</h1>
              <p className="text-muted-foreground leading-relaxed">
                Have a question or found a bug? Send me a message and I'll get back to you as soon as possible. 
                <span className="block mt-2 font-bold text-brand-accent/80">Note: We only accept support requests from Gmail accounts.</span>
              </p>
            </div>

            {success ? (
              <div className="bg-brand-accent/10 border border-brand-accent/20 p-8 rounded-3xl text-center animate-in zoom-in duration-300">
                <div className="w-16 h-16 bg-brand-accent/20 text-brand-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-muted-foreground mb-8">I've received your request and will look into it shortly.</p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="px-8 py-4 bg-brand-accent rounded-2xl font-bold text-white hover:bg-brand-accent/90 transition-all"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center space-x-3 text-red-500 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/50 uppercase tracking-widest ml-1">Gmail Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                    <input 
                      type="email"
                      required
                      placeholder="yourname@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:ring-2 focus:ring-brand-accent/50 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/50 uppercase tracking-widest ml-1">Subject</label>
                  <input 
                    type="text"
                    required
                    placeholder="What do you need help with?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:ring-2 focus:ring-brand-accent/50 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/50 uppercase tracking-widest ml-1">Message</label>
                  <textarea 
                    required
                    rows={5}
                    placeholder="Describe your issue or question in detail..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:ring-2 focus:ring-brand-accent/50 outline-none transition-all resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-brand-accent hover:bg-brand-accent/90 disabled:opacity-50 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-brand-accent/20 flex items-center justify-center space-x-3 text-lg"
                >
                  {submitting ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-6 h-6" />
                      <span>Send Request</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </section>

          {/* FAQ / Forum */}
          <section className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4 flex items-center space-x-3">
                <MessageSquare className="w-8 h-8 text-brand-accent" />
                <span>Support Forum</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Browse common questions and answers from the community. Your question might already be answered here!
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
              <input 
                type="text"
                placeholder="Search forum..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:ring-2 focus:ring-brand-accent/50 outline-none transition-all"
              />
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="py-20 flex justify-center">
                  <Loader2 className="w-10 h-10 animate-spin text-brand-accent/20" />
                </div>
              ) : filteredTickets.length === 0 ? (
                <div className="py-20 text-center bg-white/2 border border-dashed border-white/5 rounded-3xl">
                  <p className="text-muted-foreground">No matching forum posts found.</p>
                </div>
              ) : (
                filteredTickets.map((ticket) => (
                  <div 
                    key={ticket.id} 
                    className="bg-card border border-white/5 rounded-3xl overflow-hidden hover:border-brand-accent/30 transition-all group"
                  >
                    <button 
                      onClick={() => toggleTicket(ticket.id)}
                      className="w-full p-6 flex justify-between items-center text-left"
                    >
                      <div>
                        <h4 className="font-bold text-white group-hover:text-brand-accent transition-colors">{ticket.subject}</h4>
                        <p className="text-xs text-muted-foreground mt-1">Answered by Admin</p>
                      </div>
                      {openTickets.has(ticket.id) ? (
                        <ChevronUp className="w-6 h-6 text-white/30" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-white/30" />
                      )}
                    </button>
                    
                    {openTickets.has(ticket.id) && (
                      <div className="p-6 pt-0 space-y-4 animate-in slide-in-from-top-2 duration-300">
                        <div className="bg-white/5 p-4 rounded-2xl">
                          <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2">Question</p>
                          <p className="text-white/70 italic leading-relaxed">"{ticket.message}"</p>
                        </div>
                        <div className="bg-brand-accent/5 border border-brand-accent/10 p-6 rounded-2xl">
                          <p className="text-xs font-bold text-brand-accent uppercase tracking-widest mb-2">Answer</p>
                          <p className="text-white/90 leading-relaxed">{ticket.reply}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Contact;
