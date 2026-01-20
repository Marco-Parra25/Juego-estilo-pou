export const TICK_RATE_MS = 2000; // Stats decay every 2 seconds

// Decay rates per tick
export const DECAY_RATES = {
  hunger: 1.5,
  happiness: 1,
  energy: 0.5,
  hygiene: 0.8,
};

// Item costs and effects
export const FOOD_ITEMS = [
  { id: 'burger', name: 'Borgir', icon: '🍔', cost: 10, restore: 20 },
  { id: 'pizza', name: 'Pizza', icon: '🍕', cost: 15, restore: 30 },
  { id: 'broccoli', name: 'Veggie', icon: '🥦', cost: 5, restore: 10 },
  { id: 'sushi', name: 'Sushi', icon: '🍣', cost: 25, restore: 40 },
];

export const COLORS = {
  skin: '#FFDFC4', // Skin tone
  skinDirty: '#8B7D6B', // Muddy skin tone
  outline: '#8B4513', // Dark brown outline
  belly: '#FFF0E0', // Lighter belly
  veins: '#D32F2F', // Red veins
};