'use client';

import { useState, useEffect } from 'react';

export default function ManualSnapshotPage() {
  const [date, setDate] = useState('');
  const [secret, setSecret] = useState('');
  const [snapshots, setSnapshots] = useState([
    { casino_name: '', total_volume: '', total_deposits: '', unique_depositors: '', new_depositors: '', avg_deposit_size: '', market_share: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState(null);

  // Set default date to yesterday
  useEffect(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    setDate(yesterday.toISOString().split('T')[0]);
  }, []);

  const addCasino = () => {
    setSnapshots([...snapshots, { casino_name: '', total_volume: '', total_deposits: '', unique_depositors: '', new_depositors: '', avg_deposit_size: '', market_share: '' }]);
  };

  const removeCasino = (index) => {
    setSnapshots(snapshots.filter((_, i) => i !== index));
  };

  const updateCasino = (index, field, value) => {
    const updated = [...snapshots];
    updated[index][field] = value;
    setSnapshots(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const payload = {
        secret,
        date: date || undefined,
        snapshots: snapshots
          .filter(s => s.casino_name.trim() !== '')
          .map(s => ({
            casino_name: s.casino_name.trim(),
            total_volume: parseFloat(s.total_volume) || 0,
            total_deposits: parseInt(s.total_deposits) || 0,
            unique_depositors: parseInt(s.unique_depositors) || 0,
            new_depositors: parseInt(s.new_depositors) || 0,
            avg_deposit_size: parseFloat(s.avg_deposit_size) || 0,
            market_share: parseFloat(s.market_share) || 0
          }))
      };

      const response = await fetch('/api/snapshots/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setResult({ success: true, message: data.message, data });
        // Clear form
        setSnapshots([{ casino_name: '', total_volume: '', total_deposits: '', unique_depositors: '', new_depositors: '', avg_deposit_size: '', market_share: '' }]);
      } else {
        setResult({ success: false, message: data.error || 'Failed to submit', details: data.details });
      }
    } catch (error) {
      setResult({ success: false, message: 'Network error', details: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSeedHistorical = async () => {
    if (!secret.trim()) {
      setSeedResult({ success: false, message: 'Please enter your secret first' });
      return;
    }

    setSeeding(true);
    setSeedResult(null);

    try {
      const response = await fetch(`/api/seed/historical?secret=${encodeURIComponent(secret)}&type=all`, {
        method: 'POST'
      });

      const data = await response.json();

      if (response.ok) {
        setSeedResult({ 
          success: true, 
          message: data.message,
          details: `Inserted ${data.inserted} snapshots across ${data.dates} dates`
        });
      } else {
        setSeedResult({ success: false, message: data.error || 'Failed to seed data', details: data.details });
      }
    } catch (error) {
      setSeedResult({ success: false, message: 'Network error', details: error.message });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Snapshot Management</h1>
        
        {/* Seed Historical Data Section */}
        <div className="bg-[#12121c] rounded-xl p-6 border border-gray-800/50 mb-6">
          <h2 className="text-lg font-semibold text-white mb-3">Seed Historical Data</h2>
          <p className="text-sm text-gray-400 mb-4">
            Seed all historical data (daily, monthly, yearly) from the hardcoded datasets. This will populate your database with ~540 snapshots.
          </p>
          <div className="flex items-center gap-3">
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Enter your SEED_SECRET"
              className="flex-1 bg-[#0a0a14] border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleSeedHistorical}
              disabled={seeding || !secret.trim()}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {seeding ? 'Seeding...' : 'Seed Historical Data'}
            </button>
          </div>
          {seedResult && (
            <div className={`mt-4 p-4 rounded-lg ${seedResult.success ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'}`}>
              <div className={`font-medium ${seedResult.success ? 'text-green-400' : 'text-red-400'}`}>
                {seedResult.success ? '✓ Success' : '✗ Error'}
              </div>
              <div className="text-sm text-gray-300 mt-1">{seedResult.message}</div>
              {seedResult.details && (
                <div className="text-xs text-gray-500 mt-2">{seedResult.details}</div>
              )}
            </div>
          )}
        </div>

        {/* Manual Entry Section */}
        <div className="bg-[#12121c] rounded-xl p-6 border border-gray-800/50">
          <h2 className="text-lg font-semibold text-white mb-3">Manual Snapshot Entry</h2>
          <p className="text-sm text-gray-400 mb-6">
            Enter casino data from Tanzanite Terminal. Market share will be calculated automatically if not provided.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-[#0a0a14] rounded-lg p-4 border border-gray-800/50">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Date (YYYY-MM-DD)</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#12121c] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Secret</label>
                  <input
                    type="password"
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    className="w-full bg-[#12121c] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                    placeholder="MANUAL_SNAPSHOT_SECRET"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                {snapshots.map((snapshot, index) => (
                  <div key={index} className="bg-[#12121c] rounded-lg p-4 border border-gray-800/50">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-medium">Casino {index + 1}</h3>
                      {snapshots.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCasino(index)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Casino Name</label>
                        <input
                          type="text"
                          value={snapshot.casino_name}
                          onChange={(e) => updateCasino(index, 'casino_name', e.target.value)}
                          className="w-full bg-[#0a0a14] border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                          placeholder="Stake"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Total Volume ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={snapshot.total_volume}
                          onChange={(e) => updateCasino(index, 'total_volume', e.target.value)}
                          className="w-full bg-[#0a0a14] border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                          placeholder="1250000.50"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Total Deposits</label>
                        <input
                          type="number"
                          value={snapshot.total_deposits}
                          onChange={(e) => updateCasino(index, 'total_deposits', e.target.value)}
                          className="w-full bg-[#0a0a14] border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                          placeholder="15234"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Unique Depositors</label>
                        <input
                          type="number"
                          value={snapshot.unique_depositors}
                          onChange={(e) => updateCasino(index, 'unique_depositors', e.target.value)}
                          className="w-full bg-[#0a0a14] border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                          placeholder="8234"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">New Depositors</label>
                        <input
                          type="number"
                          value={snapshot.new_depositors}
                          onChange={(e) => updateCasino(index, 'new_depositors', e.target.value)}
                          className="w-full bg-[#0a0a14] border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                          placeholder="456"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Avg Deposit ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={snapshot.avg_deposit_size}
                          onChange={(e) => updateCasino(index, 'avg_deposit_size', e.target.value)}
                          className="w-full bg-[#0a0a14] border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                          placeholder="82.15"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Market Share (%)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={snapshot.market_share}
                          onChange={(e) => updateCasino(index, 'market_share', e.target.value)}
                          className="w-full bg-[#0a0a14] border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                          placeholder="25.5"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addCasino}
                className="mt-4 px-4 py-2 bg-[#1a1a2e] hover:bg-[#252540] text-gray-300 rounded-lg text-sm font-medium transition-colors"
              >
                + Add Casino
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Snapshots'}
            </button>
          </form>

          {result && (
            <div className={`mt-6 p-4 rounded-lg ${result.success ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'}`}>
              <div className={`font-medium ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                {result.success ? '✓ Success' : '✗ Error'}
              </div>
              <div className="text-sm text-gray-300 mt-1">{result.message}</div>
              {result.details && (
                <div className="text-xs text-gray-500 mt-2">{result.details}</div>
              )}
              {result.data && (
                <div className="text-xs text-gray-400 mt-2">
                  Inserted {result.data.snapshots?.length || 0} snapshots for {result.data.date}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
