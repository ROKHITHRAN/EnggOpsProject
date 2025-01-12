import React, { createContext, useState, useContext } from "react";

const GlobeIdContext = createContext();

export const GlobeIdProvider = ({ children }) => {
  const [id, setId] = useState(null);
  const [range,setRange] = useState();
  return (
    <GlobeIdContext.Provider value={{ id, setId, range, setRange}}>
      {children}
    </GlobeIdContext.Provider>
  );
};

// Custom hook to use the GlobeIdContext
export const useGlobeId = () => {
  const context = useContext(GlobeIdContext);
  if (!context) {
    throw new Error("useGlobeId must be used within a GlobeIdProvider");
  }
  return context;
};

export default GlobeIdContext;
