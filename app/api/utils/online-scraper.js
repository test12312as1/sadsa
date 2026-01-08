/**
 * Online Scraper
 * Scrapes casino analytics data from online sources (e.g., https://terminal.tanzanite.xyz/overview)
 */

/**
 * Scrape casino data from online source overview page
 * @returns {Promise<Array>} Array of casino data objects
 */
export async function scrapeTanzaniteTerminal() {
  try {
    const url = 'https://terminal.tanzanite.xyz/overview';
    
    // Fetch the page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://tanzanite.xyz/'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    
    // Try to extract data from JSON in script tags (common in React apps)
    const jsonData = extractJSONFromHTML(html);
    
    if (jsonData) {
      return parseTanzaniteData(jsonData);
    }

    // Fallback: Try to parse HTML table if present
    return parseHTMLTable(html);

  } catch (error) {
    console.error('Online scraping error:', error);
    throw error;
  }
}

/**
 * Extract JSON data from HTML (looks for __NEXT_DATA__ or similar)
 */
function extractJSONFromHTML(html) {
  // Try to find __NEXT_DATA__ (Next.js apps)
  const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s);
  if (nextDataMatch) {
    try {
      return JSON.parse(nextDataMatch[1]);
    } catch (e) {
      console.warn('Failed to parse __NEXT_DATA__:', e);
    }
  }

  // Try to find window.__INITIAL_STATE__ or similar
  const initialStateMatch = html.match(/window\.__INITIAL_STATE__\s*=\s*({.*?});/s);
  if (initialStateMatch) {
    try {
      return JSON.parse(initialStateMatch[1]);
    } catch (e) {
      console.warn('Failed to parse __INITIAL_STATE__:', e);
    }
  }

  // Try to find any JSON-LD or structured data
  const jsonLdMatches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/gs);
  if (jsonLdMatches) {
    for (const match of jsonLdMatches) {
      try {
        const json = JSON.parse(match.replace(/<[^>]*>/g, ''));
        if (json && typeof json === 'object') {
          return json;
        }
      } catch (e) {
        // Continue to next match
      }
    }
  }

  return null;
}

/**
 * Parse online source data from JSON structure
 */
function parseTanzaniteData(jsonData) {
  const casinos = [];

  // Navigate through the JSON structure to find casino data
  // This will need to be adjusted based on actual structure
  function findCasinoData(obj, path = '') {
    if (!obj || typeof obj !== 'object') return;

    // Look for arrays that might contain casino data
    if (Array.isArray(obj)) {
      for (const item of obj) {
        if (item && typeof item === 'object') {
          // Check if this looks like casino data
          if (item.casino || item.name || item.depositVolume || item.deposits) {
            casinos.push(item);
          } else {
            findCasinoData(item, path);
          }
        }
      }
    } else {
      for (const [key, value] of Object.entries(obj)) {
        if (key.toLowerCase().includes('casino') || 
            key.toLowerCase().includes('platform') ||
            key.toLowerCase().includes('data')) {
          findCasinoData(value, `${path}.${key}`);
        }
      }
    }
  }

  findCasinoData(jsonData);

  // If we found casinos, normalize them
  if (casinos.length > 0) {
    return casinos.map(casino => normalizeCasinoData(casino));
  }

  // Try alternative paths in the JSON
  const paths = [
    'props.pageProps',
    'props.initialState',
    'pageProps.data',
    'data.casinos',
    'casinos',
    'platforms'
  ];

  for (const path of paths) {
    const data = getNestedValue(jsonData, path);
    if (data && Array.isArray(data) && data.length > 0) {
      return data.map(casino => normalizeCasinoData(casino));
    }
  }

  return [];
}

/**
 * Get nested value from object using dot notation
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Normalize casino data to our schema
 */
function normalizeCasinoData(casino) {
  // Handle different possible field names
  const name = casino.casino || casino.name || casino.platform || casino.casinoName || '';
  const depositVolume = parseFloat(
    casino.depositVolume || 
    casino.deposit_volume || 
    casino.volume || 
    casino.totalVolume ||
    0
  );
  const deposits = parseInt(
    casino.deposits || 
    casino.totalDeposits || 
    casino.deposit_count ||
    0
  );
  const avgDeposit = parseFloat(
    casino.averageDeposit || 
    casino.avgDeposit || 
    casino.avg_deposit ||
    (deposits > 0 ? depositVolume / deposits : 0)
  );

  return {
    name: name.trim(),
    depositVolume,
    deposits,
    avgDeposit,
    // These might not be available from online sources
    uniqueDepositors: parseInt(casino.uniqueDepositors || casino.unique_depositors || 0),
    newDepositors: parseInt(casino.newDepositors || casino.new_depositors || 0)
  };
}

/**
 * Parse HTML table as fallback
 */
function parseHTMLTable(html) {
  const casinos = [];
  
  // Look for table with casino data
  const tableMatch = html.match(/<table[^>]*>(.*?)<\/table>/s);
  if (!tableMatch) return [];

  const tableHTML = tableMatch[1];
  const rowMatches = tableHTML.matchAll(/<tr[^>]*>(.*?)<\/tr>/gs);
  
  for (const rowMatch of rowMatches) {
    const rowHTML = rowMatch[1];
    const cellMatches = Array.from(rowHTML.matchAll(/<t[dh][^>]*>(.*?)<\/t[dh]>/gs));
    
    if (cellMatches.length >= 3) {
      const name = extractText(cellMatches[0][1]);
      const volume = parseNumber(cellMatches[1][1]);
      const deposits = parseNumber(cellMatches[2][1]);
      
      if (name && volume !== null) {
        casinos.push({
          name: name.trim(),
          depositVolume: volume,
          deposits: deposits || 0,
          avgDeposit: deposits > 0 ? volume / deposits : 0
        });
      }
    }
  }

  return casinos;
}

/**
 * Extract text from HTML
 */
function extractText(html) {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

/**
 * Parse number from text (handles currency, commas, etc.)
 */
function parseNumber(text) {
  const cleaned = text
    .replace(/[^\d.-]/g, '')
    .replace(/,/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

/**
 * Get yesterday's date in YYYY-MM-DD format
 */
export function getYesterdayDate() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  return yesterday.toISOString().split('T')[0];
}
