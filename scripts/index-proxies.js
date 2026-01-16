/**
 * PROXY INDEXER
 * 
 * Run this script locally to populate the known_proxies table.
 * This fetches all incoming transactions to casino hot wallets
 * and stores the sender addresses as known deposit proxies.
 * 
 * Usage: node scripts/index-proxies.js
 */

const { createClient } = require('@supabase/supabase-js');

// --- CONFIG ---
const SUPABASE_URL = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'YOUR_SERVICE_ROLE_KEY';
const ALCHEMY_KEY = process.env.ALCHEMY_KEY || 'YOUR_ALCHEMY_KEY';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const ALCHEMY_URL = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`;

// Casino hot wallets to index
// These are the main deposit addresses for each casino
const CASINO_HOT_WALLETS = {
  "0x68416debc20d13e5ef694cdcac9506f4c1a20184": "500 Casino",
  "0x014435b1e39945cf4f5f0c3cbb5833195a95cc9b": "Duelbits",
  "0x580450dff316ae00d0fbef9621a304020a046ce2": "Gamdom",
  "0x7b09fc3bdd9a1eb0059f0c9d391f5d684e0f9918": "Duel",
  "0xcbd6832ebc203e49e2b771897067fce3c58575ac": "Rollbit",
  "0xc94ebb328ac25b95db0e0aa968371885fa516215": "Roobet",
  "0xa26148ae51fa8e787df319c04137602cc018b521": "Roobet",
  // Add more casino addresses as you discover them
};

async function fetchTransfersToAddress(address, casinoName) {
  console.log(`\n🎯 Indexing: ${casinoName} (${address})`);
  
  let pageKey = undefined;
  let totalProxies = 0;
  let page = 0;

  while (true) {
    try {
      const response = await fetch(ALCHEMY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'alchemy_getAssetTransfers',
          params: [{
            toAddress: address,
            category: ['external', 'erc20', 'internal'],
            maxCount: '0x3E8', // 1000 per page
            excludeZeroValue: true,
            pageKey: pageKey
          }]
        })
      });

      const data = await response.json();
      
      if (data.error) {
        console.error(`❌ Alchemy error:`, data.error);
        break;
      }

      const transfers = data.result?.transfers || [];
      pageKey = data.result?.pageKey;

      if (transfers.length === 0) {
        console.log(`   No more transfers found.`);
        break;
      }

      // Extract unique sender addresses (these are the deposit proxies)
      // Deduplicate within the batch to avoid ON CONFLICT errors
      const proxyMap = new Map();
      transfers.forEach(tx => {
        const addr = tx.from.toLowerCase();
        if (!proxyMap.has(addr)) {
          proxyMap.set(addr, {
            address: addr,
            casino_name: casinoName,
            last_seen: new Date().toISOString()
          });
        }
      });
      const proxies = Array.from(proxyMap.values());

      // Upsert to database
      const { error } = await supabase
        .from('known_proxies')
        .upsert(proxies, { 
          onConflict: 'address',
          ignoreDuplicates: true // Skip duplicates
        });

      if (error) {
        console.error(`   ❌ DB Error:`, error.message);
      } else {
        totalProxies += proxies.length;
        page++;
        process.stdout.write(`   📦 Page ${page}: ${proxies.length} proxies (Total: ${totalProxies})\r`);
      }

      // Rate limit protection
      await new Promise(r => setTimeout(r, 200));

      if (!pageKey) {
        console.log(`\n   ✅ Completed: ${totalProxies} total proxies indexed`);
        break;
      }
    } catch (e) {
      console.error(`   ❌ Network error:`, e.message);
      console.log(`   Retrying in 2 seconds...`);
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  return totalProxies;
}

async function main() {
  console.log('🚀 Starting Proxy Indexer\n');
  console.log('━'.repeat(50));
  
  let grandTotal = 0;
  const startTime = Date.now();

  for (const [address, name] of Object.entries(CASINO_HOT_WALLETS)) {
    const count = await fetchTransfersToAddress(address, name);
    grandTotal += count;
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  
  console.log('\n' + '━'.repeat(50));
  console.log(`\n🏁 INDEXING COMPLETE`);
  console.log(`   Total proxies indexed: ${grandTotal.toLocaleString()}`);
  console.log(`   Duration: ${duration}s`);
  console.log(`   Casinos indexed: ${Object.keys(CASINO_HOT_WALLETS).length}`);
}

main().catch(console.error);
