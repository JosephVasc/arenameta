import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Region = 'us' | 'eu';

interface RegionContextType {
  region: Region;
  setRegion: (region: Region) => void;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

export function RegionProvider({ children }: { children: ReactNode }) {
  const [region, setRegion] = useState<Region>('us');

  useEffect(() => {
    const savedRegion = localStorage.getItem('region');
    if (savedRegion === 'us' || savedRegion === 'eu') {
      setRegion(savedRegion);
    }
  }, []);

  const handleSetRegion = (newRegion: Region) => {
    setRegion(newRegion);
    localStorage.setItem('region', newRegion);
  };

  return (
    <RegionContext.Provider value={{ region, setRegion: handleSetRegion }}>
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  const context = useContext(RegionContext);
  if (context === undefined) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
} 