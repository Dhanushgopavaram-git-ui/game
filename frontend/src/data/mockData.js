// Mock data for Indian Heritage Monopoly - Premium Edition

export const indianProperties = [
  // Corner spaces
  { id: 0, name: 'GO', type: 'corner', description: 'Collect ₹2000 salary as you pass', position: 'bottom-right' },
  { id: 10, name: 'JAIL', type: 'corner', description: 'Just visiting or in jail', position: 'bottom-left' },
  { id: 20, name: 'FREE PARKING', type: 'corner', description: 'Free resting place', position: 'top-left' },
  { id: 30, name: 'GO TO JAIL', type: 'corner', description: 'Go directly to jail', position: 'top-right' },

  // Properties - Bottom side (1-9)
  { id: 1, name: 'GOA', type: 'property', color: 'brown', price: 600, rent: [20, 100, 300, 900, 1600, 2500], group: 'brown', description: 'Beaches & Portuguese Heritage' },
  { id: 2, name: 'COMMUNITY CHEST', type: 'community', description: 'Draw a community chest card' },
  { id: 3, name: 'ODISHA', type: 'property', color: 'brown', price: 600, rent: [40, 200, 600, 1800, 3200, 4500], group: 'brown', description: 'Temple Architecture & Culture' },
  { id: 4, name: 'INCOME TAX', type: 'tax', description: 'Pay ₹2000 or 10% of total worth', amount: 2000 },
  { id: 5, name: 'CHANDIGARH STATION', type: 'railroad', price: 2000, rent: [250, 500, 1000, 2000], description: 'The Beautiful City' },
  { id: 6, name: 'MUMBAI', type: 'property', color: 'lightblue', price: 1000, rent: [60, 300, 900, 2700, 4000, 5500], group: 'lightblue', description: 'Financial Capital of India' },
  { id: 7, name: 'CHANCE', type: 'chance', description: 'Draw a chance card' },
  { id: 8, name: 'JAIPUR', type: 'property', color: 'lightblue', price: 1000, rent: [60, 300, 900, 2700, 4000, 5500], group: 'lightblue', description: 'The Pink City' },
  { id: 9, name: 'HYDERABAD', type: 'property', color: 'lightblue', price: 1200, rent: [80, 400, 1000, 3000, 4500, 6000], group: 'lightblue', description: 'City of Pearls & IT' },

  // Left side (11-19)
  { id: 11, name: 'CHENNAI', type: 'property', color: 'pink', price: 1400, rent: [100, 500, 1500, 4500, 6250, 7500], group: 'pink', description: 'Detroit of India' },
  { id: 12, name: 'ELECTRIC COMPANY', type: 'utility', price: 1500, description: 'Pay 4x or 10x dice roll' },
  { id: 13, name: 'KARNATAKA', type: 'property', color: 'pink', price: 1400, rent: [100, 500, 1500, 4500, 6250, 7500], group: 'pink', description: 'Silicon Valley of India' },
  { id: 14, name: 'ANDHRA PRADESH', type: 'property', color: 'pink', price: 1600, rent: [120, 600, 1800, 5000, 7000, 9000], group: 'pink', description: 'Rice Bowl of India' },
  { id: 15, name: 'BANGALORE STATION', type: 'railroad', price: 2000, rent: [250, 500, 1000, 2000], description: 'Garden City Terminal' },
  { id: 16, name: 'KERALA', type: 'property', color: 'orange', price: 1800, rent: [140, 700, 2000, 5500, 7500, 9500], group: 'orange', description: 'God\'s Own Country' },
  { id: 17, name: 'COMMUNITY CHEST', type: 'community', description: 'Draw a community chest card' },
  { id: 18, name: 'TAMILNADU', type: 'property', color: 'orange', price: 1800, rent: [140, 700, 2000, 5500, 7500, 9500], group: 'orange', description: 'Land of Temples' },
  { id: 19, name: 'TELANGANA', type: 'property', color: 'orange', price: 2000, rent: [160, 800, 2200, 6000, 8000, 10000], group: 'orange', description: 'Youngest State' },

  // Top side (21-29)
  { id: 21, name: 'RAJASTHAN', type: 'property', color: 'red', price: 2200, rent: [180, 900, 2500, 7000, 8750, 10500], group: 'red', description: 'Land of Kings' },
  { id: 22, name: 'CHANCE', type: 'chance', description: 'Draw a chance card' },
  { id: 23, name: 'UTTAR PRADESH', type: 'property', color: 'red', price: 2200, rent: [180, 900, 2500, 7000, 8750, 10500], group: 'red', description: 'Heartland of India' },
  { id: 24, name: 'BIHAR', type: 'property', color: 'red', price: 2400, rent: [200, 1000, 3000, 9000, 11000, 12500], group: 'red', description: 'Ancient Wisdom' },
  { id: 25, name: 'KOLKATA STATION', type: 'railroad', price: 2000, rent: [250, 500, 1000, 2000], description: 'Cultural Capital Station' },
  { id: 26, name: 'WEST BENGAL', type: 'property', color: 'yellow', price: 2600, rent: [220, 1100, 3300, 8000, 9750, 11500], group: 'yellow', description: 'Cultural Hub' },
  { id: 27, name: 'WATER WORKS', type: 'utility', price: 1500, description: 'Pay 4x or 10x dice roll' },
  { id: 28, name: 'MADHYA PRADESH', type: 'property', color: 'yellow', price: 2600, rent: [220, 1100, 3300, 8000, 9750, 11500], group: 'yellow', description: 'Heart of India' },
  { id: 29, name: 'PUNJAB', type: 'property', color: 'yellow', price: 2800, rent: [240, 1200, 3600, 8500, 10250, 12000], group: 'yellow', description: 'Land of Five Rivers' },

  // Right side (31-39)
  { id: 31, name: 'HARYANA', type: 'property', color: 'green', price: 3000, rent: [260, 1300, 3900, 9000, 11000, 12750], group: 'green', description: 'Cradle of Civilization' },
  { id: 32, name: 'ASSAM', type: 'property', color: 'green', price: 3000, rent: [260, 1300, 3900, 9000, 11000, 12750], group: 'green', description: 'Gateway to Northeast' },
  { id: 33, name: 'COMMUNITY CHEST', type: 'community', description: 'Draw a community chest card' },
  { id: 34, name: 'MANIPUR', type: 'property', color: 'green', price: 3200, rent: [280, 1500, 4500, 10000, 12000, 14000], group: 'green', description: 'Jewel of India' },
  { id: 35, name: 'DELHI STATION', type: 'railroad', price: 2000, rent: [250, 500, 1000, 2000], description: 'Capital Gateway' },
  { id: 36, name: 'CHANCE', type: 'chance', description: 'Draw a chance card' },
  { id: 37, name: 'HIMACHAL PRADESH', type: 'property', color: 'darkblue', price: 3500, rent: [350, 1750, 5000, 11000, 13000, 15000], group: 'darkblue', description: 'Land of Snow' },
  { id: 38, name: 'LUXURY TAX', type: 'tax', description: 'Pay ₹1000', amount: 1000 },
  { id: 39, name: 'JAMMU & KASHMIR', type: 'property', color: 'darkblue', price: 4000, rent: [500, 2000, 6000, 14000, 17000, 20000], group: 'darkblue', description: 'Paradise on Earth' }
];

export const chanceCards = [
  { id: 1, title: 'Diwali Bonus', description: 'Collect ₹500 from all players - Festival gift celebration!', type: 'collect', amount: 500, fromAll: true },
  { id: 2, title: 'Bollywood Movie Shoot', description: 'Advance to GO (Collect ₹2000)', type: 'move', position: 0, collectGo: true },
  { id: 3, title: 'Cricket Match Tickets', description: 'Pay ₹150 for IPL match tickets', type: 'pay', amount: 150 },
  { id: 4, title: 'Sacred Ganga Aarti', description: 'Move to nearest Railroad and pay double rent', type: 'moveNearest', target: 'railroad', payDouble: true },
  { id: 5, title: 'Swachh Bharat Mission', description: 'Make general repairs: ₹250 per house, ₹1000 per hotel', type: 'repairs', house: 250, hotel: 1000 },
  { id: 6, title: 'Ayurveda Spa Retreat', description: 'Go back 3 spaces for wellness', type: 'moveBack', spaces: 3 },
  { id: 7, title: 'Holi Celebration', description: 'Pay each player ₹500 for colors and sweets', type: 'payAll', amount: 500 },
  { id: 8, title: 'Digital India Initiative', description: 'Collect ₹2000 from Bank for your tech startup', type: 'collect', amount: 2000 },
  { id: 9, title: 'Karma Returns', description: 'Go directly to Jail - Do not pass GO', type: 'goToJail' },
  { id: 10, title: 'International Yoga Day', description: 'Advance to Rajasthan', type: 'moveTo', position: 21 },
  { id: 11, title: 'Monsoon Festival', description: 'Collect ₹1000 from the Bank', type: 'collect', amount: 1000 },
  { id: 12, title: 'Heritage Conservation', description: 'Pay ₹500 for monument restoration', type: 'pay', amount: 500 }
];

export const communityChestCards = [
  { id: 1, title: 'Bank Error in Your Favor', description: 'Collect ₹2000', type: 'collect', amount: 2000 },
  { id: 2, title: 'Doctor Fees', description: 'Pay ₹500', type: 'pay', amount: 500 },
  { id: 3, title: 'Stock Market Success', description: 'From sale of stock you get ₹450', type: 'collect', amount: 450 },
  { id: 4, title: 'Get Out of Jail Free', description: 'This card may be kept until needed', type: 'jailFree' },
  { id: 5, title: 'Birthday Celebration', description: 'It is your birthday - Collect ₹100 from each player', type: 'collectFromAll', amount: 100 },
  { id: 6, title: 'Life Insurance Matures', description: 'Collect ₹1000', type: 'collect', amount: 1000 },
  { id: 7, title: 'Hospital Fees', description: 'Pay ₹1000', type: 'pay', amount: 1000 },
  { id: 8, title: 'School Fees', description: 'Pay ₹1500', type: 'pay', amount: 1500 },
  { id: 9, title: 'Consultancy Fee', description: 'Receive ₹250 consultancy fee', type: 'collect', amount: 250 },
  { id: 10, title: 'Street Repairs', description: 'You are assessed for street repairs: ₹400 per house, ₹1150 per hotel', type: 'repairs', house: 400, hotel: 1150 },
  { id: 11, title: 'Tax Refund', description: 'Collect ₹200', type: 'collect', amount: 200 },
  { id: 12, title: 'Grand Festival', description: 'Advance to GO (Collect ₹2000)', type: 'move', position: 0, collectGo: true }
];

export const mockGameState = {
  currentPlayer: 0,
  players: [
    {
      id: 1,
      name: 'Raj Kumar',
      avatar: '👑',
      money: 15000,
      position: 5,
      properties: [1, 3, 6],
      inJail: false,
      jailTurns: 0,
      color: '#DC2626'
    },
    {
      id: 2,
      name: 'Priya Singh',
      avatar: '💎',
      money: 12500,
      position: 15,
      properties: [11, 13, 16],
      inJail: false,
      jailTurns: 0,
      color: '#2563EB'
    },
    {
      id: 3,
      name: 'Amit Sharma',
      avatar: '🎭',
      money: 18000,
      position: 25,
      properties: [21, 23, 26],
      inJail: false,
      jailTurns: 0,
      color: '#059669'
    },
    {
      id: 4,
      name: 'Sunita Patel',
      avatar: '⭐',
      money: 8750,
      position: 35,
      properties: [31, 34],
      inJail: true,
      jailTurns: 1,
      color: '#D97706'
    }
  ],
  diceValues: [3, 4],
  turnPhase: 'roll', // roll, move, action, trade, endTurn
  gameLog: [
    'Game started with 4 premium players',
    'Raj Kumar rolled 6+2=8 and moved to Mumbai',
    'Priya Singh rolled 4+4=8 and moved to Bangalore Station',
    'Amit Sharma bought Rajasthan for ₹2200'
  ]
};

export const colorGroups = {
  brown: '#8B4513',
  lightblue: '#87CEEB',
  pink: '#FF1493',
  orange: '#FFA500',
  red: '#DC2626',
  yellow: '#EAB308',
  green: '#059669',
  darkblue: '#1E40AF'
};