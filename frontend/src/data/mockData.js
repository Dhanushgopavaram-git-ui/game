// Mock data for Indian Heritage Monopoly

export const indianProperties = [
  // Corner spaces
  { id: 0, name: 'GO', type: 'corner', nameHindi: 'शुरुआत', description: 'Collect ₹2000 salary as you pass', position: 'bottom-right' },
  { id: 10, name: 'JAIL', type: 'corner', nameHindi: 'जेल', description: 'Just visiting or in jail', position: 'bottom-left' },
  { id: 20, name: 'FREE PARKING', type: 'corner', nameHindi: 'मुफ्त पार्किंग', description: 'Free resting place', position: 'top-left' },
  { id: 30, name: 'GO TO JAIL', type: 'corner', nameHindi: 'जेल जाओ', description: 'Go directly to jail', position: 'top-right' },

  // Properties - Bottom side (1-9)
  { id: 1, name: 'GOA', type: 'property', nameHindi: 'गोवा', color: 'brown', price: 600, rent: [20, 100, 300, 900, 1600, 2500], group: 'brown' },
  { id: 2, name: 'COMMUNITY CHEST', type: 'community', nameHindi: 'सामुदायिक खजाना', description: 'Draw a community chest card' },
  { id: 3, name: 'ORLE', type: 'property', nameHindi: 'उड़ले', color: 'brown', price: 600, rent: [40, 200, 600, 1800, 3200, 4500], group: 'brown' },
  { id: 4, name: 'INCOME TAX', type: 'tax', nameHindi: 'आयकर', description: 'Pay ₹2000 or 10% of total worth', amount: 2000 },
  { id: 5, name: 'CHANDIGARH STATION', type: 'railroad', nameHindi: 'चंडीगढ़ स्टेशन', price: 2000, rent: [250, 500, 1000, 2000] },
  { id: 6, name: 'MUMBAI', type: 'property', nameHindi: 'मुंबई', color: 'lightblue', price: 1000, rent: [60, 300, 900, 2700, 4000, 5500], group: 'lightblue' },
  { id: 7, name: 'CHANCE', type: 'chance', nameHindi: 'संयोग', description: 'Draw a chance card' },
  { id: 8, name: 'JAIPUR', type: 'property', nameHindi: 'जयपुर', color: 'lightblue', price: 1000, rent: [60, 300, 900, 2700, 4000, 5500], group: 'lightblue' },
  { id: 9, name: 'HYDERABAD', type: 'property', nameHindi: 'हैदराबाद', color: 'lightblue', price: 1200, rent: [80, 400, 1000, 3000, 4500, 6000], group: 'lightblue' },

  // Left side (11-19)
  { id: 11, name: 'CHENNAI', type: 'property', nameHindi: 'चेन्नई', color: 'pink', price: 1400, rent: [100, 500, 1500, 4500, 6250, 7500], group: 'pink' },
  { id: 12, name: 'ELECTRIC COMPANY', type: 'utility', nameHindi: 'विद्युत कंपनी', price: 1500, description: 'Pay 4x or 10x dice roll' },
  { id: 13, name: 'KARNATAKA', type: 'property', nameHindi: 'कर्नाटक', color: 'pink', price: 1400, rent: [100, 500, 1500, 4500, 6250, 7500], group: 'pink' },
  { id: 14, name: 'ANDHRA PRADESH', type: 'property', nameHindi: 'आंध्र प्रदेश', color: 'pink', price: 1600, rent: [120, 600, 1800, 5000, 7000, 9000], group: 'pink' },
  { id: 15, name: 'BANGALORE STATION', type: 'railroad', nameHindi: 'बैंगलोर स्टेशन', price: 2000, rent: [250, 500, 1000, 2000] },
  { id: 16, name: 'KERALA', type: 'property', nameHindi: 'केरल', color: 'orange', price: 1800, rent: [140, 700, 2000, 5500, 7500, 9500], group: 'orange' },
  { id: 17, name: 'COMMUNITY CHEST', type: 'community', nameHindi: 'सामुदायिक खजाना', description: 'Draw a community chest card' },
  { id: 18, name: 'TAMILNADU', type: 'property', nameHindi: 'तमिलनाडु', color: 'orange', price: 1800, rent: [140, 700, 2000, 5500, 7500, 9500], group: 'orange' },
  { id: 19, name: 'TELANGANA', type: 'property', nameHindi: 'तेलंगाना', color: 'orange', price: 2000, rent: [160, 800, 2200, 6000, 8000, 10000], group: 'orange' },

  // Top side (21-29)
  { id: 21, name: 'RAJASTHAN', type: 'property', nameHindi: 'राजस्थान', color: 'red', price: 2200, rent: [180, 900, 2500, 7000, 8750, 10500], group: 'red' },
  { id: 22, name: 'CHANCE', type: 'chance', nameHindi: 'संयोग', description: 'Draw a chance card' },
  { id: 23, name: 'UTTAR PRADESH', type: 'property', nameHindi: 'उत्तर प्रदेश', color: 'red', price: 2200, rent: [180, 900, 2500, 7000, 8750, 10500], group: 'red' },
  { id: 24, name: 'BIHAR', type: 'property', nameHindi: 'बिहार', color: 'red', price: 2400, rent: [200, 1000, 3000, 9000, 11000, 12500], group: 'red' },
  { id: 25, name: 'KOLKATA STATION', type: 'railroad', nameHindi: 'कोलकाता स्टेशन', price: 2000, rent: [250, 500, 1000, 2000] },
  { id: 26, name: 'WEST BENGAL', type: 'property', nameHindi: 'पश्चिम बंगाल', color: 'yellow', price: 2600, rent: [220, 1100, 3300, 8000, 9750, 11500], group: 'yellow' },
  { id: 27, name: 'WATER WORKS', type: 'utility', nameHindi: 'जल आपूर्ति', price: 1500, description: 'Pay 4x or 10x dice roll' },
  { id: 28, name: 'MADHYA PRADESH', type: 'property', nameHindi: 'मध्य प्रदेश', color: 'yellow', price: 2600, rent: [220, 1100, 3300, 8000, 9750, 11500], group: 'yellow' },
  { id: 29, name: 'PUNJAB', type: 'property', nameHindi: 'पंजाब', color: 'yellow', price: 2800, rent: [240, 1200, 3600, 8500, 10250, 12000], group: 'yellow' },

  // Right side (31-39)
  { id: 31, name: 'HARYANA', type: 'property', nameHindi: 'हरियाणा', color: 'green', price: 3000, rent: [260, 1300, 3900, 9000, 11000, 12750], group: 'green' },
  { id: 32, name: 'ASSAM', type: 'property', nameHindi: 'असम', color: 'green', price: 3000, rent: [260, 1300, 3900, 9000, 11000, 12750], group: 'green' },
  { id: 33, name: 'COMMUNITY CHEST', type: 'community', nameHindi: 'सामुदायिक खजाना', description: 'Draw a community chest card' },
  { id: 34, name: 'MANIPUR', type: 'property', nameHindi: 'मणिपुर', color: 'green', price: 3200, rent: [280, 1500, 4500, 10000, 12000, 14000], group: 'green' },
  { id: 35, name: 'DELHI STATION', type: 'railroad', nameHindi: 'दिल्ली स्टेशन', price: 2000, rent: [250, 500, 1000, 2000] },
  { id: 36, name: 'CHANCE', type: 'chance', nameHindi: 'संयोग', description: 'Draw a chance card' },
  { id: 37, name: 'HIMACHAL PRADESH', type: 'property', nameHindi: 'हिमाचल प्रदेश', color: 'darkblue', price: 3500, rent: [350, 1750, 5000, 11000, 13000, 15000], group: 'darkblue' },
  { id: 38, name: 'LUXURY TAX', type: 'tax', nameHindi: 'विलासिता कर', description: 'Pay ₹1000', amount: 1000 },
  { id: 39, name: 'JAMMU & KASHMIR', type: 'property', nameHindi: 'जम्मू और कश्मीर', color: 'darkblue', price: 4000, rent: [500, 2000, 6000, 14000, 17000, 20000], group: 'darkblue' }
];

export const chanceCards = [
  { id: 1, title: 'दिवाली बोनस', titleEnglish: 'Diwali Bonus', description: 'सभी से ₹500 प्राप्त करें - Festival gift from all players!', type: 'collect', amount: 500, fromAll: true },
  { id: 2, title: 'बॉलीवुड मूवी शूट', titleEnglish: 'Bollywood Movie Shoot', description: 'Advance to GO (Collect ₹2000)', type: 'move', position: 0, collectGo: true },
  { id: 3, title: 'क्रिकेट मैच टिकट', titleEnglish: 'Cricket Match Tickets', description: 'Pay ₹150 for IPL match tickets', type: 'pay', amount: 150 },
  { id: 4, title: 'गंगा आरती', titleEnglish: 'Ganga Aarti', description: 'Move to nearest Railroad and pay double rent', type: 'moveNearest', target: 'railroad', payDouble: true },
  { id: 5, title: 'स्वच्छ भारत अभियान', titleEnglish: 'Swachh Bharat Mission', description: 'Make general repairs: ₹250 per house, ₹1000 per hotel', type: 'repairs', house: 250, hotel: 1000 },
  { id: 6, title: 'आयुर्वेद स्पा', titleEnglish: 'Ayurveda Spa', description: 'Go back 3 spaces', type: 'moveBack', spaces: 3 },
  { id: 7, title: 'होली सेलिब्रेशन', titleEnglish: 'Holi Celebration', description: 'Pay each player ₹500 for colors and sweets', type: 'payAll', amount: 500 },
  { id: 8, title: 'डिजिटल इंडिया', titleEnglish: 'Digital India', description: 'Collect ₹2000 from Bank for your tech startup', type: 'collect', amount: 2000 },
  { id: 9, title: 'कर्म का फल', titleEnglish: 'Karma Returns', description: 'Go directly to Jail', type: 'goToJail' },
  { id: 10, title: 'योग दिवस', titleEnglish: 'International Yoga Day', description: 'Advance to Rajasthan', type: 'moveTo', position: 21 }
];

export const communityChestCards = [
  { id: 1, title: 'बैंक त्रुटि', titleEnglish: 'Bank Error', description: 'Bank error in your favor - Collect ₹2000', type: 'collect', amount: 2000 },
  { id: 2, title: 'डॉक्टर की फीस', titleEnglish: 'Doctor Fee', description: 'Doctor fees - Pay ₹500', type: 'pay', amount: 500 },
  { id: 3, title: 'स्टॉक सेल', titleEnglish: 'Stock Sale', description: 'From sale of stock you get ₹450', type: 'collect', amount: 450 },
  { id: 4, title: 'गेट आउट ऑफ जेल', titleEnglish: 'Get Out of Jail Free', description: 'This card may be kept until needed', type: 'jailFree' },
  { id: 5, title: 'जन्मदिन', titleEnglish: 'Birthday', description: 'It is your birthday - Collect ₹100 from each player', type: 'collectFromAll', amount: 100 },
  { id: 6, title: 'लाइफ इंश्योरेंस', titleEnglish: 'Life Insurance', description: 'Life Insurance matures - Collect ₹1000', type: 'collect', amount: 1000 },
  { id: 7, title: 'हॉस्पिटल फीस', titleEnglish: 'Hospital Fee', description: 'Hospital fees - Pay ₹1000', type: 'pay', amount: 1000 },
  { id: 8, title: 'स्कूल फीस', titleEnglish: 'School Fee', description: 'School fees - Pay ₹1500', type: 'pay', amount: 1500 },
  { id: 9, title: 'कंसल्टेंसी फीस', titleEnglish: 'Consultancy Fee', description: 'Receive ₹250 consultancy fee', type: 'collect', amount: 250 },
  { id: 10, title: 'स्ट्रीट रिपेयर', titleEnglish: 'Street Repairs', description: 'You are assessed for street repairs: ₹400 per house, ₹1150 per hotel', type: 'repairs', house: 400, hotel: 1150 }
];

export const mockGameState = {
  currentPlayer: 0,
  players: [
    {
      id: 1,
      name: 'राज Kumar',
      avatar: '🤴',
      money: 15000,
      position: 5,
      properties: [1, 3, 6],
      inJail: false,
      jailTurns: 0,
      color: '#e74c3c'
    },
    {
      id: 2,
      name: 'प्रिया Singh',
      avatar: '👸',
      money: 12500,
      position: 15,
      properties: [11, 13, 16],
      inJail: false,
      jailTurns: 0,
      color: '#3498db'
    },
    {
      id: 3,
      name: 'अमित Sharma',
      avatar: '🧔',
      money: 18000,
      position: 25,
      properties: [21, 23, 26],
      inJail: false,
      jailTurns: 0,
      color: '#2ecc71'
    },
    {
      id: 4,
      name: 'सुनिता Patel',
      avatar: '👩‍💼',
      money: 8750,
      position: 35,
      properties: [31, 34],
      inJail: true,
      jailTurns: 1,
      color: '#f39c12'
    }
  ],
  diceValues: [3, 4],
  turnPhase: 'roll', // roll, move, action, trade, endTurn
  gameLog: [
    'Game started with 4 players',
    'राज Kumar rolled 6+2=8 and moved to Mumbai',
    'प्रिया Singh rolled 4+4=8 and moved to Bangalore Station',
    'अमित Sharma bought Rajasthan for ₹2200'
  ]
};

export const colorGroups = {
  brown: '#8B4513',
  lightblue: '#87CEEB',
  pink: '#FF1493',
  orange: '#FFA500',
  red: '#FF0000',
  yellow: '#FFFF00',
  green: '#008000',
  darkblue: '#000080'
};