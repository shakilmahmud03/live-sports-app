'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Match {
  id: string | number;
  title: string;
  category: string;
  status: string;
  server1_name: string;
  server1_url: string;
  server1_type: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);

  // ফর্মের ফিল্ডগুলো
  const [formData, setFormData] = useState({
    title: '',
    category: 'Cricket',
    status: 'live',
    server1_name: 'Server 1',
    server1_url: '',
    server1_type: 'hls',
    server2_name: 'Server 2',
    server2_url: '',
    server2_type: 'iframe',
  });

  const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'shakil@admin2026';

  // ম্যাচ ফেচ করার ফাংশন
  const fetchMatches = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('id', { ascending: false });
      
    if (!error && data) {
      setMatches(data);
    }
    setLoading(false);
  };

  // ইউজার অথেনটিকেটেড হলে স্বয়ংক্রিয়ভাবে ম্যাচ ফেচ হবে
  useEffect(() => {
    if (isAuthenticated) {
      fetchMatches();
    }
  }, [isAuthenticated]);

  // লগইন হ্যান্ডলার
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_SECRET) {
      setIsAuthenticated(true);
    } else {
      alert('ভুল পাসওয়ার্ড!');
    }
  };

  // নতুন ম্যাচ ইনসার্ট করা
  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.server1_url) {
      alert('টাইটেল এবং সার্ভার ১ এর লিঙ্ক বাধ্যতামূলক!');
      return;
    }

    const { error } = await supabase.from('matches').insert([formData]);
    if (error) {
      alert('ম্যাচ যোগ করতে সমস্যা হয়েছে: ' + error.message);
    } else {
      alert('ম্যাচ সফলভাবে যোগ হয়েছে!');
      setFormData({
        title: '',
        category: 'Cricket',
        status: 'live',
        server1_name: 'Server 1',
        server1_url: '',
        server1_type: 'hls',
        server2_name: 'Server 2',
        server2_url: '',
        server2_type: 'iframe',
      });
      fetchMatches();
    }
  };

  // ম্যাচ ডিলিট করা
  const handleDelete = async (id: string | number) => {
    if (confirm('আপনি কি নিশ্চিত যে এই ম্যাচটি ডিলিট করতে চান?')) {
      const { error } = await supabase.from('matches').delete().eq('id', id);
      if (error) {
        alert('ডিলিট করা যায়নি: ' + error.message);
      } else {
        setMatches(matches.filter((m) => m.id !== id));
      }
    }
  };

  // লগইন না থাকলে পাসওয়ার্ড স্ক্রিন
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-sm w-full space-y-4 shadow-xl">
          <h2 className="text-xl font-bold text-white text-center">Admin Access</h2>
          <input
            type="password"
            placeholder="Enter Secret Key"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-red-500"
          />
          <button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded-lg transition">
            Unlock Dashboard
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold">Match Manager Dashboard</h1>
        <button onClick={() => setIsAuthenticated(false)} className="text-sm bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg">
          Logout
        </button>
      </div>

      {/* ম্যাচ অ্যাড ফর্ম */}
      <form onSubmit={handleCreateMatch} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <h2 className="text-lg font-semibold text-red-400">Add New Match</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Match Title (e.g. BD vs WI 2nd Test)"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="bg-slate-800 border border-slate-700 p-2.5 rounded-lg text-white"
          />
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="bg-slate-800 border border-slate-700 p-2.5 rounded-lg text-white"
          >
            <option value="Cricket">Cricket</option>
            <option value="Football">Football</option>
            <option value="Other">Other</option>
          </select>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="bg-slate-800 border border-slate-700 p-2.5 rounded-lg text-white"
          >
            <option value="live">Live</option>
            <option value="upcoming">Upcoming</option>
            <option value="ended">Ended</option>
          </select>
        </div>

        {/* Server 1 Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <input
            type="text"
            placeholder="Server 1 Name"
            value={formData.server1_name}
            onChange={(e) => setFormData({ ...formData, server1_name: e.target.value })}
            className="bg-slate-800 border border-slate-700 p-2.5 rounded-lg text-white"
          />
          <input
            type="text"
            placeholder="Server 1 Stream URL (.m3u8 or embed)"
            value={formData.server1_url}
            onChange={(e) => setFormData({ ...formData, server1_url: e.target.value })}
            className="bg-slate-800 border border-slate-700 p-2.5 rounded-lg text-white"
          />
          <select
            value={formData.server1_type}
            onChange={(e) => setFormData({ ...formData, server1_type: e.target.value })}
            className="bg-slate-800 border border-slate-700 p-2.5 rounded-lg text-white"
          >
            <option value="hls">HLS (.m3u8)</option>
            <option value="iframe">Iframe Embed</option>
          </select>
        </div>

        {/* Server 2 Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <input
            type="text"
            placeholder="Server 2 Name"
            value={formData.server2_name}
            onChange={(e) => setFormData({ ...formData, server2_name: e.target.value })}
            className="bg-slate-800 border border-slate-700 p-2.5 rounded-lg text-white"
          />
          <input
            type="text"
            placeholder="Server 2 Stream URL"
            value={formData.server2_url}
            onChange={(e) => setFormData({ ...formData, server2_url: e.target.value })}
            className="bg-slate-800 border border-slate-700 p-2.5 rounded-lg text-white"
          />
          <select
            value={formData.server2_type}
            onChange={(e) => setFormData({ ...formData, server2_type: e.target.value })}
            className="bg-slate-800 border border-slate-700 p-2.5 rounded-lg text-white"
          >
            <option value="iframe">Iframe Embed</option>
            <option value="hls">HLS (.m3u8)</option>
          </select>
        </div>

        <button type="submit" className="bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-2.5 rounded-lg transition">
          Save & Publish Match
        </button>
      </form>

      {/* বর্তমান ম্যাচ তালিকা */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Active Matches ({matches.length})</h2>
        {loading ? (
          <p className="text-slate-400">Loading matches...</p>
        ) : (
          <div className="grid gap-3">
            {matches.map((item) => (
              <div key={item.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">{item.title}</h3>
                  <p className="text-xs text-slate-400">
                    Category: {item.category} | Status: <span className="text-emerald-400 uppercase">{item.status}</span> | Server: {item.server1_type}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white px-3 py-1.5 rounded-lg text-sm transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}