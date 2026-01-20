export enum Mood {
  HAPPY = 'HAPPY',
  SAD = 'SAD',
  ANGRY = 'ANGRY',
  SLEEPY = 'SLEEPY',
  EATING = 'EATING',
  DEAD = 'DEAD', // Game over state
}

export interface Stats {
  hunger: number;   // 0-100 (100 is full)
  happiness: number; // 0-100
  energy: number;   // 0-100
  hygiene: number;  // 0-100
}

export interface GameState {
  stats: Stats;
  coins: number;
  level: number;
  isSleeping: boolean;
  poopCount: number;
}

export type Particle = {
  id: number;
  x: number;
  y: number;
  emoji: string;
};