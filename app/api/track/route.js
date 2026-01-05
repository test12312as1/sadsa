import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

export async function POST(req) {
  try {
    const { address, totalETH, casinoBreakdown } = await req.json();
    const cleanAddress = address.trim().toLowerCase();

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return NextResponse.json({ success: false });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Store search record
    const { error } = await supabase
      .from('wallet_searches')
      .insert({
        address: cleanAddress,
        total_eth: totalETH || 0,
        casino_data: casinoBreakdown || [],
        searched_at: new Date().toISOString()
      });

    if (error) {
      console.error('Track Error:', error);
      // Don't fail the request if tracking fails
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Track Error:', err);
    return NextResponse.json({ success: false });
  }
}
