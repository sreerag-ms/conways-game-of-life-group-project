export const PATTERNS = {
  glider: {
    name: 'Glider',
    description: 'A small pattern that moves diagonally across the grid',
    width: 3,
    height: 3,
    cells: [
      [0, 1, 0],
      [0, 0, 1],
      [1, 1, 1],
    ],
  },
  blinker: {
    name: 'Blinker',
    description: 'A simple oscillator that alternates between horizontal and vertical states',
    width: 3,
    height: 3,
    cells: [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
  },
  toad: {
    name: 'Toad',
    description: 'A period 2 oscillator',
    width: 4,
    height: 4,
    cells: [
      [0, 0, 0, 0],
      [0, 1, 1, 1],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
    ],
  },
  beacon: {
    name: 'Beacon',
    description: 'A period 2 oscillator',
    width: 4,
    height: 4,
    cells: [
      [1, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 1, 1],
      [0, 0, 1, 1],
    ],
  },

  block: {
    name: 'Block',
    description: 'A simple still life, the smallest square pattern',
    width: 2,
    height: 2,
    cells: [
      [1, 1],
      [1, 1],
    ],
  },

  beehive: {
    name: 'Beehive',
    description: 'A common still life with 6 cells',
    width: 4,
    height: 3,
    cells: [
      [0, 1, 1, 0],
      [1, 0, 0, 1],
      [0, 1, 1, 0],
    ],
  },

  loaf: {
    name: 'Loaf',
    description: 'A stable pattern resembling a loaf of bread',
    width: 4,
    height: 4,
    cells: [
      [0, 1, 1, 0],
      [1, 0, 0, 1],
      [0, 1, 0, 1],
      [0, 0, 1, 0],
    ],
  },

  boat: {
    name: 'Boat',
    description: 'A small still life with 5 cells',
    width: 3,
    height: 3,
    cells: [
      [1, 1, 0],
      [1, 0, 1],
      [0, 1, 0],
    ],
  },

  tub: {
    name: 'Tub',
    description: 'A symmetrical still life with 4 cells',
    width: 3,
    height: 3,
    cells: [
      [0, 1, 0],
      [1, 0, 1],
      [0, 1, 0],
    ],
  },

  pulsar: {
    name: 'Pulsar',
    description: 'A period 3 oscillator - one of the largest and most common',
    width: 13,
    height: 13,
    cells: [
      [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1],
      [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
      [1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
    ],
  },

  pentadecathlon: {
    name: 'Pentadecathlon',
    description: 'A period 15 oscillator composed of 10 cells',
    width: 10,
    height: 3,
    cells: [
      [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
      [1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
      [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    ],
  },

  lightweightSpaceship: {
    name: 'LWSS',
    description: 'Lightweight Spaceship - moves horizontally across the grid',
    width: 5,
    height: 4,
    cells: [
      [0, 1, 1, 1, 1],
      [1, 0, 0, 0, 1],
      [0, 0, 0, 0, 1],
      [1, 0, 0, 1, 0],
    ],
  },

  middleweightSpaceship: {
    name: 'MWSS',
    description: 'Middleweight Spaceship - slightly larger than LWSS',
    width: 6,
    height: 5,
    cells: [
      [0, 0, 0, 1, 0, 0],
      [0, 1, 1, 0, 0, 1],
      [1, 1, 0, 0, 0, 1],
      [1, 1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 0],
    ],
  },

  heavyweightSpaceship: {
    name: 'HWSS',
    description: 'Heavyweight Spaceship - largest basic spaceship',
    width: 7,
    height: 5,
    cells: [
      [0, 0, 0, 1, 1, 0, 0],
      [0, 1, 1, 0, 0, 0, 1],
      [1, 1, 0, 0, 0, 0, 1],
      [1, 1, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 0],
    ],
  },

  rPentomino: {
    name: 'R-Pentomino',
    description: 'A methuselah that evolves for many generations before stabilizing',
    width: 3,
    height: 3,
    cells: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 1, 0],
    ],
  },

  diehard: {
    name: 'Diehard',
    description: 'A pattern that disappears after 130 generations',
    width: 8,
    height: 3,
    cells: [
      [0, 0, 0, 0, 0, 0, 1, 0],
      [1, 1, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 1, 1, 1],
    ],
  },

  acorn: {
    name: 'Acorn',
    description: 'A methuselah that evolves for 5206 generations',
    width: 7,
    height: 3,
    cells: [
      [0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [1, 1, 0, 0, 1, 1, 1],
    ],
  },

  gosperGliderGun: {
    name: 'Gosper Glider Gun',
    description: 'The first known gun pattern, repeatedly creates gliders',
    width: 36,
    height: 9,
    cells: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
  },

  cross: {
    name: 'Cross',
    description: 'A small symmetric pattern that evolves interestingly',
    width: 10,
    height: 10,
    cells: [
      [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
      [1, 1, 0, 1, 0, 0, 1, 0, 1, 1],
      [1, 1, 0, 1, 0, 0, 1, 0, 1, 1],
      [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
    ],
  },

  infiniteGrowth: {
    name: 'Infinite Growth',
    description: 'A pattern that grows indefinitely in one direction',
    width: 9,
    height: 5,
    cells: [
      [1, 1, 1, 0, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 1, 1, 1],
      [0, 1, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
  },

  gliderSynthesis: {
    name: 'Glider Synthesis',
    description: 'Two gliders that collide to form a block',
    width: 7,
    height: 8,
    cells: [
      [1, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 0],
      [1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 1, 0, 1],
      [0, 0, 0, 0, 0, 1, 1],
    ],
  },

  pufferTrain: {
    name: 'Puffer Train',
    description: 'Leaves debris while moving across the grid',
    width: 18,
    height: 8,
    cells: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
      [1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0],
    ],
  },

  weekender: {
    name: 'Weekender',
    description: 'A spaceship with period 7',
    width: 16,
    height: 10,
    cells: [
      [0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
  },

  queenBee: {
    name: 'Queen Bee Shuttle',
    description: 'An oscillator with period 30',
    width: 22,
    height: 7,
    cells: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    ],
  },
  // {
  //   name: 'Gosper Breeder',
  //   description: '…',
  //   width: 129,
  //   height: 94,
  //   cells:
  // }
};
