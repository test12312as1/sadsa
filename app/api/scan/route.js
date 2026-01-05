import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

export async function POST(req) {
  try {
    const { address } = await req.json();
    const cleanAddress = address.trim().toLowerCase();

    // 1. Validate Config
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const ALCHEMY_KEY = 'B8Nnbz96dzhR6p3-krIJO'; 

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      // Fallback: If DB is broken, return empty to prevent crash
      console.error('Missing Supabase Keys');
      return NextResponse.json({ found: 0, matches: [] });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // 2. Get User's Live History (Who did they talk to?)
    const res = await fetch(`https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0', id: 1, method: 'alchemy_getAssetTransfers',
        params: [{
          fromAddress: cleanAddress,
          category: ['external', 'erc20'],
          maxCount: "0x64", // Check last 100 transactions
          excludeZeroValue: true
        }]
      })
    });
    
    const alchemyData = await res.json();
    const transfers = alchemyData.result?.transfers || [];
    
    // 3. Extract Recipients
    const recipients = [...new Set(transfers.map(tx => tx.to?.toLowerCase()).filter(Boolean))];

    if (recipients.length === 0) {
      return NextResponse.json({ found: 0, matches: [] });
    }

    // 4. CROSS-REFERENCE with Database
    // "Are any of these recipients in our list of known casino proxies?"
    const { data: hits, error } = await supabase
      .from('known_proxies')
      .select('address, casino_name')
      .in('address', recipients);

    if (error) {
      console.error('Supabase Error:', error);
      throw error;
    }

    // 5. Format Matches with dates and calculate totals
    const matches = transfers
      .filter(tx => hits?.some(h => h.address === tx.to?.toLowerCase()))
      .map(tx => {
        const hit = hits.find(h => h.address === tx.to?.toLowerCase());
        // Handle value conversion - Alchemy returns values in wei for ETH, convert to ETH
        let value = 0;
        if (tx.value) {
          // If hex string, convert to decimal first
          if (typeof tx.value === 'string' && tx.value.startsWith('0x')) {
            value = parseInt(tx.value, 16) / 1e18;
          } else {
            // If already decimal string or number, check if it's in wei (very large number)
            const numValue = typeof tx.value === 'string' ? parseFloat(tx.value) : tx.value;
            // If value > 1e10, it's likely in wei, convert to ETH
            value = numValue > 1e10 ? numValue / 1e18 : numValue;
          }
        }
        return {
          proxy: tx.to,
          casinoName: hit?.casino_name || 'Unknown',
          value: value.toFixed(4),
          valueRaw: value,
          hash: tx.hash,
          timestamp: tx.metadata?.blockTimestamp || null,
          date: tx.metadata?.blockTimestamp ? new Date(tx.metadata.blockTimestamp).toISOString() : null
        };
      });

    // 6. Calculate totals by casino
    const casinoTotals = {};
    matches.forEach(m => {
      if (!casinoTotals[m.casinoName]) {
        casinoTotals[m.casinoName] = {
          totalETH: 0,
          count: 0,
          lastDeposit: null
        };
      }
      casinoTotals[m.casinoName].totalETH += m.valueRaw;
      casinoTotals[m.casinoName].count += 1;
      if (m.date && (!casinoTotals[m.casinoName].lastDeposit || m.date > casinoTotals[m.casinoName].lastDeposit)) {
        casinoTotals[m.casinoName].lastDeposit = m.date;
      }
    });

    // Convert to array and sort by total
    const casinoBreakdown = Object.entries(casinoTotals)
      .map(([name, data]) => ({
        casino: name,
        totalETH: data.totalETH,
        count: data.count,
        lastDeposit: data.lastDeposit
      }))
      .sort((a, b) => b.totalETH - a.totalETH);

    const totalETH = matches.reduce((sum, m) => sum + m.valueRaw, 0);

    return NextResponse.json({
      address: cleanAddress,
      found: matches.length,
      totalETH: totalETH,
      matches: matches,
      casinoBreakdown: casinoBreakdown
    });

  } catch (err) {
    console.error('Scan Error:', err);
    return NextResponse.json({ error: 'Scan Failed' }, { status: 500 });
  }
}
