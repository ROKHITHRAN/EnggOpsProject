import React, { createContext, useState, useContext, ReactNode } from "react";

interface GlobeIdContextType {
  id: number | null;
  setId: React.Dispatch<React.SetStateAction<number | null>>;
  range: number | null;
  setRange: React.Dispatch<React.SetStateAction<number | null>>;
  distriIds: number[][] | null;
  setDistriIds: React.Dispatch<React.SetStateAction<number[][] | null>>;
}

// Create the context with a default value of undefined
const GlobeIdContext = createContext<GlobeIdContextType | undefined>(undefined);

interface GlobeIdProviderProps {
  children: ReactNode;
}

export const GlobeIdProvider: React.FC<GlobeIdProviderProps> = ({
  children,
}) => {
  const [id, setId] = useState<number | null>(null);
  const [range, setRange] = useState<number | null>(null);
  const[distriIds,setDistriIds] = useState<number[][]|null>([]);
  return (
    <GlobeIdContext.Provider value={{ id, setId, range, setRange,distriIds,setDistriIds}}>
      {children}
    </GlobeIdContext.Provider>
  );
};

// Custom hook to use the GlobeIdContext
export const useGlobeId = (): GlobeIdContextType => {
  const context = useContext(GlobeIdContext);
  if (!context) {
    throw new Error("useGlobeId must be used within a GlobeIdProvider");
  }
  return context;
};

export default GlobeIdContext;
