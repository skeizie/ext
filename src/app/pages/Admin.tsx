import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { Lock, Mail, Loader2 } from "lucide-react";
import { supabase } from "../supabaseClient";

export function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSetup, setIsSetup] = useState(false);
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkStatus = async (retries = 3) => {
      try {
        const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-db9c8b65/status`, {
          headers: { 
            'Authorization': `Bearer ${publicAnonKey}`,
            'apikey': publicAnonKey
          }
        });
        if (!res.ok) throw new Error("Status check failed");
        const data = await res.json();
        setIsInitialized(data.initialized);
      } catch (err) {
        if (retries > 0) {
          setTimeout(() => checkStatus(retries - 1), 1000);
        } else {
          // If it still fails, assume it's initialized for safety
          setIsInitialized(true);
          console.warn("System status check failed after retries:", err);
        }
      }
    };
    checkStatus();

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkSession();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSetup) {
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-db9c8b65/signup`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${publicAnonKey}`,
            'apikey': publicAnonKey
          },
          body: JSON.stringify({ email, password, name: 'Admin' })
        });
        const result = await response.json();
        if (result.error) throw new Error(result.error);
        alert("Account created! You can now sign in.");
        setIsSetup(false);
      } else {
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (loginError) throw loginError;
        if (data.session) navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Failed to authenticate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 dark">
      <div className="w-full max-w-md bg-card border border-white/5 p-8 rounded-3xl shadow-2xl shadow-brand-accent/5">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-accent/10 text-brand-accent mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white">{isSetup ? "Create Admin" : "Admin Login"}</h1>
          <p className="text-muted-foreground text-sm mt-2">
            {isSetup ? "Set up your management credentials" : "Sign in to manage your extensions"}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-accent hover:bg-brand-accent/90 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center space-x-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span>{isSetup ? "Create Account" : "Sign In"}</span>
            )}
          </button>

          {isInitialized === false && (
            <button
              type="button"
              onClick={() => setIsSetup(!isSetup)}
              className="w-full text-xs text-muted-foreground hover:text-brand-accent transition-colors py-2"
            >
              {isSetup ? "Already have an account? Sign in" : "Need to set up an admin account?"}
            </button>
          )}
        </form>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Protected by Supabase Auth
        </p>
      </div>
    </div>
  );
}
