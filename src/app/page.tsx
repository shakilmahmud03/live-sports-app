'use client';

import { useEffect, useState } from 'react';
import { getSupabase } from './supabase';
import { Tv, Radio } from 'lucide-react';
import LivePlayer from './components/LivePlayer';

interface Match {
  id: string;
  title: string;
  category: string;
  status: string;
  server1_name: string;
  server1_url: string;
  server1_type: 'hls' | 'iframe';
  server2_name?: string;
  server2_url?: string;
  server2_type?: 'hls' | 'iframe';
}

export default function Home() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [activeServer, setActiveServer] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
    async function fetchMatches() {
      try {
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from('matches')
          .select('*')
          .order('created_at', { ascending: false });

        console.log('Supabase Data:', data);
        if (error) {
          console.error('Supabase Error Details:', error);
        }

        if (!error && data) {
          setMatches(data as Match[]);
          if (data.length > 0) setSelectedMatch(data[0] as Match);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchMatches();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
        <p className="animate-pulse">Loading Live Streams...</p>
      </div>
    );
  }

  const currentStreamUrl = activeServer === 1 ? selectedMatch?.server1_url : selectedMatch?.server2_url;
  const currentStreamType = (activeServer === 1 ? selectedMatch?.server1_type : selectedMatch?.server2_type) || 'hls';

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Tv className="text-red-500 h-6 w-6" />
          <h1 className="text-xl font-bold tracking-wide">SPORTS<span className="text-red-500">LIVE</span></h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse"></span>
          <span className="text-sm font-semibold uppercase tracking-wider text-red-500">Live Hub</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-4">
          {selectedMatch && currentStreamUrl ? (
            <>
              <LivePlayer streamUrl={currentStreamUrl} streamType={currentStreamType} />

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase bg-red-950 border border-red-800 text-red-400 px-2 py-0.5 rounded font-bold">
                    {selectedMatch.category}
                  </span>
                  <h2 className="text-lg md:text-xl font-bold mt-1 text-white">{selectedMatch.title}</h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Servers:</span>
                  <button
                    onClick={() => setActiveServer(1)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                      activeServer === 1 ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {selectedMatch.server1_name}
                  </button>
                  {selectedMatch.server2_url && (
                    <button
                      onClick={() => setActiveServer(2)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                        activeServer === 2 ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {selectedMatch.server2_name}
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="aspect-video w-full flex items-center justify-center bg-slate-900 rounded-xl border border-slate-800">
              <p className="text-slate-400">No active match found</p>
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <h3 className="text-sm font-semibold uppercase text-slate-400 flex items-center gap-2">
            <Radio className="h-4 w-4 text-red-500" /> Matches
          </h3>
          <div className="space-y-2">
            {matches.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setSelectedMatch(m);
                  setActiveServer(1);
                }}
                className={`w-full text-left p-4 rounded-xl border transition flex items-center justify-between ${
                  selectedMatch?.id === m.id
                    ? 'bg-slate-800 border-red-500/50 shadow-md'
                    : 'bg-slate-900 border-slate-800 hover:bg-slate-850'
                }`}
              >
                <div>
                  <span className="text-xs text-slate-400">{m.category}</span>
                  <p className="font-semibold text-white text-sm line-clamp-1">{m.title}</p>
                </div>
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}