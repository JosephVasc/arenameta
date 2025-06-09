'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type GameVersion = 'retail' | 'classic';

interface GameVersionContextType {
  gameVersion: GameVersion;
  setGameVersion: (version: GameVersion) => void;
}

const GameVersionContext = createContext<GameVersionContextType | undefined>(undefined);

export function GameVersionProvider({ children }: { children: React.ReactNode }) {
  const [gameVersion, setGameVersion] = useState<GameVersion>('retail');

  // Load game version from localStorage on mount
  useEffect(() => {
    const savedVersion = localStorage.getItem('gameVersion') as GameVersion;
    if (savedVersion) {
      setGameVersion(savedVersion);
    }
  }, []);

  // Save game version to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('gameVersion', gameVersion);
  }, [gameVersion]);

  return (
    <GameVersionContext.Provider value={{ gameVersion, setGameVersion }}>
      {children}
    </GameVersionContext.Provider>
  );
}

export function useGameVersion() {
  const context = useContext(GameVersionContext);
  if (context === undefined) {
    throw new Error('useGameVersion must be used within a GameVersionProvider');
  }
  return context;
} 