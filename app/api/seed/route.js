import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge'; 

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    if (searchParams.get('secret') !== 'admin123') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
    const ALCHEMY_KEY = 'B8Nnbz96dzhR6p3-krIJO'; 

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return NextResponse.json({ error: 'Missing Config' }, { status: 500 });

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const CASINOS = {
      '0x7b09fc3bdd9a1eb0059f0c9d391f5d684e0f9918': 'Duel',
      '0x25091a14125b2f293627993a469796796245009a': 'Duel',
      '0x974caa59e49682cda0ad2bbe82983419a2ecc400': 'Stake',
      '0xb1f8e55c7f64d203c1400b9d8555d050f9458991': 'Stake',
      '0x68416debc20d13e5ef694cdcac9506f4c1a20184': '500 Casino',
      '0xcbd6832ebc203e49e2b771897067fce3c58575ac': 'Rollbit',
      '0xc94ebb328ac25b95db0e0aa968371885fa516215': 'Roobet'
    };

    let totalSaved = 0;
    const results = {};

    // LOOP through each casino
    for (const [address, name] of Object.entries(CASINOS)) {
      let pageKey = undefined;
      let loopCount = 0;
      let casinoCount = 0;

      // SAFETY LIMIT: Run 5 loops per casino (5 * 1000 = 5,000 txs per casino per run)
      // We limit this to prevent Vercel from timing out.
      while (loopCount < 5) {
        try {
          const res = await fetch(`https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0', id: 1, method: 'alchemy_getAssetTransfers',
              params: [{
                toAddress: address,
                category: ['external', 'erc20', 'internal'],
                maxCount: "0x3E8", // 1000 transactions (Hex)
                excludeZeroValue: true,
                pageKey: pageKey // <--- This asks for the NEXT page
              }]
            })
          });

          const data = await res.json();
          const transfers = data.result?.transfers || [];
          pageKey = data.result?.pageKey; // Get the key for the next loop

          if (transfers.length === 0) break;

          const proxies = transfers.map(tx => ({
            address: tx.from.toLowerCase(),
            casino_name: name,
            last_seen: new Date().toISOString()
          }));

          const { error } = await supabase
            .from('known_proxies')
            .upsert(proxies, { onConflict: 'address', ignoreDuplicates: true });

          if (!error) {
            casinoCount += proxies.length;
            totalSaved += proxies.length;
          }

          // If no more pages, stop early
          if (!pageKey) break;

          loopCount++;

        } catch (e) {
          console.error(`Error loop ${loopCount} for ${name}`, e);
          break;
        }
      }
      results[name] = casinoCount;
    }

    return NextResponse.json({ 
      success: true, 
      message: `Indexed ${totalSaved} new proxies (Deep Scan)`, 
      details: results 
    });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
