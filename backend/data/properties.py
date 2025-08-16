# Exact property data matching the board image

PROPERTIES = [
    # Corner spaces
    {"id": 0, "name": "GO", "type": "corner", "description": "Collect ₹2000 salary as you pass"},
    {"id": 10, "name": "JAIL", "type": "corner", "description": "Just Visiting / In Jail"},
    {"id": 20, "name": "FREE PARKING", "type": "corner", "description": "Free resting place"},
    {"id": 30, "name": "GO TO JAIL", "type": "corner", "description": "Go directly to jail"},

    # Bottom side (1-9)
    {"id": 1, "name": "GOAS", "type": "property", "color": "brown", "price": 600, "rent": [20, 100, 300, 900, 1600, 2500], "group": "brown", "description": "Beautiful Beaches"},
    {"id": 2, "name": "COMMUNITY CHEST", "type": "community", "description": "Draw a community chest card"},
    {"id": 3, "name": "ORLE", "type": "property", "color": "brown", "price": 600, "rent": [40, 200, 600, 1800, 3200, 4500], "group": "brown", "description": "Historic State"},
    {"id": 4, "name": "INCOME TAX", "type": "tax", "description": "Pay ₹2000 income tax", "amount": 2000},
    {"id": 5, "name": "CHANDIGARH STATION", "type": "railroad", "price": 2000, "rent": [250, 500, 1000, 2000], "description": "The Beautiful City"},
    {"id": 6, "name": "MUMBAI", "type": "property", "color": "lightblue", "price": 1000, "rent": [60, 300, 900, 2700, 4000, 5500], "group": "lightblue", "description": "Financial Capital"},
    {"id": 7, "name": "CHANCE", "type": "chance", "description": "Draw a chance card"},
    {"id": 8, "name": "JAIPUR", "type": "property", "color": "lightblue", "price": 1000, "rent": [60, 300, 900, 2700, 4000, 5500], "group": "lightblue", "description": "The Pink City"},
    {"id": 9, "name": "HYDERABAD", "type": "property", "color": "lightblue", "price": 1200, "rent": [80, 400, 1000, 3000, 4500, 6000], "group": "lightblue", "description": "City of Pearls"},

    # Left side (11-19)
    {"id": 11, "name": "CHENNAI", "type": "property", "color": "pink", "price": 1400, "rent": [100, 500, 1500, 4500, 6250, 7500], "group": "pink", "description": "Detroit of India"},
    {"id": 12, "name": "ELECTRIC COMPANY", "type": "utility", "price": 1500, "description": "Pay 4x or 10x dice roll"},
    {"id": 13, "name": "KARNATAKA", "type": "property", "color": "pink", "price": 1400, "rent": [100, 500, 1500, 4500, 6250, 7500], "group": "pink", "description": "Silicon Valley of India"},
    {"id": 14, "name": "ANDHRA PRADESH", "type": "property", "color": "pink", "price": 1600, "rent": [120, 600, 1800, 5000, 7000, 9000], "group": "pink", "description": "Rice Bowl of India"},
    {"id": 15, "name": "BANGALORE STATION", "type": "railroad", "price": 2000, "rent": [250, 500, 1000, 2000], "description": "Garden City Station"},
    {"id": 16, "name": "KERALA", "type": "property", "color": "orange", "price": 1800, "rent": [140, 700, 2000, 5500, 7500, 9500], "group": "orange", "description": "God's Own Country"},
    {"id": 17, "name": "COMMUNITY CHEST", "type": "community", "description": "Draw a community chest card"},
    {"id": 18, "name": "TAMILNADU", "type": "property", "color": "orange", "price": 1800, "rent": [140, 700, 2000, 5500, 7500, 9500], "group": "orange", "description": "Land of Temples"},
    {"id": 19, "name": "TELANGANA", "type": "property", "color": "orange", "price": 2000, "rent": [160, 800, 2200, 6000, 8000, 10000], "group": "orange", "description": "Youngest State"},

    # Top side (21-29)
    {"id": 21, "name": "RAJASTHAN", "type": "property", "color": "red", "price": 2200, "rent": [180, 900, 2500, 7000, 8750, 10500], "group": "red", "description": "Land of Kings"},
    {"id": 22, "name": "CHANCE", "type": "chance", "description": "Draw a chance card"},
    {"id": 23, "name": "UTTAR PRADESH", "type": "property", "color": "red", "price": 2200, "rent": [180, 900, 2500, 7000, 8750, 10500], "group": "red", "description": "Heartland of India"},
    {"id": 24, "name": "BIHAR", "type": "property", "color": "red", "price": 2400, "rent": [200, 1000, 3000, 9000, 11000, 12500], "group": "red", "description": "Ancient Wisdom"},
    {"id": 25, "name": "KOLKATA STATION", "type": "railroad", "price": 2000, "rent": [250, 500, 1000, 2000], "description": "Cultural Capital Station"},
    {"id": 26, "name": "WEST BENGAL", "type": "property", "color": "yellow", "price": 2600, "rent": [220, 1100, 3300, 8000, 9750, 11500], "group": "yellow", "description": "Cultural Hub"},
    {"id": 27, "name": "WATER WORKS", "type": "utility", "price": 1500, "description": "Pay 4x or 10x dice roll"},
    {"id": 28, "name": "MADHYA PRADESH", "type": "property", "color": "yellow", "price": 2600, "rent": [220, 1100, 3300, 8000, 9750, 11500], "group": "yellow", "description": "Heart of India"},
    {"id": 29, "name": "PUNJAB", "type": "property", "color": "yellow", "price": 2800, "rent": [240, 1200, 3600, 8500, 10250, 12000], "group": "yellow", "description": "Land of Five Rivers"},

    # Right side (31-39)
    {"id": 31, "name": "HARYANA", "type": "property", "color": "green", "price": 3000, "rent": [260, 1300, 3900, 9000, 11000, 12750], "group": "green", "description": "Cradle of Civilization"},
    {"id": 32, "name": "ASSAM", "type": "property", "color": "green", "price": 3000, "rent": [260, 1300, 3900, 9000, 11000, 12750], "group": "green", "description": "Gateway to Northeast"},
    {"id": 33, "name": "COMMUNITY CHEST", "type": "community", "description": "Draw a community chest card"},
    {"id": 34, "name": "MANIPUR", "type": "property", "color": "green", "price": 3200, "rent": [280, 1500, 4500, 10000, 12000, 14000], "group": "green", "description": "Jewel of India"},
    {"id": 35, "name": "DELHI STATION", "type": "railroad", "price": 2000, "rent": [250, 500, 1000, 2000], "description": "Capital Gateway"},
    {"id": 36, "name": "CHANCE", "type": "chance", "description": "Draw a chance card"},
    {"id": 37, "name": "HIMACHAL PRADESH", "type": "property", "color": "darkblue", "price": 3500, "rent": [350, 1750, 5000, 11000, 13000, 15000], "group": "darkblue", "description": "Land of Snow"},
    {"id": 38, "name": "LUXURY TAX", "type": "tax", "description": "Pay ₹1000 luxury tax", "amount": 1000},
    {"id": 39, "name": "JAMMU & KASHMIR", "type": "property", "color": "darkblue", "price": 4000, "rent": [500, 2000, 6000, 14000, 17000, 20000], "group": "darkblue", "description": "Paradise on Earth"}
]

CHANCE_CARDS = [
    {"id": 1, "title": "Advance to GO", "description": "Collect ₹2000 as you pass GO", "type": "move", "position": 0, "collect_go": True},
    {"id": 2, "title": "Bank Error in Your Favor", "description": "Collect ₹2000", "type": "collect", "amount": 2000},
    {"id": 3, "title": "Doctor's Fee", "description": "Pay ₹500", "type": "pay", "amount": 500},
    {"id": 4, "title": "Get Out of Jail Free", "description": "This card may be kept until needed", "type": "jailFree"},
    {"id": 5, "title": "Go to Jail", "description": "Go directly to jail. Do not pass GO", "type": "goToJail"},
    {"id": 6, "title": "Grand Opera Opening", "description": "Collect ₹500 from every player for opening night seats", "type": "collectFromAll", "amount": 500},
    {"id": 7, "title": "Holiday Fund Matures", "description": "Receive ₹1000", "type": "collect", "amount": 1000},
    {"id": 8, "title": "Income Tax Refund", "description": "Collect ₹200", "type": "collect", "amount": 200},
    {"id": 9, "title": "Life Insurance Matures", "description": "Collect ₹1000", "type": "collect", "amount": 1000},
    {"id": 10, "title": "Pay Hospital Fees", "description": "Pay ₹1000", "type": "pay", "amount": 1000},
    {"id": 11, "title": "Pay School Fees", "description": "Pay ₹1500", "type": "pay", "amount": 1500},
    {"id": 12, "title": "Receive Consultancy Fee", "description": "Receive ₹250", "type": "collect", "amount": 250}
]

COMMUNITY_CHEST_CARDS = [
    {"id": 1, "title": "Advance to GO", "description": "Collect ₹2000", "type": "move", "position": 0, "collect_go": True},
    {"id": 2, "title": "Bank Error in Your Favor", "description": "Collect ₹2000", "type": "collect", "amount": 2000},
    {"id": 3, "title": "Doctor's Fee", "description": "Pay ₹500", "type": "pay", "amount": 500},
    {"id": 4, "title": "From Sale of Stock", "description": "You get ₹450", "type": "collect", "amount": 450},
    {"id": 5, "title": "Get Out of Jail Free", "description": "This card may be kept until needed", "type": "jailFree"},
    {"id": 6, "title": "Go to Jail", "description": "Go directly to jail. Do not pass GO", "type": "goToJail"},
    {"id": 7, "title": "Holiday Fund Matures", "description": "Receive ₹1000", "type": "collect", "amount": 1000},
    {"id": 8, "title": "Income Tax Refund", "description": "Collect ₹200", "type": "collect", "amount": 200},
    {"id": 9, "title": "It is Your Birthday", "description": "Collect ₹100 from every player", "type": "collectFromAll", "amount": 100},
    {"id": 10, "title": "Life Insurance Matures", "description": "Collect ₹1000", "type": "collect", "amount": 1000},
    {"id": 11, "title": "Pay Hospital Fees", "description": "Pay ₹1000", "type": "pay", "amount": 1000},
    {"id": 12, "title": "Pay School Fees", "description": "Pay ₹1500", "type": "pay", "amount": 1500}
]