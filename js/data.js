/* Game Data - All constants for Drug Dealer Simulator 3 */
const GAME_DATA = {

  items: [
    { id: 'reggie',  name: 'Reggie',      tier: 1, category: 'weed',        clickValue: 1,      heatPerClick: 0.30, unlockCash: 0,          icon: '🌿', color: '#4CAF50', desc: 'Low-grade herb. The hustle starts here.' },
    { id: 'mid',     name: 'Mid Grade',   tier: 1, category: 'weed',        clickValue: 8,      heatPerClick: 0.40, unlockCash: 200,         icon: '🌿', color: '#66BB6A', desc: 'Decent quality. Word is spreading.' },
    { id: 'dank',    name: 'Dank',        tier: 1, category: 'weed',        clickValue: 40,     heatPerClick: 0.50, unlockCash: 1000,        icon: '🍃', color: '#2E7D32', desc: 'Premium herb. Got a real clientele now.' },
    { id: 'og',      name: 'OG Kush',     tier: 2, category: 'weed',        clickValue: 200,    heatPerClick: 0.70, unlockCash: 8000,        icon: '🍃', color: '#1B5E20', desc: 'Classic strain. High demand, high reward.' },
    { id: 'exotic',  name: 'Exotic',      tier: 2, category: 'weed',        clickValue: 1000,   heatPerClick: 1.00, unlockCash: 50000,       icon: '💎', color: '#76FF03', desc: 'Rare imports. The top shelf life.' },
    { id: 'shrooms', name: 'Shrooms',     tier: 2, category: 'psychedelic', clickValue: 500,    heatPerClick: 0.80, unlockCash: 20000,       icon: '🍄', color: '#FF9800', desc: 'Magic mushrooms. A whole new market.' },
    { id: 'acid',    name: 'Acid',        tier: 3, category: 'psychedelic', clickValue: 2500,   heatPerClick: 1.20, unlockCash: 150000,      icon: '⚗️', color: '#E040FB', desc: 'LSD tabs. Festival season is booming.' },
    { id: 'pills',   name: 'Party Pills', tier: 3, category: 'party',       clickValue: 1200,   heatPerClick: 1.00, unlockCash: 75000,       icon: '💊', color: '#FF4081', desc: 'Club staple. Everyone wants in.' },
    { id: 'molly',   name: 'Molly',       tier: 3, category: 'party',       clickValue: 6000,   heatPerClick: 1.50, unlockCash: 500000,      icon: '💎', color: '#40C4FF', desc: 'Pure MDMA. The VIP treatment.' },
    { id: 'coke',    name: 'Cocaine',     tier: 4, category: 'hard',        clickValue: 30000,  heatPerClick: 2.00, unlockCash: 3000000,     icon: '❄️', color: '#FFFFFF', desc: 'White gold. The big leagues call.' },
    { id: 'meth',    name: 'Ice',         tier: 4, category: 'hard',        clickValue: 15000,  heatPerClick: 1.80, unlockCash: 1000000,     icon: '💠', color: '#80DEEA', desc: 'Crystal clear. High risk, high reward.' },
    { id: 'stolen',  name: 'Hot Goods',   tier: 2, category: 'contraband',  clickValue: 300,    heatPerClick: 0.60, unlockCash: 10000,       icon: '📦', color: '#FFA726', desc: 'Electronics, jewelry, whatever fell off a truck.' },
    { id: 'counter', name: 'Counterfeits',tier: 3, category: 'contraband',  clickValue: 5000,   heatPerClick: 1.40, unlockCash: 300000,      icon: '💵', color: '#66BB6A', desc: 'Fake bills. Pass them carefully.' },
    { id: 'weapons', name: 'Hardware',    tier: 4, category: 'contraband',  clickValue: 20000,  heatPerClick: 2.50, unlockCash: 2000000,     icon: '🔫', color: '#546E7A', desc: 'Unregistered pieces. Serious business.' }
  ],

  workers: [
    { id: 'runner',        name: 'Runner',          incomePerSec: 0.1,    cost: 50,        costMult: 1.12, heatReduce: 0,    launderRate: 0,   desc: 'Moves small quantities on foot.', icon: '🏃', category: 'street'  },
    { id: 'dealer',        name: 'Street Dealer',   incomePerSec: 0.8,    cost: 250,       costMult: 1.15, heatReduce: 0,    launderRate: 0,   desc: 'Works a corner, builds regulars.', icon: '🧢', category: 'street'  },
    { id: 'chemist',       name: 'Chemist',         incomePerSec: 4,      cost: 1500,      costMult: 1.18, heatReduce: 0,    launderRate: 0,   desc: 'Improves product quality and output.', icon: '🧪', category: 'production' },
    { id: 'smuggler',      name: 'Smuggler',        incomePerSec: 20,     cost: 10000,     costMult: 1.20, heatReduce: 0,    launderRate: 0,   desc: 'Moves bulk. High income, high risk.', icon: '🚚', category: 'logistics' },
    { id: 'accountant',    name: 'Accountant',      incomePerSec: 0,      cost: 5000,      costMult: 1.25, heatReduce: 0,    launderRate: 50,  desc: 'Launders $50/s per accountant.', icon: '📊', category: 'finance'  },
    { id: 'lookout',       name: 'Lookout',         incomePerSec: 0,      cost: 800,       costMult: 1.20, heatReduce: 0.3,  launderRate: 0,   desc: 'Watches for cops. -0.3 heat/s each.', icon: '👁️', category: 'security' },
    { id: 'muscle',        name: 'Muscle',          incomePerSec: 0,      cost: 3000,      costMult: 1.22, heatReduce: 0.8,  launderRate: 0,   desc: 'Intimidates rivals. -0.8 heat/s each.', icon: '💪', category: 'security' },
    { id: 'hacker',        name: 'Hacker',          incomePerSec: 0,      cost: 15000,     costMult: 1.30, heatReduce: 2.0,  launderRate: 0,   desc: 'Scrubs digital records. -2 heat/s each.', icon: '💻', category: 'security' },
    { id: 'lawyer',        name: 'Lawyer',          incomePerSec: 0,      cost: 50000,     costMult: 1.35, heatReduce: 1.5,  launderRate: 100, desc: 'Keeps you clean. -1.5 heat/s + $100 launder/s.', icon: '⚖️', category: 'finance'  },
    { id: 'fixer',         name: 'Fixer',           incomePerSec: 100,    cost: 100000,    costMult: 1.40, heatReduce: 3.0,  launderRate: 0,   desc: 'Makes problems disappear.', icon: '🔧', category: 'logistics' },
    { id: 'cartel',        name: 'Cartel Contact',  incomePerSec: 1000,   cost: 1000000,   costMult: 1.50, heatReduce: 5.0,  launderRate: 500, desc: 'International supply chain. Game-changing.', icon: '🌐', category: 'elite'   }
  ],

  upgrades: [
    { id: 'better_bags',      name: 'Better Packaging',     cost: 500,       effect: { type: 'clickMult', value: 2 },          req: { cash: 200 },          desc: 'Quality packaging. 2× click value.', icon: '📦' },
    { id: 'street_rep',       name: 'Street Reputation',    cost: 1500,      effect: { type: 'clickMult', value: 2 },          req: { cash: 500 },          desc: 'Word of mouth. Another 2× click value.', icon: '⭐' },
    { id: 'runner_boost',     name: 'Runner Network',       cost: 2000,      effect: { type: 'workerMult', worker: 'runner', value: 3 }, req: { workers: { runner: 5 } }, desc: '3× runner income.', icon: '🏃' },
    { id: 'dealer_phones',    name: 'Burner Phones',        cost: 5000,      effect: { type: 'workerMult', worker: 'dealer', value: 3 }, req: { workers: { dealer: 3 } }, desc: 'Faster communication. 3× dealer income.', icon: '📱' },
    { id: 'chemist_lab',      name: 'Proper Lab',           cost: 12000,     effect: { type: 'workerMult', worker: 'chemist', value: 4 }, req: { workers: { chemist: 2 } }, desc: '4× chemist production.', icon: '🔬' },
    { id: 'supply_chain',     name: 'Supply Chain Ops',     cost: 30000,     effect: { type: 'clickMult', value: 3 },          req: { cash: 10000 },        desc: 'Wholesale pricing. 3× click value.', icon: '🔗' },
    { id: 'offshore',         name: 'Offshore Accounts',    cost: 80000,     effect: { type: 'launderEff', value: 0.95 },      req: { cash: 50000 },        desc: 'Launder at 95% efficiency.', icon: '🏦' },
    { id: 'encrypted_comms',  name: 'Encrypted Comms',      cost: 50000,     effect: { type: 'heatMult', value: 0.7 },         req: { cash: 20000 },        desc: '-30% heat generation.', icon: '🔐' },
    { id: 'smuggler_route',   name: 'Smuggler Route',       cost: 150000,    effect: { type: 'workerMult', worker: 'smuggler', value: 5 }, req: { workers: { smuggler: 2 } }, desc: '5× smuggler income.', icon: '🗺️' },
    { id: 'cartel_connect',   name: 'Cartel Connections',   cost: 500000,    effect: { type: 'clickMult', value: 5 },          req: { cash: 250000 },       desc: 'Cartel supply. 5× click value.', icon: '🌐' },
    { id: 'insider_police',   name: 'Insider (Police)',      cost: 200000,    effect: { type: 'heatMult', value: 0.5 },         req: { cash: 100000 },       desc: '-50% heat generation.', icon: '👮' },
    { id: 'global_network',   name: 'Global Network',       cost: 2000000,   effect: { type: 'allWorkerMult', value: 2 },      req: { cash: 1000000 },      desc: '2× ALL worker income.', icon: '🌍' },
    { id: 'quantum_crypto',   name: 'Quantum Crypto',       cost: 5000000,   effect: { type: 'heatMult', value: 0.25 },        req: { cash: 2000000 },      desc: '-75% heat generation.', icon: '⚛️' },
    { id: 'automation',       name: 'Full Automation',      cost: 10000000,  effect: { type: 'clickMult', value: 10 },         req: { cash: 5000000 },      desc: 'Automated empire. 10× click value.', icon: '🤖' }
  ],

  districts: [
    { id: 'school',      name: 'School Grounds',     unlockCash: 0,        bonus: { type: 'none',        value: 0 },   icon: '🏫', color: '#4CAF50', desc: 'Where it all started. Low risk, low reward.', flavor: 'The playground hustle.' },
    { id: 'downtown',    name: 'Downtown',            unlockCash: 5000,     bonus: { type: 'clickMult',   value: 1.25 }, icon: '🏙️', color: '#2196F3', desc: 'City center. High foot traffic, bigger deals.', flavor: 'The city never sleeps.' },
    { id: 'industrial',  name: 'Industrial District', unlockCash: 25000,    bonus: { type: 'workerIncome',value: 1.50 }, icon: '🏭', color: '#607D8B', desc: 'Warehouses and factories. Workers thrive here.', flavor: 'Blue collar, green money.' },
    { id: 'harbor',      name: 'Harbor',              unlockCash: 100000,   bonus: { type: 'smuggler',    value: 2.00 }, icon: '⚓', color: '#00BCD4', desc: 'International shipping. Smugglers double income.', flavor: 'Cargo manifests lie.' },
    { id: 'richward',    name: 'Rich Ward',           unlockCash: 300000,   bonus: { type: 'clickMult',   value: 2.00 }, icon: '💎', color: '#FFC107', desc: 'Wealthy clientele. Premium prices.', flavor: 'They pay top dollar.' },
    { id: 'airport',     name: 'Airport',             unlockCash: 500000,   bonus: { type: 'allIncome',   value: 3.00 }, icon: '✈️', color: '#9C27B0', desc: 'Global connections. 3× all income.', flavor: 'The world is your market.' },
    { id: 'underground', name: 'Underground Market',  unlockCash: 2000000,  bonus: { type: 'heatReduce',  value: 0.50 }, icon: '🕳️', color: '#FF5722', desc: 'Off the grid. -50% heat generation.', flavor: 'They can\'t find what doesn\'t exist.' }
  ],

  fronts: [
    { id: 'carwash',     name: 'Car Wash',        cost: 2000,     launderPerSec: 5,     maxDirty: 10000,     icon: '🚗', color: '#29B6F6', desc: 'Cash-heavy, no questions asked.' },
    { id: 'arcade',      name: 'Arcade',          cost: 15000,    launderPerSec: 30,    maxDirty: 80000,     icon: '🎮', color: '#AB47BC', desc: 'Tokens, tokens, tokens.' },
    { id: 'laundromat',  name: 'Laundromat',      cost: 60000,    launderPerSec: 100,   maxDirty: 500000,    icon: '👕', color: '#26C6DA', desc: 'Classic. Literally launders money.' },
    { id: 'foodtruck',   name: 'Food Truck',      cost: 250000,   launderPerSec: 400,   maxDirty: 2000000,   icon: '🚐', color: '#FFA726', desc: 'Mobile operation. Hard to trace.' },
    { id: 'bar',         name: 'Bar & Grill',     cost: 800000,   launderPerSec: 1500,  maxDirty: 10000000,  icon: '🍺', color: '#EF6C00', desc: 'Nightly cash flow, no receipts.' },
    { id: 'dealership',  name: 'Car Dealership',  cost: 3000000,  launderPerSec: 8000,  maxDirty: 50000000,  icon: '🏎️', color: '#D32F2F', desc: 'Big ticket items, big dirty money absorption.' },
    { id: 'casino',      name: 'Casino',          cost: 15000000, launderPerSec: 50000, maxDirty: 500000000, icon: '🎰', color: '#FFD700', desc: 'The ultimate front. Welcome to the big time.' }
  ],

  events: [
    { id: 'market_boom',     name: 'Market Boom',        type: 'positive', duration: 60,  effect: { type: 'incomeMult', value: 2 },      weight: 10, icon: '📈', desc: 'High demand! Double income for 60 seconds.' },
    { id: 'supply_shortage', name: 'Supply Shortage',    type: 'negative', duration: 45,  effect: { type: 'incomeMult', value: 0.5 },    weight: 8,  icon: '📉', desc: 'Supply ran dry. Half income for 45 seconds.' },
    { id: 'informant',       name: 'Informant Spotted',  type: 'negative', duration: 0,   effect: { type: 'heatAdd',   value: 15 },      weight: 12, icon: '🕵️', desc: 'Someone talked. +15 heat.' },
    { id: 'corrupt_cop',     name: 'Corrupt Cop Offer',  type: 'choice',   duration: 0,   effect: { type: 'bribe',     value: 1000 },    weight: 6,  icon: '👮', desc: 'A cop wants a cut. Pay $1,000 or +25 heat.' },
    { id: 'market_crash',    name: 'Market Crash',       type: 'negative', duration: 30,  effect: { type: 'incomeMult', value: 0.25 },   weight: 5,  icon: '💸', desc: 'Market flooded. 25% income for 30 seconds.' },
    { id: 'new_contact',     name: 'New Contact',        type: 'positive', duration: 0,   effect: { type: 'cashBonus', value: 5 },       weight: 8,  icon: '🤝', desc: 'Big spender walked in. Extra cash bonus!' },
    { id: 'security_breach', name: 'Security Breach',    type: 'negative', duration: 0,   effect: { type: 'loseWorker', value: 1 },      weight: 4,  icon: '🔓', desc: 'Someone got nabbed. Lost a worker.' },
    { id: 'rival_threat',    name: 'Rival Territory',    type: 'negative', duration: 20,  effect: { type: 'incomeMult', value: 0.75 },   weight: 7,  icon: '😤', desc: 'Rivals moving in. -25% income while active.' },
    { id: 'chemist_break',   name: 'Lab Breakthrough',   type: 'positive', duration: 0,   effect: { type: 'clickMult', value: 3, temp: 120 }, weight: 4, icon: '🔬', desc: 'Chemist made a discovery! 3× click value for 2min.' },
    { id: 'inspection',      name: 'Inspection Scare',   type: 'negative', duration: 0,   effect: { type: 'heatAdd',   value: 30 },      weight: 6,  icon: '🚨', desc: 'Business got inspected. +30 heat.' },
    { id: 'price_spike',     name: 'Price Spike',        type: 'positive', duration: 90,  effect: { type: 'incomeMult', value: 1.5 },    weight: 9,  icon: '💹', desc: 'Prices up! +50% income for 90 seconds.' },
    { id: 'blackout',        name: 'City Blackout',      type: 'mixed',    duration: 40,  effect: { type: 'blackout',  value: 0 },       weight: 3,  icon: '🌑', desc: 'Power\'s out. Police can\'t see, but neither can you.' }
  ],

  achievements: [
    { id: 'first_deal',     name: 'First Deal',       desc: 'Make your first deal.',                     icon: '🤝', req: { type: 'clicks', value: 1 },            reward: { cash: 10 } },
    { id: 'hustler',        name: 'Hustler',          desc: 'Make 100 deals.',                           icon: '💪', req: { type: 'clicks', value: 100 },          reward: { cash: 500 } },
    { id: 'grinder',        name: 'Grinder',          desc: 'Make 1,000 deals.',                         icon: '⚡', req: { type: 'clicks', value: 1000 },         reward: { cash: 5000 } },
    { id: 'legend',         name: 'Living Legend',    desc: 'Make 10,000 deals.',                        icon: '👑', req: { type: 'clicks', value: 10000 },        reward: { clickMult: 2 } },
    { id: 'first_k',        name: 'First Grand',      desc: 'Earn $1,000 total.',                        icon: '💵', req: { type: 'totalEarned', value: 1000 },     reward: { cash: 100 } },
    { id: 'ten_k',          name: 'Ten Stacks',       desc: 'Earn $10,000 total.',                       icon: '💰', req: { type: 'totalEarned', value: 10000 },    reward: { cash: 1000 } },
    { id: 'hundred_k',      name: 'Six Figures',      desc: 'Earn $100,000 total.',                      icon: '🏦', req: { type: 'totalEarned', value: 100000 },   reward: { cash: 10000 } },
    { id: 'million',        name: 'Millionaire',      desc: 'Earn $1,000,000 total.',                    icon: '🎰', req: { type: 'totalEarned', value: 1000000 },  reward: { clickMult: 2, cash: 50000 } },
    { id: 'ten_mil',        name: 'Empire Builder',   desc: 'Earn $10,000,000 total.',                   icon: '🏰', req: { type: 'totalEarned', value: 10000000 }, reward: { allWorkerMult: 2 } },
    { id: 'first_worker',   name: 'First Hire',       desc: 'Hire your first worker.',                   icon: '👷', req: { type: 'totalWorkers', value: 1 },       reward: { cash: 50 } },
    { id: 'crew',           name: 'Building a Crew',  desc: 'Have 10 workers total.',                    icon: '👥', req: { type: 'totalWorkers', value: 10 },      reward: { cash: 2000 } },
    { id: 'organization',   name: 'Organization',     desc: 'Have 50 workers total.',                    icon: '🏢', req: { type: 'totalWorkers', value: 50 },      reward: { clickMult: 1.5 } },
    { id: 'cartel_boss',    name: 'Cartel Boss',      desc: 'Have 100 workers total.',                   icon: '🌐', req: { type: 'totalWorkers', value: 100 },     reward: { allWorkerMult: 1.5 } },
    { id: 'first_launder',  name: 'Clean Hands',      desc: 'Launder your first dollar.',                icon: '💧', req: { type: 'totalLaundered', value: 1 },     reward: { cash: 100 } },
    { id: 'laundry_day',    name: 'Laundry Day',      desc: 'Launder $10,000 total.',                    icon: '🧺', req: { type: 'totalLaundered', value: 10000 },  reward: { cash: 5000 } },
    { id: 'clean_empire',   name: 'Clean Empire',     desc: 'Launder $1,000,000 total.',                 icon: '🏛️', req: { type: 'totalLaundered', value: 1000000 }, reward: { launderMult: 2 } },
    { id: 'survived_raid',  name: 'Survived a Raid',  desc: 'Survive your first police raid.',           icon: '🚔', req: { type: 'raidssurvived', value: 1 },      reward: { cash: 2000 } },
    { id: 'untouchable',    name: 'Untouchable',      desc: 'Survive 10 raids.',                         icon: '🛡️', req: { type: 'raidssurvived', value: 10 },     reward: { heatMult: 0.8 } },
    { id: 'hot_stuff',      name: 'Hot Stuff',        desc: 'Reach 90 heat.',                            icon: '🔥', req: { type: 'maxHeat', value: 90 },           reward: { cash: 1000 } },
    { id: 'first_district', name: 'Expanding',        desc: 'Unlock your first new district.',           icon: '🗺️', req: { type: 'districts', value: 2 },          reward: { cash: 500 } },
    { id: 'city_wide',      name: 'City Wide',        desc: 'Unlock all districts.',                     icon: '🏙️', req: { type: 'districts', value: 7 },          reward: { allIncomeMult: 1.5 } },
    { id: 'front_opened',   name: 'Going Legit',      desc: 'Open your first front business.',           icon: '🏪', req: { type: 'fronts', value: 1 },             reward: { cash: 500 } },
    { id: 'mogul',          name: 'Mogul',            desc: 'Own 5 front businesses.',                   icon: '🏗️', req: { type: 'fronts', value: 5 },             reward: { launderMult: 1.5 } },
    { id: 'dank_dealer',    name: 'Dank Dealer',      desc: 'Unlock Dank.',                              icon: '🍃', req: { type: 'item', item: 'dank' },            reward: { cash: 2000 } },
    { id: 'big_pharma',     name: 'Big Pharma',       desc: 'Unlock Party Pills.',                       icon: '💊', req: { type: 'item', item: 'pills' },           reward: { cash: 20000 } },
    { id: 'white_collar',   name: 'White Collar',     desc: 'Unlock Cocaine.',                           icon: '❄️', req: { type: 'item', item: 'coke' },            reward: { cash: 500000, clickMult: 2 } },
    { id: 'speed_run',      name: 'Speed Demon',      desc: 'Earn $1,000 in under 5 minutes.',           icon: '⏱️', req: { type: 'speedRun', value: 1000, time: 300 }, reward: { clickMult: 1.5 } },
    { id: 'night_owl',      name: 'Night Owl',        desc: 'Play for 1 hour total.',                    icon: '🦉', req: { type: 'playTime', value: 3600 },         reward: { allWorkerMult: 1.2 } },
    { id: 'dedicated',      name: 'Dedicated',        desc: 'Play for 10 hours total.',                  icon: '🏆', req: { type: 'playTime', value: 36000 },        reward: { allIncomeMult: 1.5 } }
  ]

};
