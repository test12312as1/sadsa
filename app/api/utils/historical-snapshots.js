/**
 * Historical Snapshot Data
 * Daily deposit volumes from Tanzanite Terminal
 * 
 * Note: Only volume data is provided. Other metrics (deposits, unique depositors, etc.)
 * can be estimated or added later when available.
 */

/**
 * Convert volume string (e.g., "$40.7M", "$304K", "$1.65B") to number
 */
function parseVolume(volumeStr) {
  if (!volumeStr || volumeStr === '$0' || volumeStr === '0' || volumeStr === '$136') return 0;
  
  const cleaned = volumeStr.replace(/[$,]/g, '').trim();
  const isBillions = cleaned.endsWith('B');
  const isMillions = cleaned.endsWith('M');
  const isThousands = cleaned.endsWith('K');
  
  const num = parseFloat(cleaned.replace(/[BKM]/g, ''));
  if (isNaN(num)) return 0;
  
  if (isBillions) return num * 1000000000;
  if (isMillions) return num * 1000000;
  if (isThousands) return num * 1000;
  return num;
}

/**
 * Daily snapshot data
 * Format: { date: 'YYYY-MM-DD', casinos: [{ name, volume }] }
 */
export const DAILY_SNAPSHOTS = [
  {
    date: '2025-12-31',
    casinos: [
      { name: 'Stake', volume: parseVolume('$55.8M') },
      { name: 'Roobet', volume: parseVolume('$13.7M') },
      { name: 'Duel', volume: parseVolume('$4.3M') },
      { name: 'Gamdom', volume: parseVolume('$4.85M') },
      { name: 'Shuffle', volume: parseVolume('$3.68M') },
      { name: 'Rainbet', volume: parseVolume('$4.22M') },
      { name: 'Rollbit', volume: parseVolume('$4.27M') },
      { name: 'StakeUS', volume: parseVolume('$2.76M') },
      { name: 'Yeet', volume: parseVolume('$2.63M') },
      { name: 'Winna', volume: parseVolume('$781K') },
      { name: 'BetFury', volume: parseVolume('$487K') },
      { name: 'Yolo.com', volume: parseVolume('$1.09M') },
      { name: 'Thrill', volume: parseVolume('$699K') },
      { name: '500 Casino', volume: parseVolume('$888K') },
      { name: 'Solcasino', volume: parseVolume('$540K') },
      { name: 'Razed', volume: parseVolume('$545K') },
      { name: 'Duelbits', volume: parseVolume('$154K') },
      { name: 'MetaWin', volume: parseVolume('$107K') },
      { name: 'Chips.gg', volume: parseVolume('$165K') },
      { name: 'BC.GAME', volume: parseVolume('$154K') }
    ]
  },
  {
    date: '2026-01-01',
    casinos: [
      { name: 'Stake', volume: parseVolume('$71.4M') },
      { name: 'Roobet', volume: parseVolume('$8.55M') },
      { name: 'Duel', volume: parseVolume('$9.4M') },
      { name: 'Gamdom', volume: parseVolume('$6.06M') },
      { name: 'Shuffle', volume: parseVolume('$5.64M') },
      { name: 'Rainbet', volume: parseVolume('$3.66M') },
      { name: 'Rollbit', volume: parseVolume('$2.06M') },
      { name: 'StakeUS', volume: parseVolume('$1.15M') },
      { name: 'Yeet', volume: parseVolume('$524K') },
      { name: 'Winna', volume: parseVolume('$596K') },
      { name: 'BetFury', volume: parseVolume('$1.81M') },
      { name: 'Yolo.com', volume: parseVolume('$1.08M') },
      { name: 'Thrill', volume: parseVolume('$541K') },
      { name: '500 Casino', volume: parseVolume('$872K') },
      { name: 'Solcasino', volume: parseVolume('$1.29M') },
      { name: 'Razed', volume: parseVolume('$434K') },
      { name: 'Duelbits', volume: parseVolume('$319K') },
      { name: 'MetaWin', volume: parseVolume('$143K') },
      { name: 'Chips.gg', volume: parseVolume('$284K') },
      { name: 'BC.GAME', volume: parseVolume('$0') }
    ]
  },
  {
    date: '2026-01-02',
    casinos: [
      { name: 'Stake', volume: parseVolume('$45M') },
      { name: 'Roobet', volume: parseVolume('$14.6M') },
      { name: 'Duel', volume: parseVolume('$13M') },
      { name: 'Gamdom', volume: parseVolume('$4.11M') },
      { name: 'Shuffle', volume: parseVolume('$5.97M') },
      { name: 'Rainbet', volume: parseVolume('$6.1M') },
      { name: 'Rollbit', volume: parseVolume('$2.58M') },
      { name: 'StakeUS', volume: parseVolume('$1.49M') },
      { name: 'Yeet', volume: parseVolume('$886K') },
      { name: 'Winna', volume: parseVolume('$591K') },
      { name: 'BetFury', volume: parseVolume('$1.16M') },
      { name: 'Yolo.com', volume: parseVolume('$1.17M') },
      { name: 'Thrill', volume: parseVolume('$1.97M') },
      { name: '500 Casino', volume: parseVolume('$689K') },
      { name: 'Solcasino', volume: parseVolume('$392K') },
      { name: 'Razed', volume: parseVolume('$609K') },
      { name: 'Duelbits', volume: parseVolume('$184K') },
      { name: 'MetaWin', volume: parseVolume('$161K') },
      { name: 'Chips.gg', volume: parseVolume('$841K') },
      { name: 'BC.GAME', volume: parseVolume('$0') }
    ]
  },
  {
    date: '2026-01-03',
    casinos: [
      { name: 'Stake', volume: parseVolume('$39.5M') },
      { name: 'Roobet', volume: parseVolume('$10.2M') },
      { name: 'Duel', volume: parseVolume('$6.55M') },
      { name: 'Gamdom', volume: parseVolume('$8.39M') },
      { name: 'Shuffle', volume: parseVolume('$5.71M') },
      { name: 'Rainbet', volume: parseVolume('$3.56M') },
      { name: 'Rollbit', volume: parseVolume('$2.16M') },
      { name: 'StakeUS', volume: parseVolume('$1.33M') },
      { name: 'Yeet', volume: parseVolume('$1.12M') },
      { name: 'Winna', volume: parseVolume('$976K') },
      { name: 'BetFury', volume: parseVolume('$365K') },
      { name: 'Yolo.com', volume: parseVolume('$2.42M') },
      { name: 'Thrill', volume: parseVolume('$637K') },
      { name: '500 Casino', volume: parseVolume('$698K') },
      { name: 'Solcasino', volume: parseVolume('$512K') },
      { name: 'Razed', volume: parseVolume('$514K') },
      { name: 'Duelbits', volume: parseVolume('$216K') },
      { name: 'MetaWin', volume: parseVolume('$107K') },
      { name: 'Chips.gg', volume: parseVolume('$162K') },
      { name: 'BC.GAME', volume: parseVolume('$0') }
    ]
  },
  {
    date: '2026-01-04',
    casinos: [
      { name: 'Stake', volume: parseVolume('$64.8M') },
      { name: 'Roobet', volume: parseVolume('$12.8M') },
      { name: 'Duel', volume: parseVolume('$4.04M') },
      { name: 'Gamdom', volume: parseVolume('$4.33M') },
      { name: 'Shuffle', volume: parseVolume('$4.39M') },
      { name: 'Rainbet', volume: parseVolume('$4.31M') },
      { name: 'Rollbit', volume: parseVolume('$2.43M') },
      { name: 'StakeUS', volume: parseVolume('$1.09M') },
      { name: 'Yeet', volume: parseVolume('$670K') },
      { name: 'Winna', volume: parseVolume('$588K') },
      { name: 'BetFury', volume: parseVolume('$249K') },
      { name: 'Yolo.com', volume: parseVolume('$1.53M') },
      { name: 'Thrill', volume: parseVolume('$825K') },
      { name: '500 Casino', volume: parseVolume('$708K') },
      { name: 'Solcasino', volume: parseVolume('$470K') },
      { name: 'Razed', volume: parseVolume('$568K') },
      { name: 'Duelbits', volume: parseVolume('$236K') },
      { name: 'MetaWin', volume: parseVolume('$130K') },
      { name: 'Chips.gg', volume: parseVolume('$101K') },
      { name: 'BC.GAME', volume: parseVolume('$0') }
    ]
  },
  {
    date: '2026-01-05',
    casinos: [
      { name: 'Stake', volume: parseVolume('$72.7M') },
      { name: 'Roobet', volume: parseVolume('$16.8M') },
      { name: 'Duel', volume: parseVolume('$7.43M') },
      { name: 'Gamdom', volume: parseVolume('$5.05M') },
      { name: 'Shuffle', volume: parseVolume('$4.54M') },
      { name: 'Rainbet', volume: parseVolume('$4.96M') },
      { name: 'Rollbit', volume: parseVolume('$3.33M') },
      { name: 'StakeUS', volume: parseVolume('$1.27M') },
      { name: 'Yeet', volume: parseVolume('$304K') },
      { name: 'Winna', volume: parseVolume('$846K') },
      { name: 'BetFury', volume: parseVolume('$408K') },
      { name: 'Yolo.com', volume: parseVolume('$1.57M') },
      { name: 'Thrill', volume: parseVolume('$982K') },
      { name: '500 Casino', volume: parseVolume('$578K') },
      { name: 'Solcasino', volume: parseVolume('$1.93M') },
      { name: 'Razed', volume: parseVolume('$988K') },
      { name: 'Duelbits', volume: parseVolume('$130K') },
      { name: 'MetaWin', volume: parseVolume('$238K') },
      { name: 'Chips.gg', volume: parseVolume('$113K') },
      { name: 'BC.GAME', volume: parseVolume('$136') }
    ]
  },
  {
    date: '2026-01-06',
    casinos: [
      { name: 'Stake', volume: parseVolume('$40.7M') },
      { name: 'Roobet', volume: parseVolume('$18.6M') },
      { name: 'Duel', volume: parseVolume('$2.34M') },
      { name: 'Gamdom', volume: parseVolume('$6.82M') },
      { name: 'Shuffle', volume: parseVolume('$4.81M') },
      { name: 'Rainbet', volume: parseVolume('$4.26M') },
      { name: 'Rollbit', volume: parseVolume('$2.27M') },
      { name: 'StakeUS', volume: parseVolume('$1.26M') },
      { name: 'Yeet', volume: parseVolume('$1.23M') },
      { name: 'Winna', volume: parseVolume('$1.34M') },
      { name: 'BetFury', volume: parseVolume('$1.24M') },
      { name: 'Yolo.com', volume: parseVolume('$566K') },
      { name: 'Thrill', volume: parseVolume('$531K') },
      { name: '500 Casino', volume: parseVolume('$723K') },
      { name: 'Solcasino', volume: parseVolume('$471K') },
      { name: 'Razed', volume: parseVolume('$387K') },
      { name: 'Duelbits', volume: parseVolume('$354K') },
      { name: 'MetaWin', volume: parseVolume('$356K') },
      { name: 'Chips.gg', volume: parseVolume('$98K') },
      { name: 'BC.GAME', volume: parseVolume('$0') }
    ]
  }
];

/**
 * Monthly snapshot data (3-day periods)
 * Format: { date: 'YYYY-MM-DD', period_type: 'monthly', casinos: [{ name, volume }] }
 */
export const MONTHLY_SNAPSHOTS = [
  {
    date: '2026-01-03',
    period_type: 'monthly',
    casinos: [
      { name: 'Stake', volume: parseVolume('$156M') },
      { name: 'Roobet', volume: parseVolume('$33.3M') },
      { name: 'Duel', volume: parseVolume('$28.9M') },
      { name: 'Gamdom', volume: parseVolume('$18.6M') },
      { name: 'Shuffle', volume: parseVolume('$17.3M') },
      { name: 'Rainbet', volume: parseVolume('$13.3M') },
      { name: 'StakeUS', volume: parseVolume('$3.97M') },
      { name: 'Rollbit', volume: parseVolume('$6.81M') },
      { name: 'Yolo.com', volume: parseVolume('$4.67M') },
      { name: 'Thrill', volume: parseVolume('$3.14M') },
      { name: 'BC.GAME', volume: parseVolume('$0') },
      { name: 'Yeet', volume: parseVolume('$2.53M') },
      { name: '500 Casino', volume: parseVolume('$2.26M') },
      { name: 'Winna', volume: parseVolume('$2.16M') },
      { name: 'BetFury', volume: parseVolume('$3.33M') },
      { name: 'Solcasino', volume: parseVolume('$2.2M') },
      { name: 'Razed', volume: parseVolume('$1.56M') },
      { name: 'Duelbits', volume: parseVolume('$719K') },
      { name: 'Chips.gg', volume: parseVolume('$1.29M') },
      { name: 'MetaWin', volume: parseVolume('$410K') }
    ]
  },
  {
    date: '2025-12-31',
    period_type: 'monthly',
    casinos: [
      { name: 'Stake', volume: parseVolume('$202M') },
      { name: 'Roobet', volume: parseVolume('$43.8M') },
      { name: 'Duel', volume: parseVolume('$30.8M') },
      { name: 'Gamdom', volume: parseVolume('$13.7M') },
      { name: 'Shuffle', volume: parseVolume('$14M') },
      { name: 'Rainbet', volume: parseVolume('$13.7M') },
      { name: 'StakeUS', volume: parseVolume('$6.6M') },
      { name: 'Rollbit', volume: parseVolume('$7.79M') },
      { name: 'Yolo.com', volume: parseVolume('$2.17M') },
      { name: 'Thrill', volume: parseVolume('$2.12M') },
      { name: 'BC.GAME', volume: parseVolume('$4.56M') },
      { name: 'Yeet', volume: parseVolume('$5.46M') },
      { name: '500 Casino', volume: parseVolume('$2M') },
      { name: 'Winna', volume: parseVolume('$2.33M') },
      { name: 'BetFury', volume: parseVolume('$1.49M') },
      { name: 'Solcasino', volume: parseVolume('$1.63M') },
      { name: 'Razed', volume: parseVolume('$1.5M') },
      { name: 'Duelbits', volume: parseVolume('$2.65M') },
      { name: 'Chips.gg', volume: parseVolume('$723K') },
      { name: 'MetaWin', volume: parseVolume('$444K') }
    ]
  },
  {
    date: '2025-12-28',
    period_type: 'monthly',
    casinos: [
      { name: 'Stake', volume: parseVolume('$244M') },
      { name: 'Roobet', volume: parseVolume('$40.9M') },
      { name: 'Duel', volume: parseVolume('$17.4M') },
      { name: 'Gamdom', volume: parseVolume('$23.4M') },
      { name: 'Shuffle', volume: parseVolume('$17.2M') },
      { name: 'Rainbet', volume: parseVolume('$13.8M') },
      { name: 'StakeUS', volume: parseVolume('$5.45M') },
      { name: 'Rollbit', volume: parseVolume('$7.88M') },
      { name: 'Yolo.com', volume: parseVolume('$2.03M') },
      { name: 'Thrill', volume: parseVolume('$2.57M') },
      { name: 'BC.GAME', volume: parseVolume('$9.59M') },
      { name: 'Yeet', volume: parseVolume('$2.19M') },
      { name: '500 Casino', volume: parseVolume('$3.09M') },
      { name: 'Winna', volume: parseVolume('$2.01M') },
      { name: 'BetFury', volume: parseVolume('$3.85M') },
      { name: 'Solcasino', volume: parseVolume('$1.91M') },
      { name: 'Razed', volume: parseVolume('$1.67M') },
      { name: 'Duelbits', volume: parseVolume('$1.13M') },
      { name: 'Chips.gg', volume: parseVolume('$1.2M') },
      { name: 'MetaWin', volume: parseVolume('$517K') }
    ]
  },
  {
    date: '2025-12-25',
    period_type: 'monthly',
    casinos: [
      { name: 'Stake', volume: parseVolume('$258M') },
      { name: 'Roobet', volume: parseVolume('$50.8M') },
      { name: 'Duel', volume: parseVolume('$10M') },
      { name: 'Gamdom', volume: parseVolume('$19M') },
      { name: 'Shuffle', volume: parseVolume('$14.1M') },
      { name: 'Rainbet', volume: parseVolume('$14.9M') },
      { name: 'StakeUS', volume: parseVolume('$6.87M') },
      { name: 'Rollbit', volume: parseVolume('$4.45M') },
      { name: 'Yolo.com', volume: parseVolume('$1.66M') },
      { name: 'Thrill', volume: parseVolume('$2.09M') },
      { name: 'BC.GAME', volume: parseVolume('$5.04M') },
      { name: 'Yeet', volume: parseVolume('$2.36M') },
      { name: '500 Casino', volume: parseVolume('$3.65M') },
      { name: 'Winna', volume: parseVolume('$1.79M') },
      { name: 'BetFury', volume: parseVolume('$2.15M') },
      { name: 'Solcasino', volume: parseVolume('$1.41M') },
      { name: 'Razed', volume: parseVolume('$1.56M') },
      { name: 'Duelbits', volume: parseVolume('$1.66M') },
      { name: 'Chips.gg', volume: parseVolume('$137K') },
      { name: 'MetaWin', volume: parseVolume('$380K') }
    ]
  },
  {
    date: '2025-12-22',
    period_type: 'monthly',
    casinos: [
      { name: 'Stake', volume: parseVolume('$274M') },
      { name: 'Roobet', volume: parseVolume('$39.9M') },
      { name: 'Duel', volume: parseVolume('$10.9M') },
      { name: 'Gamdom', volume: parseVolume('$18.3M') },
      { name: 'Shuffle', volume: parseVolume('$21.1M') },
      { name: 'Rainbet', volume: parseVolume('$12.9M') },
      { name: 'StakeUS', volume: parseVolume('$4.94M') },
      { name: 'Rollbit', volume: parseVolume('$5.34M') },
      { name: 'Yolo.com', volume: parseVolume('$4.02M') },
      { name: 'Thrill', volume: parseVolume('$4.08M') },
      { name: 'BC.GAME', volume: parseVolume('$7.39M') },
      { name: 'Yeet', volume: parseVolume('$2.03M') },
      { name: '500 Casino', volume: parseVolume('$3.31M') },
      { name: 'Winna', volume: parseVolume('$3.14M') },
      { name: 'BetFury', volume: parseVolume('$1.16M') },
      { name: 'Solcasino', volume: parseVolume('$1.6M') },
      { name: 'Razed', volume: parseVolume('$2.02M') },
      { name: 'Duelbits', volume: parseVolume('$1.89M') },
      { name: 'Chips.gg', volume: parseVolume('$239K') },
      { name: 'MetaWin', volume: parseVolume('$512K') }
    ]
  },
  {
    date: '2025-12-19',
    period_type: 'monthly',
    casinos: [
      { name: 'Stake', volume: parseVolume('$314M') },
      { name: 'Roobet', volume: parseVolume('$43.7M') },
      { name: 'Duel', volume: parseVolume('$23.8M') },
      { name: 'Gamdom', volume: parseVolume('$22.1M') },
      { name: 'Shuffle', volume: parseVolume('$17.5M') },
      { name: 'Rainbet', volume: parseVolume('$15.2M') },
      { name: 'StakeUS', volume: parseVolume('$6.4M') },
      { name: 'Rollbit', volume: parseVolume('$5.49M') },
      { name: 'Yolo.com', volume: parseVolume('$5.24M') },
      { name: 'Thrill', volume: parseVolume('$3.19M') },
      { name: 'BC.GAME', volume: parseVolume('$6.78M') },
      { name: 'Yeet', volume: parseVolume('$971K') },
      { name: '500 Casino', volume: parseVolume('$2.51M') },
      { name: 'Winna', volume: parseVolume('$3.74M') },
      { name: 'BetFury', volume: parseVolume('$1.7M') },
      { name: 'Solcasino', volume: parseVolume('$1.62M') },
      { name: 'Razed', volume: parseVolume('$1.91M') },
      { name: 'Duelbits', volume: parseVolume('$973K') },
      { name: 'Chips.gg', volume: parseVolume('$867K') },
      { name: 'MetaWin', volume: parseVolume('$550K') }
    ]
  },
  {
    date: '2025-12-16',
    period_type: 'monthly',
    casinos: [
      { name: 'Stake', volume: parseVolume('$163M') },
      { name: 'Roobet', volume: parseVolume('$50M') },
      { name: 'Duel', volume: parseVolume('$16.8M') },
      { name: 'Gamdom', volume: parseVolume('$19.5M') },
      { name: 'Shuffle', volume: parseVolume('$16M') },
      { name: 'Rainbet', volume: parseVolume('$14.5M') },
      { name: 'StakeUS', volume: parseVolume('$6.55M') },
      { name: 'Rollbit', volume: parseVolume('$5.21M') },
      { name: 'Yolo.com', volume: parseVolume('$5.98M') },
      { name: 'Thrill', volume: parseVolume('$2.87M') },
      { name: 'BC.GAME', volume: parseVolume('$8.55M') },
      { name: 'Yeet', volume: parseVolume('$3.81M') },
      { name: '500 Casino', volume: parseVolume('$2.07M') },
      { name: 'Winna', volume: parseVolume('$1.96M') },
      { name: 'BetFury', volume: parseVolume('$2.58M') },
      { name: 'Solcasino', volume: parseVolume('$1.83M') },
      { name: 'Razed', volume: parseVolume('$1.5M') },
      { name: 'Duelbits', volume: parseVolume('$1.91M') },
      { name: 'Chips.gg', volume: parseVolume('$328K') },
      { name: 'MetaWin', volume: parseVolume('$362K') }
    ]
  },
  {
    date: '2025-12-13',
    period_type: 'monthly',
    casinos: [
      { name: 'Stake', volume: parseVolume('$180M') },
      { name: 'Roobet', volume: parseVolume('$42.4M') },
      { name: 'Duel', volume: parseVolume('$13.5M') },
      { name: 'Gamdom', volume: parseVolume('$14.2M') },
      { name: 'Shuffle', volume: parseVolume('$15.9M') },
      { name: 'Rainbet', volume: parseVolume('$13.4M') },
      { name: 'StakeUS', volume: parseVolume('$6.13M') },
      { name: 'Rollbit', volume: parseVolume('$4.66M') },
      { name: 'Yolo.com', volume: parseVolume('$3.49M') },
      { name: 'Thrill', volume: parseVolume('$4.49M') },
      { name: 'BC.GAME', volume: parseVolume('$10.5M') },
      { name: 'Yeet', volume: parseVolume('$2.99M') },
      { name: '500 Casino', volume: parseVolume('$3.54M') },
      { name: 'Winna', volume: parseVolume('$3.75M') },
      { name: 'BetFury', volume: parseVolume('$1.31M') },
      { name: 'Solcasino', volume: parseVolume('$1.63M') },
      { name: 'Razed', volume: parseVolume('$1.79M') },
      { name: 'Duelbits', volume: parseVolume('$840K') },
      { name: 'Chips.gg', volume: parseVolume('$991K') },
      { name: 'MetaWin', volume: parseVolume('$1.27M') }
    ]
  },
  {
    date: '2025-12-10',
    period_type: 'monthly',
    casinos: [
      { name: 'Stake', volume: parseVolume('$193M') },
      { name: 'Roobet', volume: parseVolume('$46.7M') },
      { name: 'Duel', volume: parseVolume('$11.3M') },
      { name: 'Gamdom', volume: parseVolume('$15.9M') },
      { name: 'Shuffle', volume: parseVolume('$17.4M') },
      { name: 'Rainbet', volume: parseVolume('$13.1M') },
      { name: 'StakeUS', volume: parseVolume('$5.66M') },
      { name: 'Rollbit', volume: parseVolume('$5.63M') },
      { name: 'Yolo.com', volume: parseVolume('$2.98M') },
      { name: 'Thrill', volume: parseVolume('$11.3M') },
      { name: 'BC.GAME', volume: parseVolume('$12M') },
      { name: 'Yeet', volume: parseVolume('$1.62M') },
      { name: '500 Casino', volume: parseVolume('$1.93M') },
      { name: 'Winna', volume: parseVolume('$1.76M') },
      { name: 'BetFury', volume: parseVolume('$5.07M') },
      { name: 'Solcasino', volume: parseVolume('$1.53M') },
      { name: 'Razed', volume: parseVolume('$1.6M') },
      { name: 'Duelbits', volume: parseVolume('$2.36M') },
      { name: 'Chips.gg', volume: parseVolume('$1.12M') },
      { name: 'MetaWin', volume: parseVolume('$572K') }
    ]
  }
];

/**
 * Yearly snapshot data (monthly periods)
 * Format: { date: 'YYYY-MM-DD', period_type: 'yearly', casinos: [{ name, volume }] }
 */
export const YEARLY_SNAPSHOTS = [
  {
    date: '2026-01-06',
    period_type: 'yearly',
    casinos: [
      { name: 'Stake', volume: parseVolume('$178M') },
      { name: 'Roobet', volume: parseVolume('$48.3M') },
      { name: 'Shuffle', volume: parseVolume('$13.7M') },
      { name: 'BC.GAME', volume: parseVolume('$136') },
      { name: 'Gamdom', volume: parseVolume('$16.2M') },
      { name: 'Rollbit', volume: parseVolume('$8.02M') },
      { name: 'Duel', volume: parseVolume('$13.8M') },
      { name: 'Yolo.com', volume: parseVolume('$3.67M') },
      { name: 'StakeUS', volume: parseVolume('$3.62M') },
      { name: 'Rainbet', volume: parseVolume('$13.5M') },
      { name: '500 Casino', volume: parseVolume('$2.01M') },
      { name: 'Winna', volume: parseVolume('$2.77M') },
      { name: 'BetFury', volume: parseVolume('$1.9M') },
      { name: 'Solcasino', volume: parseVolume('$2.87M') },
      { name: 'Thrill', volume: parseVolume('$2.34M') },
      { name: 'Razed', volume: parseVolume('$1.94M') },
      { name: 'Duelbits', volume: parseVolume('$720K') },
      { name: 'MetaWin', volume: parseVolume('$724K') },
      { name: 'Yeet', volume: parseVolume('$2.2M') },
      { name: 'Chips.gg', volume: parseVolume('$312K') }
    ]
  },
  {
    date: '2025-11-07',
    period_type: 'yearly',
    casinos: [
      { name: 'Stake', volume: parseVolume('$1.65B') },
      { name: 'Roobet', volume: parseVolume('$391M') },
      { name: 'Shuffle', volume: parseVolume('$186M') },
      { name: 'BC.GAME', volume: parseVolume('$208M') },
      { name: 'Gamdom', volume: parseVolume('$100M') },
      { name: 'Rollbit', volume: parseVolume('$67.7M') },
      { name: 'Duel', volume: parseVolume('$189M') },
      { name: 'Yolo.com', volume: parseVolume('$65.1M') },
      { name: 'StakeUS', volume: parseVolume('$118M') },
      { name: 'Rainbet', volume: parseVolume('$126M') },
      { name: '500 Casino', volume: parseVolume('$28.2M') },
      { name: 'Winna', volume: parseVolume('$30M') },
      { name: 'BetFury', volume: parseVolume('$25.1M') },
      { name: 'Solcasino', volume: parseVolume('$20.6M') },
      { name: 'Thrill', volume: parseVolume('$16.3M') },
      { name: 'Razed', volume: parseVolume('$15.4M') },
      { name: 'Duelbits', volume: parseVolume('$12.1M') },
      { name: 'MetaWin', volume: parseVolume('$9.68M') },
      { name: 'Yeet', volume: parseVolume('$35.9M') },
      { name: 'Chips.gg', volume: parseVolume('$8.11M') }
    ]
  },
  {
    date: '2025-10-08',
    period_type: 'yearly',
    casinos: [
      { name: 'Stake', volume: parseVolume('$1.86B') },
      { name: 'Roobet', volume: parseVolume('$518M') },
      { name: 'Shuffle', volume: parseVolume('$239M') },
      { name: 'BC.GAME', volume: parseVolume('$194M') },
      { name: 'Gamdom', volume: parseVolume('$103M') },
      { name: 'Rollbit', volume: parseVolume('$70.4M') },
      { name: 'Duel', volume: parseVolume('$56.7M') },
      { name: 'Yolo.com', volume: parseVolume('$91M') },
      { name: 'StakeUS', volume: parseVolume('$56.2M') },
      { name: 'Rainbet', volume: parseVolume('$134M') },
      { name: '500 Casino', volume: parseVolume('$21.2M') },
      { name: 'Winna', volume: parseVolume('$30.6M') },
      { name: 'BetFury', volume: parseVolume('$28.2M') },
      { name: 'Solcasino', volume: parseVolume('$22.9M') },
      { name: 'Thrill', volume: parseVolume('$14.5M') },
      { name: 'Razed', volume: parseVolume('$15.1M') },
      { name: 'Duelbits', volume: parseVolume('$13.6M') },
      { name: 'MetaWin', volume: parseVolume('$10.9M') },
      { name: 'Yeet', volume: parseVolume('$14M') },
      { name: 'Chips.gg', volume: parseVolume('$1.12M') }
    ]
  },
  {
    date: '2025-09-08',
    period_type: 'yearly',
    casinos: [
      { name: 'Stake', volume: parseVolume('$1.78B') },
      { name: 'Roobet', volume: parseVolume('$409M') },
      { name: 'Shuffle', volume: parseVolume('$215M') },
      { name: 'BC.GAME', volume: parseVolume('$179M') },
      { name: 'Gamdom', volume: parseVolume('$123M') },
      { name: 'Rollbit', volume: parseVolume('$80M') },
      { name: 'Duel', volume: parseVolume('$26.6M') },
      { name: 'Yolo.com', volume: parseVolume('$91.3M') },
      { name: 'StakeUS', volume: parseVolume('$64.2M') },
      { name: 'Rainbet', volume: parseVolume('$101M') },
      { name: '500 Casino', volume: parseVolume('$29.5M') },
      { name: 'Winna', volume: parseVolume('$30.3M') },
      { name: 'BetFury', volume: parseVolume('$24.4M') },
      { name: 'Solcasino', volume: parseVolume('$21.5M') },
      { name: 'Thrill', volume: parseVolume('$15.1M') },
      { name: 'Razed', volume: parseVolume('$14.5M') },
      { name: 'Duelbits', volume: parseVolume('$27.2M') },
      { name: 'MetaWin', volume: parseVolume('$8.7M') },
      { name: 'Yeet', volume: parseVolume('$14.8M') },
      { name: 'Chips.gg', volume: parseVolume('$1.56M') }
    ]
  },
  {
    date: '2025-08-09',
    period_type: 'yearly',
    casinos: [
      { name: 'Stake', volume: parseVolume('$1.54B') },
      { name: 'Roobet', volume: parseVolume('$323M') },
      { name: 'Shuffle', volume: parseVolume('$160M') },
      { name: 'BC.GAME', volume: parseVolume('$168M') },
      { name: 'Gamdom', volume: parseVolume('$98.8M') },
      { name: 'Rollbit', volume: parseVolume('$65.4M') },
      { name: 'Duel', volume: parseVolume('$10.7M') },
      { name: 'Yolo.com', volume: parseVolume('$80.3M') },
      { name: 'StakeUS', volume: parseVolume('$63.8M') },
      { name: 'Rainbet', volume: parseVolume('$70.7M') },
      { name: '500 Casino', volume: parseVolume('$27.5M') },
      { name: 'Winna', volume: parseVolume('$19.8M') },
      { name: 'BetFury', volume: parseVolume('$28.8M') },
      { name: 'Solcasino', volume: parseVolume('$22.7M') },
      { name: 'Thrill', volume: parseVolume('$4.49M') },
      { name: 'Razed', volume: parseVolume('$12.6M') },
      { name: 'Duelbits', volume: parseVolume('$16.9M') },
      { name: 'MetaWin', volume: parseVolume('$6.59M') },
      { name: 'Yeet', volume: parseVolume('$12.1M') },
      { name: 'Chips.gg', volume: parseVolume('$2.12M') }
    ]
  },
  {
    date: '2025-07-10',
    period_type: 'yearly',
    casinos: [
      { name: 'Stake', volume: parseVolume('$1.62B') },
      { name: 'Roobet', volume: parseVolume('$304M') },
      { name: 'Shuffle', volume: parseVolume('$159M') },
      { name: 'BC.GAME', volume: parseVolume('$218M') },
      { name: 'Gamdom', volume: parseVolume('$105M') },
      { name: 'Rollbit', volume: parseVolume('$60.8M') },
      { name: 'Duel', volume: parseVolume('$0') },
      { name: 'Yolo.com', volume: parseVolume('$65.8M') },
      { name: 'StakeUS', volume: parseVolume('$58M') },
      { name: 'Rainbet', volume: parseVolume('$69.1M') },
      { name: '500 Casino', volume: parseVolume('$28.2M') },
      { name: 'Winna', volume: parseVolume('$22.3M') },
      { name: 'BetFury', volume: parseVolume('$24.6M') },
      { name: 'Solcasino', volume: parseVolume('$24.8M') },
      { name: 'Thrill', volume: parseVolume('$388K') },
      { name: 'Razed', volume: parseVolume('$12.3M') },
      { name: 'Duelbits', volume: parseVolume('$14M') },
      { name: 'MetaWin', volume: parseVolume('$10.1M') },
      { name: 'Yeet', volume: parseVolume('$8.25M') },
      { name: 'Chips.gg', volume: parseVolume('$1.32M') }
    ]
  },
  {
    date: '2025-06-10',
    period_type: 'yearly',
    casinos: [
      { name: 'Stake', volume: parseVolume('$1.42B') },
      { name: 'Roobet', volume: parseVolume('$515M') },
      { name: 'Shuffle', volume: parseVolume('$174M') },
      { name: 'BC.GAME', volume: parseVolume('$223M') },
      { name: 'Gamdom', volume: parseVolume('$115M') },
      { name: 'Rollbit', volume: parseVolume('$78.6M') },
      { name: 'Duel', volume: parseVolume('$0') },
      { name: 'Yolo.com', volume: parseVolume('$85.7M') },
      { name: 'StakeUS', volume: parseVolume('$53.1M') },
      { name: 'Rainbet', volume: parseVolume('$55.7M') },
      { name: '500 Casino', volume: parseVolume('$30.9M') },
      { name: 'Winna', volume: parseVolume('$16.7M') },
      { name: 'BetFury', volume: parseVolume('$22.2M') },
      { name: 'Solcasino', volume: parseVolume('$25.7M') },
      { name: 'Thrill', volume: parseVolume('$129K') },
      { name: 'Razed', volume: parseVolume('$13.7M') },
      { name: 'Duelbits', volume: parseVolume('$20.4M') },
      { name: 'MetaWin', volume: parseVolume('$18.5M') },
      { name: 'Yeet', volume: parseVolume('$8.78M') },
      { name: 'Chips.gg', volume: parseVolume('$1.98M') }
    ]
  },
  {
    date: '2025-05-11',
    period_type: 'yearly',
    casinos: [
      { name: 'Stake', volume: parseVolume('$1.26B') },
      { name: 'Roobet', volume: parseVolume('$340M') },
      { name: 'Shuffle', volume: parseVolume('$176M') },
      { name: 'BC.GAME', volume: parseVolume('$192M') },
      { name: 'Gamdom', volume: parseVolume('$117M') },
      { name: 'Rollbit', volume: parseVolume('$87.7M') },
      { name: 'Duel', volume: parseVolume('$0') },
      { name: 'Yolo.com', volume: parseVolume('$108M') },
      { name: 'StakeUS', volume: parseVolume('$56M') },
      { name: 'Rainbet', volume: parseVolume('$40.1M') },
      { name: '500 Casino', volume: parseVolume('$26.2M') },
      { name: 'Winna', volume: parseVolume('$14.9M') },
      { name: 'BetFury', volume: parseVolume('$17.5M') },
      { name: 'Solcasino', volume: parseVolume('$25.2M') },
      { name: 'Thrill', volume: parseVolume('$0') },
      { name: 'Razed', volume: parseVolume('$12.3M') },
      { name: 'Duelbits', volume: parseVolume('$13.6M') },
      { name: 'MetaWin', volume: parseVolume('$14.4M') },
      { name: 'Yeet', volume: parseVolume('$4.2M') },
      { name: 'Chips.gg', volume: parseVolume('$2.11M') }
    ]
  },
  {
    date: '2025-04-11',
    period_type: 'yearly',
    casinos: [
      { name: 'Stake', volume: parseVolume('$1.33B') },
      { name: 'Roobet', volume: parseVolume('$241M') },
      { name: 'Shuffle', volume: parseVolume('$141M') },
      { name: 'BC.GAME', volume: parseVolume('$161M') },
      { name: 'Gamdom', volume: parseVolume('$116M') },
      { name: 'Rollbit', volume: parseVolume('$86.2M') },
      { name: 'Duel', volume: parseVolume('$64.9K') },
      { name: 'Yolo.com', volume: parseVolume('$86.5M') },
      { name: 'StakeUS', volume: parseVolume('$63.5M') },
      { name: 'Rainbet', volume: parseVolume('$21.6M') },
      { name: '500 Casino', volume: parseVolume('$24.1M') },
      { name: 'Winna', volume: parseVolume('$12.8M') },
      { name: 'BetFury', volume: parseVolume('$12.3M') },
      { name: 'Solcasino', volume: parseVolume('$22.1M') },
      { name: 'Thrill', volume: parseVolume('$20.30') },
      { name: 'Razed', volume: parseVolume('$12M') },
      { name: 'Duelbits', volume: parseVolume('$16.5M') },
      { name: 'MetaWin', volume: parseVolume('$10.9M') },
      { name: 'Yeet', volume: parseVolume('$2.93M') },
      { name: 'Chips.gg', volume: parseVolume('$1.6M') }
    ]
  },
  {
    date: '2025-03-12',
    period_type: 'yearly',
    casinos: [
      { name: 'Stake', volume: parseVolume('$1.31B') },
      { name: 'Roobet', volume: parseVolume('$276M') },
      { name: 'Shuffle', volume: parseVolume('$161M') },
      { name: 'BC.GAME', volume: parseVolume('$185M') },
      { name: 'Gamdom', volume: parseVolume('$103M') },
      { name: 'Rollbit', volume: parseVolume('$107M') },
      { name: 'Duel', volume: parseVolume('$139') },
      { name: 'Yolo.com', volume: parseVolume('$87.2M') },
      { name: 'StakeUS', volume: parseVolume('$69.4M') },
      { name: 'Rainbet', volume: parseVolume('$16.3M') },
      { name: '500 Casino', volume: parseVolume('$23.9M') },
      { name: 'Winna', volume: parseVolume('$4.72M') },
      { name: 'BetFury', volume: parseVolume('$15.2M') },
      { name: 'Solcasino', volume: parseVolume('$29.5M') },
      { name: 'Thrill', volume: parseVolume('$40') },
      { name: 'Razed', volume: parseVolume('$13.4M') },
      { name: 'Duelbits', volume: parseVolume('$15.5M') },
      { name: 'MetaWin', volume: parseVolume('$15.1M') },
      { name: 'Yeet', volume: parseVolume('$10.5M') },
      { name: 'Chips.gg', volume: parseVolume('$1.56M') }
    ]
  },
  {
    date: '2025-02-10',
    period_type: 'yearly',
    casinos: [
      { name: 'Stake', volume: parseVolume('$1.17B') },
      { name: 'Roobet', volume: parseVolume('$315M') },
      { name: 'Shuffle', volume: parseVolume('$208M') },
      { name: 'BC.GAME', volume: parseVolume('$180M') },
      { name: 'Gamdom', volume: parseVolume('$102M') },
      { name: 'Rollbit', volume: parseVolume('$118M') },
      { name: 'Duel', volume: parseVolume('$0') },
      { name: 'Yolo.com', volume: parseVolume('$116M') },
      { name: 'StakeUS', volume: parseVolume('$58.1M') },
      { name: 'Rainbet', volume: parseVolume('$9.36M') },
      { name: '500 Casino', volume: parseVolume('$37M') },
      { name: 'Winna', volume: parseVolume('$1.28M') },
      { name: 'BetFury', volume: parseVolume('$15.4M') },
      { name: 'Solcasino', volume: parseVolume('$33.1M') },
      { name: 'Thrill', volume: parseVolume('$3.51K') },
      { name: 'Razed', volume: parseVolume('$14.7M') },
      { name: 'Duelbits', volume: parseVolume('$17.1M') },
      { name: 'MetaWin', volume: parseVolume('$16.1M') },
      { name: 'Yeet', volume: parseVolume('$0') },
      { name: 'Chips.gg', volume: parseVolume('$1.05M') }
    ]
  }
];

/**
 * Calculate market share for all casinos on a given date
 */
function calculateMarketShare(snapshot) {
  const totalVolume = snapshot.casinos.reduce((sum, c) => sum + c.volume, 0);
  return snapshot.casinos.map(casino => ({
    ...casino,
    market_share: totalVolume > 0 ? (casino.volume / totalVolume) * 100 : 0
  }));
}

/**
 * Get all snapshots with calculated market share
 */
export function getHistoricalSnapshots() {
  return DAILY_SNAPSHOTS.map(snapshot => ({
    ...snapshot,
    casinos: calculateMarketShare(snapshot)
  }));
}

/**
 * Estimate other metrics based on volume
 * These are rough estimates - replace with real data when available
 */
export function estimateMetrics(volume) {
  // Rough estimates (adjust based on your data):
  // - Average deposit: ~$80-100
  // - Deposits = volume / avg_deposit
  // - Unique depositors ≈ deposits * 0.5-0.7 (some users deposit multiple times)
  // - New depositors ≈ unique * 0.05-0.1 (5-10% are new)
  
  const avgDeposit = 85; // Average deposit size in USD
  const deposits = Math.round(volume / avgDeposit);
  const uniqueDepositors = Math.round(deposits * 0.6);
  const newDepositors = Math.round(uniqueDepositors * 0.08);
  
  return {
    total_deposits: deposits,
    unique_depositors: uniqueDepositors,
    new_depositors: newDepositors,
    avg_deposit_size: avgDeposit
  };
}

/**
 * Convert historical snapshots to platform_snapshots format
 * @param {string} type - 'daily', 'monthly', 'yearly', or 'all' (default)
 */
export function toPlatformSnapshots(type = 'all') {
  let snapshots = [];
  
  if (type === 'all' || type === 'daily') {
    snapshots = snapshots.concat(getHistoricalSnapshots());
  }
  
  if (type === 'all' || type === 'monthly') {
    snapshots = snapshots.concat(
      MONTHLY_SNAPSHOTS.map(snapshot => ({
        ...snapshot,
        casinos: calculateMarketShare(snapshot)
      }))
    );
  }
  
  if (type === 'all' || type === 'yearly') {
    snapshots = snapshots.concat(
      YEARLY_SNAPSHOTS.map(snapshot => ({
        ...snapshot,
        casinos: calculateMarketShare(snapshot)
      }))
    );
  }
  
  return snapshots.flatMap(snapshot => 
    snapshot.casinos.map(casino => {
      const estimated = estimateMetrics(casino.volume);
      return {
        snapshot_date: snapshot.date,
        casino_name: casino.name,
        total_volume: Math.round(casino.volume * 100) / 100,
        total_deposits: estimated.total_deposits,
        unique_depositors: estimated.unique_depositors,
        new_depositors: estimated.new_depositors,
        avg_deposit_size: estimated.avg_deposit_size,
        market_share: Math.round(casino.market_share * 100) / 100
        // Note: period_type is not in database schema, removed from insert
      };
    })
  );
}
