import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

export async function GET(req) {
  try {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return NextResponse.json({ 
        recentSearches: [],
        mostSearched: [],
        casinoStats: {}
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Get recent searches (last 10)
    const { data: recent } = await supabase
      .from('wallet_searches')
      .select('address, total_eth, searched_at')
      .order('searched_at', { ascending: false })
      .limit(10);

    // Get most searched wallets (by count)
    const { data: mostSearched } = await supabase
      .from('wallet_searches')
      .select('address, total_eth')
      .order('searched_at', { ascending: false })
      .limit(100);

    // Aggregate casino statistics
    const { data: allSearches } = await supabase
      .from('wallet_searches')
      .select('casino_data, total_eth');

    const casinoStats = {};
    let totalDeposited = 0;

    if (allSearches) {
      allSearches.forEach(search => {
        totalDeposited += search.total_eth || 0;
        if (search.casino_data && Array.isArray(search.casino_data)) {
          search.casino_data.forEach(casino => {
            if (!casinoStats[casino.casino]) {
              casinoStats[casino.casino] = {
                totalETH: 0,
                totalUSD: 0,
                count: 0
              };
            }
            casinoStats[casino.casino].totalETH += casino.totalETH || 0;
            casinoStats[casino.casino].count += casino.count || 0;
          });
        }
      });
    }

    // Convert to array and calculate market share
    const ETH_PRICE = 3300; // Hardcoded for now
    const casinoArray = Object.entries(casinoStats).map(([name, data]) => ({
      name,
      totalETH: data.totalETH,
      totalUSD: data.totalETH * ETH_PRICE,
      count: data.count,
      marketShare: totalDeposited > 0 ? (data.totalETH / totalDeposited) * 100 : 0
    })).sort((a, b) => b.totalETH - a.totalETH);

    // Format recent searches
    const recentFormatted = (recent || []).map(r => ({
      address: r.address,
      totalETH: r.total_eth || 0,
      searchedAt: r.searched_at
    }));

    // Get unique most searched (group by address, take highest total)
    const mostSearchedMap = {};
    (mostSearched || []).forEach(m => {
      const addr = m.address;
      if (!mostSearchedMap[addr] || (m.total_eth || 0) > mostSearchedMap[addr].totalETH) {
        mostSearchedMap[addr] = {
          address: addr,
          totalETH: m.total_eth || 0
        };
      }
    });

    const mostSearchedFormatted = Object.values(mostSearchedMap)
      .sort((a, b) => b.totalETH - a.totalETH)
      .slice(0, 10);

    return NextResponse.json({
      recentSearches: recentFormatted,
      mostSearched: mostSearchedFormatted,
      casinoStats: {
        totalDepositedETH: totalDeposited,
        totalDepositedUSD: totalDeposited * ETH_PRICE,
        byCasino: casinoArray
      }
    });

  } catch (err) {
    console.error('Stats Error:', err);
    return NextResponse.json({ 
      recentSearches: [],
      mostSearched: [],
      casinoStats: {}
    });
  }
}
