// Casino hot wallets configuration
// These are the main deposit addresses for each casino
// TODO: Consider moving this to a database table for easier management

export const CASINO_HOT_WALLETS = {
  "0x68416debc20d13e5ef694cdcac9506f4c1a20184": "500 Casino",
  "0x014435b1e39945cf4f5f0c3cbb5833195a95cc9b": "Duelbits",
  "0x580450dff316ae00d0fbef9621a304020a046ce2": "Gamdom",
  "0x7b09fc3bdd9a1eb0059f0c9d391f5d684e0f9918": "Duel",
  "0xcbd6832ebc203e49e2b771897067fce3c58575ac": "Rollbit",
  "0xc94ebb328ac25b95db0e0aa968371885fa516215": "Roobet",
  "0xDFaa75323fB721e5f29D43859390f62Cc4B600b8": "Shuffle",
  "0xa26148ae51fa8e787df319c04137602cc018b521": "Roobet",
  // Add more casino addresses as you discover them
};

// Get casino name from hot wallet address
export function getCasinoFromHotWallet(address) {
  return CASINO_HOT_WALLETS[address] || CASINO_HOT_WALLETS[address.toLowerCase()];
}

// Get all hot wallets for a specific casino
export function getHotWalletsForCasino(casinoName) {
  return Object.entries(CASINO_HOT_WALLETS)
    .filter(([_, name]) => name === casinoName)
    .map(([address, _]) => address);
}

// Get all casino names
export function getAllCasinoNames() {
  return [...new Set(Object.values(CASINO_HOT_WALLETS))];
}
