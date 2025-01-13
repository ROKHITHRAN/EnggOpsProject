import React from "react";
import "./App.css";
import MainPage from "./components/MainPage";
import { GlobeIdProvider } from "./context/GlobeIdContext";

const App: React.FC = () => {
  return (
    <div className="App">
      <GlobeIdProvider>
        <MainPage />
      </GlobeIdProvider>
    </div>
  );
};

export default App;
